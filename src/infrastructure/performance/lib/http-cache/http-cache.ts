/**
 * HTTP Caching Utilities
 *
 * HTTP caching strategies and configuration for maximum performance.
 * Built on top of existing performance monitoring infrastructure.
 */

import type {
  CacheStrategyConfig,
  HTTPCacheConfig,
  PerformanceMetric,
} from '../../types/performance.types';
import { PerformanceRating } from '../../types/performance.enums';
import { performanceMonitor } from '../performance-monitor';

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

// const _DEFAULT_CACHE_CONFIG: HTTPCacheConfig = {
//   maxAge: 31536000, // 1 year
//   sMaxAge: 31536000, // 1 year
//   etag: true,
//   lastModified: true,
//   directives: ['public'],
// };

const CACHE_STRATEGIES: Record<string, CacheStrategyConfig> = {
  static: {
    type: 'static',
    config: {
      maxAge: 31536000, // 1 year
      sMaxAge: 31536000, // 1 year
      etag: true,
      lastModified: true,
      directives: ['public', 'immutable'],
    },
    keyPattern: 'static-*',
  },
  dynamic: {
    type: 'dynamic',
    config: {
      maxAge: 3600, // 1 hour
      sMaxAge: 86400, // 1 day
      etag: true,
      lastModified: true,
      directives: ['public'],
    },
    keyPattern: 'dynamic-*',
  },
  api: {
    type: 'api',
    config: {
      maxAge: 300, // 5 minutes
      sMaxAge: 3600, // 1 hour
      etag: true,
      lastModified: false,
      directives: ['public'],
    },
    keyPattern: 'api-*',
  },
  image: {
    type: 'image',
    config: {
      maxAge: 2592000, // 30 days
      sMaxAge: 31536000, // 1 year
      etag: true,
      lastModified: true,
      directives: ['public', 'immutable'],
    },
    keyPattern: 'image-*',
  },
  font: {
    type: 'font',
    config: {
      maxAge: 31536000, // 1 year
      sMaxAge: 31536000, // 1 year
      etag: true,
      lastModified: true,
      directives: ['public', 'immutable'],
    },
    keyPattern: 'font-*',
  },
};

// ============================================================================
// HTTP CACHING UTILITIES
// ============================================================================

/**
 * Generate Cache-Control header
 */
export function generateCacheControlHeader(config: HTTPCacheConfig): string {
  const startTime = performance.now();

  try {
    const directives: string[] = [];

    // Add max-age
    if (config.maxAge) {
      directives.push(`max-age=${config.maxAge}`);
    }

    // Add s-maxage
    if (config.sMaxAge) {
      directives.push(`s-maxage=${config.sMaxAge}`);
    }

    // Add custom directives
    if (config.directives) {
      directives.push(...config.directives);
    }

    const cacheControl = directives.join(', ');

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'cache_control_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 1 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return cacheControl;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'cache_control_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return 'no-cache';
  }
}

/**
 * Generate ETag header
 */
export function generateETagHeader(content: string): string {
  const startTime = performance.now();

  try {
    // Simple ETag generation based on content hash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const etag = `"${Math.abs(hash).toString(16)}"`;

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'etag_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 5 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return etag;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'etag_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return `"${Date.now()}"`;
  }
}

/**
 * Generate Last-Modified header
 */
export function generateLastModifiedHeader(date: Date = new Date()): string {
  const startTime = performance.now();

  try {
    const lastModified = date.toUTCString();

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'last_modified_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 1 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return lastModified;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'last_modified_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return new Date().toUTCString();
  }
}

/**
 * Get cache strategy for resource type
 */
export function getCacheStrategy(resourceType: string): CacheStrategyConfig {
  const startTime = performance.now();

  try {
    const strategy = CACHE_STRATEGIES[resourceType] || CACHE_STRATEGIES.dynamic;

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'cache_strategy_lookup',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 1 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return strategy!;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'cache_strategy_lookup_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return CACHE_STRATEGIES.dynamic!;
  }
}

/**
 * Generate cache headers for resource
 */
export function generateCacheHeaders(
  resourceType: string,
  content: string,
  lastModified?: Date
): Record<string, string> {
  const startTime = performance.now();

  try {
    const strategy = getCacheStrategy(resourceType);
    const headers: Record<string, string> = {};

    // Generate Cache-Control header
    headers['Cache-Control'] = generateCacheControlHeader(strategy.config);

    // Generate ETag header
    if (strategy.config.etag) {
      headers['ETag'] = generateETagHeader(content);
    }

    // Generate Last-Modified header
    if (strategy.config.lastModified) {
      headers['Last-Modified'] = generateLastModifiedHeader(lastModified);
    }

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'cache_headers_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return headers;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'cache_headers_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return {
      'Cache-Control': 'no-cache',
    };
  }
}

/**
 * Check if request is cacheable
 */
export function isCacheableRequest(method: string, headers: Record<string, string>): boolean {
  const startTime = performance.now();

  try {
    // Only GET requests are cacheable
    if (method !== 'GET') {
      return false;
    }

    // Check for cache-busting headers
    const cacheBustingHeaders = ['cache-control', 'pragma', 'if-none-match', 'if-modified-since'];

    const hasCacheBusting = cacheBustingHeaders.some(
      (header) => headers[header] && headers[header].includes('no-cache')
    );

    if (hasCacheBusting) {
      return false;
    }

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'cacheability_check',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 1 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return true;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'cacheability_check_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return false;
  }
}

/**
 * Generate cache key for resource
 */
export function generateCacheKey(
  resourceType: string,
  resourcePath: string,
  queryParams?: Record<string, string>
): string {
  const startTime = performance.now();

  try {
    const strategy = getCacheStrategy(resourceType);
    const baseKey = strategy.keyPattern?.replace('*', resourcePath) || resourcePath;

    let cacheKey = baseKey;

    // Add query parameters to cache key
    if (queryParams && Object.keys(queryParams).length > 0) {
      const sortedParams = Object.keys(queryParams)
        .sort()
        .map((key) => `${key}=${queryParams[key]}`)
        .join('&');
      cacheKey += `?${sortedParams}`;
    }

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'cache_key_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 1 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return cacheKey;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'cache_key_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return resourcePath;
  }
}

/**
 * Get cache performance metrics
 */
export function getCacheMetrics(): PerformanceMetric[] {
  return performanceMonitor
    .getMetricsByName('cache_control_generation')
    .concat(performanceMonitor.getMetricsByName('etag_generation'))
    .concat(performanceMonitor.getMetricsByName('last_modified_generation'))
    .concat(performanceMonitor.getMetricsByName('cache_strategy_lookup'))
    .concat(performanceMonitor.getMetricsByName('cache_headers_generation'))
    .concat(performanceMonitor.getMetricsByName('cacheability_check'))
    .concat(performanceMonitor.getMetricsByName('cache_key_generation'));
}
