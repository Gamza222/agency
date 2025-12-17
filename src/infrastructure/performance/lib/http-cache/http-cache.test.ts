/**
 * HTTP Caching Tests
 *
 * Comprehensive tests for HTTP caching utilities.
 */

import {
  generateCacheControlHeader,
  generateCacheHeaders,
  generateCacheKey,
  generateETagHeader,
  generateLastModifiedHeader,
  getCacheMetrics,
  getCacheStrategy,
  isCacheableRequest,
} from './http-cache';
// Mock performance monitor
jest.mock('../performance-monitor', () => ({
  performanceMonitor: {
    addMetric: jest.fn(),
    getMetricsByName: jest.fn(),
  },
}));

describe('HTTP Caching', () => {
  let performanceMonitor: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(performance, 'now').mockReturnValue(1000);
    const { performanceMonitor: mockPerformanceMonitor } = await import('../performance-monitor');
    performanceMonitor = mockPerformanceMonitor;
  });

  describe('generateCacheControlHeader', () => {
    it('should generate Cache-Control header with max-age', () => {
      const config = {
        maxAge: 3600,
        directives: ['public'],
      };

      const result = generateCacheControlHeader(config);

      expect(result).toContain('max-age=3600');
      expect(result).toContain('public');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'cache_control_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should generate Cache-Control header with s-maxage', () => {
      const config = {
        maxAge: 3600,
        sMaxAge: 7200,
        directives: ['public'],
      };

      const result = generateCacheControlHeader(config);

      expect(result).toContain('max-age=3600');
      expect(result).toContain('s-maxage=7200');
      expect(result).toContain('public');
    });

    it('should handle empty config', () => {
      const result = generateCacheControlHeader({});

      expect(result).toBe('');
    });
  });

  describe('generateETagHeader', () => {
    it('should generate ETag header for content', () => {
      const content = 'Hello, World!';

      const result = generateETagHeader(content);

      expect(result).toMatch(/^"[a-f0-9]+"$/);
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'etag_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should generate consistent ETag for same content', () => {
      const content = 'Hello, World!';

      const result1 = generateETagHeader(content);
      const result2 = generateETagHeader(content);

      expect(result1).toBe(result2);
    });

    it('should generate different ETag for different content', () => {
      const content1 = 'Hello, World!';
      const content2 = 'Hello, Universe!';

      const result1 = generateETagHeader(content1);
      const result2 = generateETagHeader(content2);

      expect(result1).not.toBe(result2);
    });
  });

  describe('generateLastModifiedHeader', () => {
    it('should generate Last-Modified header for date', () => {
      const date = new Date('2024-01-01T00:00:00Z');

      const result = generateLastModifiedHeader(date);

      expect(result).toBe('Mon, 01 Jan 2024 00:00:00 GMT');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'last_modified_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should use current date when not provided', () => {
      const result = generateLastModifiedHeader();

      expect(result).toMatch(/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
    });
  });

  describe('getCacheStrategy', () => {
    it('should return static strategy for static resources', () => {
      const result = getCacheStrategy('static');

      expect(result.type).toBe('static');
      expect(result.config.maxAge).toBe(31536000);
      expect(result.config.directives).toContain('immutable');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'cache_strategy_lookup',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should return dynamic strategy for unknown resources', () => {
      const result = getCacheStrategy('unknown');

      expect(result.type).toBe('dynamic');
      expect(result.config.maxAge).toBe(3600);
    });

    it('should return api strategy for api resources', () => {
      const result = getCacheStrategy('api');

      expect(result.type).toBe('api');
      expect(result.config.maxAge).toBe(300);
      expect(result.config.lastModified).toBe(false);
    });
  });

  describe('generateCacheHeaders', () => {
    it('should generate cache headers for resource', () => {
      const content = 'Hello, World!';
      const lastModified = new Date('2024-01-01T00:00:00Z');

      const result = generateCacheHeaders('static', content, lastModified);

      expect(result['Cache-Control']).toContain('max-age=31536000');
      expect(result['Cache-Control']).toContain('immutable');
      expect(result['ETag']).toMatch(/^"[a-f0-9]+"$/);
      expect(result['Last-Modified']).toBe('Mon, 01 Jan 2024 00:00:00 GMT');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'cache_headers_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should handle missing lastModified date', () => {
      const content = 'Hello, World!';

      const result = generateCacheHeaders('static', content);

      expect(result['Cache-Control']).toContain('max-age=31536000');
      expect(result['ETag']).toMatch(/^"[a-f0-9]+"$/);
      expect(result['Last-Modified']).toMatch(
        /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/
      );
    });
  });

  describe('isCacheableRequest', () => {
    it('should return true for GET requests', () => {
      const result = isCacheableRequest('GET', {});

      expect(result).toBe(true);
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'cacheability_check',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should return false for non-GET requests', () => {
      const result = isCacheableRequest('POST', {});

      expect(result).toBe(false);
    });

    it('should return false for requests with no-cache header', () => {
      const headers = {
        'cache-control': 'no-cache',
      };

      const result = isCacheableRequest('GET', headers);

      expect(result).toBe(false);
    });

    it('should return false for requests with pragma no-cache', () => {
      const headers = {
        pragma: 'no-cache',
      };

      const result = isCacheableRequest('GET', headers);

      expect(result).toBe(false);
    });
  });

  describe('generateCacheKey', () => {
    it('should generate cache key for resource', () => {
      const result = generateCacheKey('static', '/path/to/resource');

      expect(result).toBe('static-/path/to/resource');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'cache_key_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should include query parameters in cache key', () => {
      const queryParams = {
        param1: 'value1',
        param2: 'value2',
      };

      const result = generateCacheKey('static', '/path/to/resource', queryParams);

      expect(result).toContain('static-/path/to/resource?');
      expect(result).toContain('param1=value1');
      expect(result).toContain('param2=value2');
    });

    it('should sort query parameters consistently', () => {
      const queryParams = {
        z: 'value3',
        a: 'value1',
        m: 'value2',
      };

      const result = generateCacheKey('static', '/path/to/resource', queryParams);

      expect(result).toContain('a=value1');
      expect(result).toContain('m=value2');
      expect(result).toContain('z=value3');
    });
  });

  describe('getCacheMetrics', () => {
    it('should return cache metrics', () => {
      const mockMetrics = [
        { name: 'cache_control_generation', value: 10 },
        { name: 'etag_generation', value: 5 },
      ];

      (performanceMonitor.getMetricsByName as jest.Mock).mockImplementation((name) => {
        return mockMetrics.filter((metric) => metric.name === name);
      });

      const result = getCacheMetrics();

      expect(result).toHaveLength(2);
      expect(performanceMonitor.getMetricsByName).toHaveBeenCalledWith('cache_control_generation');
      expect(performanceMonitor.getMetricsByName).toHaveBeenCalledWith('etag_generation');
    });
  });
});
