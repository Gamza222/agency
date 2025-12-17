/**
 * Rate Limiting Service
 *
 * Handles rate limiting for API endpoints and user actions.
 * Universal rate limiting service for enterprise applications.
 */

import { RateLimitConfig, RateLimitInfo } from '../../types/security.types';
import { securityConfig } from '../security-config';

// ============================================================================
// RATE LIMITER SERVICE
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimiterService {
  private static instance: RateLimiterService;
  private rateLimitStore: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  public constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredEntries();
      },
      5 * 60 * 1000
    );
  }

  public static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService();
    }
    return RateLimiterService.instance;
  }

  /**
   * Check rate limit for a key
   */
  public checkRateLimit(
    key: string,
    config?: Partial<RateLimitConfig>
  ): { allowed: boolean; info: RateLimitInfo } {
    const now = Date.now();
    const finalConfig = { ...securityConfig.rateLimit, ...config };

    // Get or create rate limit entry
    let entry = this.rateLimitStore.get(key);

    if (!entry || entry.resetTime <= now) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + finalConfig.windowMs,
        blocked: false,
      };
      this.rateLimitStore.set(key, entry);
    }

    // Check if already blocked
    if (entry.blocked && entry.resetTime > now) {
      return {
        allowed: false,
        info: this.getRateLimitInfo(key),
      };
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > finalConfig.maxRequests) {
      entry.blocked = true;
      return {
        allowed: false,
        info: this.getRateLimitInfo(key),
      };
    }

    return {
      allowed: true,
      info: this.getRateLimitInfo(key),
    };
  }

  /**
   * Get rate limit information for a key
   */
  public getRateLimitInfo(key: string): RateLimitInfo {
    const entry = this.rateLimitStore.get(key);
    const config = securityConfig.rateLimit;

    if (!entry) {
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests,
        reset: new Date(Date.now() + config.windowMs),
      };
    }

    const now = Date.now();
    const remaining = Math.max(0, config.maxRequests - entry.count);
    const resetTime = entry.resetTime > now ? entry.resetTime : now + config.windowMs;

    return {
      limit: config.maxRequests,
      remaining,
      reset: new Date(resetTime),
      retryAfter:
        entry.blocked && entry.resetTime > now
          ? Math.ceil((entry.resetTime - now) / 1000)
          : undefined,
    };
  }

  /**
   * Reset rate limit for a key
   */
  public resetRateLimit(key: string): void {
    this.rateLimitStore.delete(key);
  }

  /**
   * Generate rate limit key from request
   */
  public generateKey(identifier: string, endpoint?: string, method?: string): string {
    const parts = [identifier];

    if (endpoint) {
      parts.push(endpoint);
    }

    if (method) {
      parts.push(method);
    }

    return parts.join(':');
  }

  /**
   * Get all active rate limits
   */
  public getAllActiveRateLimits(): Array<{ key: string; info: RateLimitInfo }> {
    const activeLimits: Array<{ key: string; info: RateLimitInfo }> = [];
    const entries = Array.from(this.rateLimitStore.entries());

    for (const [key, entry] of entries) {
      const info = this.getRateLimitInfo(key);
      if (entry.count > 0 || entry.blocked) {
        activeLimits.push({ key, info });
      }
    }

    return activeLimits;
  }

  /**
   * Get rate limit statistics
   */
  public getStatistics(): {
    totalKeys: number;
    activeKeys: number;
    blockedKeys: number;
    totalRequests: number;
  } {
    const now = Date.now();
    let activeKeys = 0;
    let blockedKeys = 0;
    let totalRequests = 0;

    const entries = Array.from(this.rateLimitStore.entries());
    for (const [, entry] of entries) {
      if (entry.resetTime > now) {
        activeKeys++;
        totalRequests += entry.count;

        if (entry.blocked) {
          blockedKeys++;
        }
      }
    }

    return {
      totalKeys: this.rateLimitStore.size,
      activeKeys,
      blockedKeys,
      totalRequests,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();

    for (const [key, entry] of Array.from(this.rateLimitStore.entries())) {
      if (entry.resetTime <= now) {
        this.rateLimitStore.delete(key);
      }
    }
  }

  /**
   * Destroy the service and clean up resources
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.rateLimitStore.clear();
  }
}

// Export singleton instance
export const rateLimiterService = RateLimiterService.getInstance();
