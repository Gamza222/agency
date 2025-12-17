/**
 * Web Vitals Mock for Testing
 *
 * Provides mock implementations of web vitals functions for testing
 * performance monitoring functionality.
 */

import type { WebVitalsConfig } from '@/infrastructure/performance/types/performance.types';

// Mock web vitals functions
export const mockInitWebVitals = jest.fn().mockImplementation((_config: WebVitalsConfig = {}) => {
  // Mock implementation that does nothing
  return;
});

// Mock performance budgets
export const mockPerformanceBudgets = {
  CLS: 0.1,
  FID: 100,
  FCP: 1800,
  LCP: 2500,
  TTFB: 800,
  INP: 200,
};

// Mock performance budget check
export const mockCheckPerformanceBudget = jest
  .fn()
  .mockImplementation((metric: { name: string; value: number }) => {
    const budget = mockPerformanceBudgets[metric.name as keyof typeof mockPerformanceBudgets];
    return budget ? metric.value <= budget : true;
  });

// Mock performance rating
export const mockGetPerformanceRating = jest
  .fn()
  .mockImplementation((metric: { name: string; value: number }) => {
    const budget = mockPerformanceBudgets[metric.name as keyof typeof mockPerformanceBudgets];
    if (!budget) return 'good';

    if (metric.value <= budget * 0.5) return 'good';
    if (metric.value <= budget) return 'needs-improvement';
    return 'poor';
  });

// Create mock web vitals with custom behavior
export const createMockWebVitals = (
  customBehavior: {
    initWebVitals?: jest.Mock;
    checkPerformanceBudget?: jest.Mock;
    getPerformanceRating?: jest.Mock;
  } = {}
) => {
  return {
    initWebVitals: customBehavior.initWebVitals || mockInitWebVitals,
    checkPerformanceBudget: customBehavior.checkPerformanceBudget || mockCheckPerformanceBudget,
    getPerformanceRating: customBehavior.getPerformanceRating || mockGetPerformanceRating,
    PERFORMANCE_BUDGETS: mockPerformanceBudgets,
  };
};

// Mock web vitals with error
export const mockWebVitalsWithError = (error: Error) => {
  return {
    initWebVitals: jest.fn().mockImplementation(() => {
      throw error;
    }),
    checkPerformanceBudget: mockCheckPerformanceBudget,
    getPerformanceRating: mockGetPerformanceRating,
    PERFORMANCE_BUDGETS: mockPerformanceBudgets,
  };
};
