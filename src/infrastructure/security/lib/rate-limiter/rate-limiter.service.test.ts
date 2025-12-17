/**
 * Rate Limiter Service Tests
 */

import { RateLimiterService } from './rate-limiter.service';

describe('RateLimiterService', () => {
  let rateLimiter: RateLimiterService;

  beforeEach(() => {
    // Use the singleton instance
    rateLimiter = RateLimiterService.getInstance();
    // Clear the store for test isolation
    (rateLimiter as any).rateLimitStore.clear();
  });

  afterEach(() => {
    // Clean up after each test
    (rateLimiter as any).rateLimitStore.clear();
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const key = 'test-key';
      const result = rateLimiter.checkRateLimit(key);

      expect(result.allowed).toBe(true);
      expect(result.info.remaining).toBe(99); // 100 - 1
    });

    it('should block requests exceeding limit', () => {
      const key = 'test-key';

      // Make 100 requests (the limit)
      for (let i = 0; i < 100; i++) {
        rateLimiter.checkRateLimit(key);
      }

      // 101st request should be blocked
      const result = rateLimiter.checkRateLimit(key);
      expect(result.allowed).toBe(false);
    });

    it('should reset after window expires', (done) => {
      const key = 'test-key';

      // Make 100 requests
      for (let i = 0; i < 100; i++) {
        rateLimiter.checkRateLimit(key);
      }

      // Should be blocked
      expect(rateLimiter.checkRateLimit(key).allowed).toBe(false);

      // Wait for window to expire (in test, we'll manually reset)
      rateLimiter.resetRateLimit(key);

      // Should be allowed again
      const result = rateLimiter.checkRateLimit(key);
      expect(result.allowed).toBe(true);
      done();
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return correct info for new key', () => {
      const key = 'new-key';
      const info = rateLimiter.getRateLimitInfo(key);

      expect(info.limit).toBe(100);
      expect(info.remaining).toBe(100);
      expect(info.reset).toBeInstanceOf(Date);
    });

    it('should return correct info after requests', () => {
      const key = 'test-key-info';
      rateLimiter.checkRateLimit(key);
      rateLimiter.checkRateLimit(key);

      const info = rateLimiter.getRateLimitInfo(key);
      expect(info.remaining).toBe(98);
    });
  });

  describe('resetRateLimit', () => {
    it('should reset rate limit for key', () => {
      const key = 'test-key';

      // Make some requests
      rateLimiter.checkRateLimit(key);
      rateLimiter.checkRateLimit(key);

      // Reset
      rateLimiter.resetRateLimit(key);

      // Should be back to full limit
      const info = rateLimiter.getRateLimitInfo(key);
      expect(info.remaining).toBe(100);
    });
  });

  describe('generateKey', () => {
    it('should generate key with identifier only', () => {
      const key = rateLimiter.generateKey('user123');
      expect(key).toBe('user123');
    });

    it('should generate key with identifier and endpoint', () => {
      const key = rateLimiter.generateKey('user123', '/api/users');
      expect(key).toBe('user123:/api/users');
    });

    it('should generate key with identifier, endpoint, and method', () => {
      const key = rateLimiter.generateKey('user123', '/api/users', 'POST');
      expect(key).toBe('user123:/api/users:POST');
    });
  });

  describe('getAllActiveRateLimits', () => {
    it('should return empty array when no active limits', () => {
      const limits = rateLimiter.getAllActiveRateLimits();
      expect(limits).toEqual([]);
    });

    it('should return active rate limits', () => {
      const key = 'test-key-active';
      const result = rateLimiter.checkRateLimit(key);

      // Make sure the request was allowed and recorded
      expect(result.allowed).toBe(true);

      const limits = rateLimiter.getAllActiveRateLimits();

      expect(limits).toHaveLength(1);
      expect(limits[0]?.key).toBe(key);
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', () => {
      // TODO: Fix rate limiter getStatistics issue
      const key1 = 'stats-key1';
      const key2 = 'stats-key2';

      // Make requests and verify they're recorded
      const result1 = rateLimiter.checkRateLimit(key1);
      const result2 = rateLimiter.checkRateLimit(key1);
      const result3 = rateLimiter.checkRateLimit(key2);

      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result3.allowed).toBe(true);

      const stats = rateLimiter.getStatistics();
      expect(stats.activeKeys).toBe(2);
      expect(stats.totalRequests).toBe(3);
      expect(stats.blockedKeys).toBe(0);
    });
  });
});
