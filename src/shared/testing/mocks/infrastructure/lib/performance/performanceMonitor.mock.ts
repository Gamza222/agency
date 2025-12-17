/**
 * Performance Monitor Mock for Testing
 *
 * Provides mock implementations of the PerformanceMonitor class and related functions
 * for testing performance monitoring functionality.
 */

import type { PerformanceMetric } from '@/infrastructure/performance/types/performance.types';

// Mock performance monitor instance
export const mockPerformanceMonitor = {
  addMetric: jest.fn(),
  getMetricsByName: jest.fn().mockReturnValue([]),
  getMetrics: jest.fn().mockReturnValue([]),
  clear: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
};

// Mock performance monitor class
export const MockPerformanceMonitor = jest.fn().mockImplementation(() => mockPerformanceMonitor);

// Mock performance measurement functions
export const mockMeasurePerformance = jest
  .fn()
  .mockImplementation((name: string, fn: () => unknown) => {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();

    mockPerformanceMonitor.addMetric({
      name,
      value: endTime - startTime,
      timestamp: Date.now(),
      rating: 'good',
    });

    return result;
  });

export const mockMeasureAsyncPerformance = jest
  .fn()
  .mockImplementation(async (name: string, fn: () => Promise<unknown>) => {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();

    mockPerformanceMonitor.addMetric({
      name,
      value: endTime - startTime,
      timestamp: Date.now(),
      rating: 'good',
    });

    return result;
  });

// Mock performance timing functions
export const mockGetPerformanceTiming = jest.fn().mockReturnValue({
  navigationStart: 0,
  loadEventEnd: 1000,
  domContentLoadedEventEnd: 500,
  loadEventStart: 800,
});

export const mockGetNavigationTiming = jest.fn().mockReturnValue({
  name: 'navigation',
  startTime: 0,
  duration: 1000,
  type: 'navigate',
});

// Create mock performance monitor instance
export const createMockPerformanceMonitorInstance = (
  customMethods: Partial<typeof mockPerformanceMonitor> = {}
) => {
  return {
    ...mockPerformanceMonitor,
    ...customMethods,
  };
};

// Mock performance monitor with metrics
export const mockPerformanceMonitorWithMetrics = (metrics: PerformanceMetric[] = []) => {
  return {
    ...mockPerformanceMonitor,
    getMetrics: jest.fn().mockReturnValue(metrics),
    getMetricsByName: jest
      .fn()
      .mockImplementation((name: string) => metrics.filter((metric) => metric.name === name)),
  };
};

// Mock performance monitor with error
export const mockPerformanceMonitorWithError = (error: Error) => {
  return {
    ...mockPerformanceMonitor,
    addMetric: jest.fn().mockImplementation(() => {
      throw error;
    }),
  };
};
