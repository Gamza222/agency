/**
 * Production Configuration Tests
 *
 * Comprehensive tests for production configuration utilities.
 */

import {
  generateEnvironmentConfig,
  generateNextJSConfig,
  generateWebpackConfig,
  getProductionConfig,
  getProductionMetrics,
  validateProductionConfig,
} from './production.config';
// Mock performance monitor
jest.mock('../performance-monitor', () => ({
  performanceMonitor: {
    addMetric: jest.fn(),
    getMetricsByName: jest.fn(),
  },
}));

// Mock process.env
const originalEnv = process.env;

describe('Production Configuration', () => {
  let performanceMonitor: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(performance, 'now').mockReturnValue(1000);
    process.env = { ...originalEnv };
    // Get the mocked performance monitor
    const { performanceMonitor: mockPerformanceMonitor } = await import('../performance-monitor');
    performanceMonitor = mockPerformanceMonitor;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getProductionConfig', () => {
    it('should return production config for production environment', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      });

      const result = getProductionConfig();

      expect(result.compression).toBe(true);
      expect(result.minification).toBe(true);
      expect(result.treeShaking).toBe(true);
      expect(result.codeSplitting).toBe(true);
      expect(result.bundleAnalyzer).toBe(false);
      expect(result.sourceMaps).toBe(false);
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'production_config_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should return development config for development environment', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });

      const result = getProductionConfig();

      expect(result.bundleAnalyzer).toBe(true);
      expect(result.sourceMaps).toBe(true);
    });
  });

  describe('generateNextJSConfig', () => {
    it('should generate Next.js config with default settings', () => {
      const result = generateNextJSConfig();

      expect(result.reactStrictMode).toBe(true);
      expect(result.poweredByHeader).toBe(false);
      expect(result.compress).toBe(true);
      expect(result.images).toBeDefined();
      expect((result.images as any).formats).toContain('image/webp');
      expect((result.images as any).formats).toContain('image/avif');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'nextjs_config_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should generate Next.js config with custom settings', () => {
      const config = {
        compression: false,
        minification: false,
        bundleAnalyzer: true,
        sourceMaps: true,
      };

      const result = generateNextJSConfig(config);

      expect(result.compress).toBe(false);
      expect(result.bundleAnalyzer).toBeDefined();
      expect(result.productionBrowserSourceMaps).toBe(true);
    });
  });

  describe('generateWebpackConfig', () => {
    it('should generate webpack config with default settings', () => {
      const result = generateWebpackConfig();

      expect((result.optimization as any).minimize).toBe(true);
      expect((result.optimization as any).splitChunks).toBeDefined();
      expect((result.optimization as any).splitChunks.chunks).toBe('all');
      expect(result.performance).toBeDefined();
      expect((result.performance as any).hints).toBe('warning');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'webpack_config_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should generate webpack config with custom settings', () => {
      const config = {
        minification: false,
        codeSplitting: false,
        treeShaking: false,
      };

      const result = generateWebpackConfig(config);

      expect((result.optimization as any).minimize).toBe(false);
      expect((result.optimization as any).splitChunks).toBe(false);
      expect((result.optimization as any).usedExports).toBeUndefined();
    });

    it('should enable tree shaking when configured', () => {
      const config = {
        treeShaking: true,
      };

      const result = generateWebpackConfig(config);

      expect((result.optimization as any).usedExports).toBe(true);
      expect((result.optimization as any).sideEffects).toBe(false);
    });
  });

  describe('generateEnvironmentConfig', () => {
    it('should generate development environment config', () => {
      const result = generateEnvironmentConfig('development');

      expect(result.NODE_ENV).toBe('development');
      expect(result.NEXT_PUBLIC_APP_ENV).toBe('development');
      expect(result.NEXT_PUBLIC_DEBUG).toBe('true');
      expect(result.NEXT_PUBLIC_ANALYTICS).toBe('false');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'environment_config_generation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should generate production environment config', () => {
      const result = generateEnvironmentConfig('production');

      expect(result.NODE_ENV).toBe('production');
      expect(result.NEXT_PUBLIC_APP_ENV).toBe('production');
      expect(result.NEXT_PUBLIC_DEBUG).toBe('false');
      expect(result.NEXT_PUBLIC_ANALYTICS).toBe('true');
    });

    it('should generate test environment config', () => {
      const result = generateEnvironmentConfig('test');

      expect(result.NODE_ENV).toBe('test');
      expect(result.NEXT_PUBLIC_APP_ENV).toBe('test');
      expect(result.NEXT_PUBLIC_DEBUG).toBe('false');
      expect(result.NEXT_PUBLIC_ANALYTICS).toBe('false');
    });

    it('should handle unknown environment', () => {
      const result = generateEnvironmentConfig('unknown' as any);

      expect(result.NODE_ENV).toBe('unknown');
      expect(result.NEXT_PUBLIC_APP_ENV).toBe('unknown');
    });
  });

  describe('validateProductionConfig', () => {
    it('should validate correct production config', () => {
      const config = {
        compression: true,
        minification: true,
        treeShaking: true,
        codeSplitting: true,
        bundleAnalyzer: false,
        sourceMaps: false,
      };

      const result = validateProductionConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'production_config_validation',
          value: 0,
          rating: 'good',
        })
      );
    });

    it('should validate empty config', () => {
      const result = validateProductionConfig({});

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid compression type', () => {
      const config = {
        compression: 'true' as any,
      };

      const result = validateProductionConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('compression must be a boolean');
    });

    it('should detect invalid minification type', () => {
      const config = {
        minification: 123 as any,
      };

      const result = validateProductionConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('minification must be a boolean');
    });

    it('should detect multiple validation errors', () => {
      const config = {
        compression: 'true' as any,
        minification: 123 as any,
        treeShaking: 'false' as any,
      };

      const result = validateProductionConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('compression must be a boolean');
      expect(result.errors).toContain('minification must be a boolean');
      expect(result.errors).toContain('treeShaking must be a boolean');
    });
  });

  describe('getProductionMetrics', () => {
    it('should return production metrics', () => {
      const mockMetrics = [
        { name: 'production_config_generation', value: 10 },
        { name: 'nextjs_config_generation', value: 5 },
      ];

      (performanceMonitor.getMetricsByName as jest.Mock).mockImplementation((name) => {
        return mockMetrics.filter((metric) => metric.name === name);
      });

      const result = getProductionMetrics();

      expect(result).toHaveLength(2);
      expect(performanceMonitor.getMetricsByName).toHaveBeenCalledWith(
        'production_config_generation'
      );
      expect(performanceMonitor.getMetricsByName).toHaveBeenCalledWith('nextjs_config_generation');
    });
  });
});
