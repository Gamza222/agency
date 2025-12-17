/**
 * Performance Infrastructure Mocks
 */

// Performance Monitor Mocks
export {
  mockPerformanceMonitor,
  MockPerformanceMonitor,
  mockMeasurePerformance,
  mockMeasureAsyncPerformance,
  mockGetPerformanceTiming,
  mockGetNavigationTiming,
  createMockPerformanceMonitorInstance,
  mockPerformanceMonitorWithMetrics,
  mockPerformanceMonitorWithError,
} from './performanceMonitor.mock';

// Web Vitals Mocks
export {
  mockInitWebVitals,
  mockPerformanceBudgets,
  mockCheckPerformanceBudget,
  mockGetPerformanceRating,
  createMockWebVitals,
  mockWebVitalsWithError,
} from './webVitals.mock';

// Performance Types Mocks
export {
  mockPerformanceMetric,
  mockPerformanceMetrics,
  mockPerformanceReport,
  mockImageOptimizationConfig,
  mockResourcePreloadConfig,
  mockCriticalCSSConfig,
  mockHTTPCacheConfig,
  mockProductionConfig as mockPerformanceProductionConfig,
  generateMockPerformanceMetrics,
  generateMockPerformanceReport,
} from './performanceTypes.mock';
