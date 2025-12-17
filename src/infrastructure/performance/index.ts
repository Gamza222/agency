/**
 * Performance Infrastructure Exports
 */

// Export types
export type {
  WebVitalsConfig,
  PerformanceMetric,
  PerformanceReport,
  ImageOptimizationConfig,
  ImageOptimizationResult,
  ResourcePreloadConfig,
  PreloadResource,
  CriticalCSSConfig,
  CriticalCSSResult,
  HTTPCacheConfig,
  CacheStrategyConfig,
  ProductionConfig,
} from './types/performance.types';

// Export enums
export {
  PerformanceRating,
  ImageFormat,
  NonCriticalStrategy,
  CacheStrategy,
} from './types/performance.enums';

// Export components
export { PerformanceInitializer } from './components/PerformanceInitializer';
