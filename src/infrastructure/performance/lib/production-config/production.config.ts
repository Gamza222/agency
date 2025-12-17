/**
 * Production Configuration
 *
 * Production-specific configuration and optimizations for maximum performance.
 * Built on top of existing performance monitoring infrastructure.
 */

import type { PerformanceMetric, ProductionConfig } from '../../types/performance.types';
import { PerformanceRating } from '../../types/performance.enums';
import { performanceMonitor } from '../performance-monitor';

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_PRODUCTION_CONFIG: ProductionConfig = {
  compression: true,
  minification: true,
  treeShaking: true,
  codeSplitting: true,
  bundleAnalyzer: false,
  sourceMaps: false,
};

// ============================================================================
// PRODUCTION CONFIGURATION UTILITIES
// ============================================================================

/**
 * Get production configuration based on environment
 */
export function getProductionConfig(): ProductionConfig {
  const startTime = performance.now();

  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    // const isProduction = process.env.NODE_ENV === 'production';

    const config: ProductionConfig = {
      ...DEFAULT_PRODUCTION_CONFIG,
      // Disable source maps in production
      sourceMaps: isDevelopment,
      // Enable bundle analyzer in development
      bundleAnalyzer: isDevelopment,
    };

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'production_config_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 1 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return config;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'production_config_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return DEFAULT_PRODUCTION_CONFIG;
  }
}

/**
 * Generate Next.js production configuration
 */
export function generateNextJSConfig(config: ProductionConfig = {}): Record<string, unknown> {
  const startTime = performance.now();

  try {
    const finalConfig = { ...DEFAULT_PRODUCTION_CONFIG, ...config };

    const nextConfig: Record<string, unknown> = {
      // Enable React strict mode
      reactStrictMode: true,

      // Disable powered by header
      poweredByHeader: false,

      // TypeScript configuration
      typescript: {
        ignoreBuildErrors: false,
      },

      // ESLint configuration
      eslint: {
        ignoreDuringBuilds: false,
      },

      // Image optimization
      images: {
        domains: [],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      },

      // Compression
      compress: finalConfig.compression,

      // Experimental features
      experimental: {
        optimizeCss: finalConfig.minification,
        optimizePackageImports: finalConfig.treeShaking ? ['@/components', '@/lib'] : [],
      },
    };

    // Add bundle analyzer if enabled
    if (finalConfig.bundleAnalyzer) {
      nextConfig.bundleAnalyzer = {
        enabled: true,
        openAnalyzer: false,
      };
    }

    // Add source maps if enabled
    if (finalConfig.sourceMaps) {
      nextConfig.productionBrowserSourceMaps = true;
    }

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'nextjs_config_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return nextConfig;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'nextjs_config_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return {
      reactStrictMode: true,
      poweredByHeader: false,
    };
  }
}

/**
 * Generate webpack production configuration
 */
export function generateWebpackConfig(config: ProductionConfig = {}): Record<string, unknown> {
  const startTime = performance.now();

  try {
    const finalConfig = { ...DEFAULT_PRODUCTION_CONFIG, ...config };

    const webpackConfig: Record<string, unknown> = {
      // Optimization
      optimization: {
        minimize: finalConfig.minification,
        splitChunks: finalConfig.codeSplitting
          ? {
              chunks: 'all',
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                },
                common: {
                  name: 'common',
                  minChunks: 2,
                  chunks: 'all',
                  enforce: true,
                },
              },
            }
          : false,
      },

      // Performance hints
      performance: {
        hints: 'warning',
        maxEntrypointSize: 250000,
        maxAssetSize: 250000,
      },
    };

    // Add tree shaking if enabled
    if (finalConfig.treeShaking) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (webpackConfig.optimization as any).usedExports = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (webpackConfig.optimization as any).sideEffects = false;
    }

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'webpack_config_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 5 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return webpackConfig;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'webpack_config_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return {
      optimization: {
        minimize: true,
      },
    };
  }
}

/**
 * Generate environment-specific configuration
 */
export function generateEnvironmentConfig(
  environment: 'development' | 'production' | 'test'
): Record<string, unknown> {
  const startTime = performance.now();

  try {
    const baseConfig = {
      NODE_ENV: environment,
      NEXT_PUBLIC_APP_ENV: environment,
    };

    const environmentConfigs: Record<string, Record<string, unknown>> = {
      development: {
        ...baseConfig,
        NEXT_PUBLIC_DEBUG: 'true',
        NEXT_PUBLIC_ANALYTICS: 'false',
        NEXT_PUBLIC_SENTRY_DSN: '',
      },
      production: {
        ...baseConfig,
        NEXT_PUBLIC_DEBUG: 'false',
        NEXT_PUBLIC_ANALYTICS: 'true',
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
      },
      test: {
        ...baseConfig,
        NEXT_PUBLIC_DEBUG: 'false',
        NEXT_PUBLIC_ANALYTICS: 'false',
        NEXT_PUBLIC_SENTRY_DSN: '',
      },
    };

    const config = environmentConfigs[environment] || environmentConfigs.development;

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'environment_config_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 1 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return config!;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'environment_config_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return {
      NODE_ENV: environment,
      NEXT_PUBLIC_APP_ENV: environment,
    };
  }
}

/**
 * Validate production configuration
 */
export function validateProductionConfig(config: ProductionConfig): {
  isValid: boolean;
  errors: string[];
} {
  const startTime = performance.now();

  try {
    const errors: string[] = [];

    // Validate compression
    if (config.compression !== undefined && typeof config.compression !== 'boolean') {
      errors.push('compression must be a boolean');
    }

    // Validate minification
    if (config.minification !== undefined && typeof config.minification !== 'boolean') {
      errors.push('minification must be a boolean');
    }

    // Validate tree shaking
    if (config.treeShaking !== undefined && typeof config.treeShaking !== 'boolean') {
      errors.push('treeShaking must be a boolean');
    }

    // Validate code splitting
    if (config.codeSplitting !== undefined && typeof config.codeSplitting !== 'boolean') {
      errors.push('codeSplitting must be a boolean');
    }

    // Validate bundle analyzer
    if (config.bundleAnalyzer !== undefined && typeof config.bundleAnalyzer !== 'boolean') {
      errors.push('bundleAnalyzer must be a boolean');
    }

    // Validate source maps
    if (config.sourceMaps !== undefined && typeof config.sourceMaps !== 'boolean') {
      errors.push('sourceMaps must be a boolean');
    }

    const isValid = errors.length === 0;

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'production_config_validation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 5 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return { isValid, errors };
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'production_config_validation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return { isValid: false, errors: ['Validation error'] };
  }
}

/**
 * Get production performance metrics
 */
export function getProductionMetrics(): PerformanceMetric[] {
  return performanceMonitor
    .getMetricsByName('production_config_generation')
    .concat(performanceMonitor.getMetricsByName('nextjs_config_generation'))
    .concat(performanceMonitor.getMetricsByName('webpack_config_generation'))
    .concat(performanceMonitor.getMetricsByName('environment_config_generation'))
    .concat(performanceMonitor.getMetricsByName('production_config_validation'));
}
