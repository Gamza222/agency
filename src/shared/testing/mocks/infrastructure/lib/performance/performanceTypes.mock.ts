/**
 * Performance Types Mock Data for Testing
 *
 * Provides mock data for performance-related types and interfaces
 * for testing performance monitoring functionality.
 */

import type {
  CriticalCSSConfig,
  HTTPCacheConfig,
  ImageOptimizationConfig,
  PerformanceMetric,
  PerformanceReport,
  ProductionConfig,
  ResourcePreloadConfig,
} from '@/infrastructure/performance/types/performance.types';
import {
  ImageFormat,
  NonCriticalStrategy,
  PerformanceRating,
} from '@/infrastructure/performance/types/performance.enums';

// Mock performance metrics
export const mockPerformanceMetric: PerformanceMetric = {
  name: 'test-metric',
  value: 100,
  timestamp: Date.now(),
  rating: PerformanceRating.GOOD,
};

export const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    name: 'image-optimization',
    value: 50,
    timestamp: Date.now() - 1000,
    rating: PerformanceRating.GOOD,
  },
  {
    name: 'resource-preloading',
    value: 200,
    timestamp: Date.now() - 2000,
    rating: PerformanceRating.NEEDS_IMPROVEMENT,
  },
  {
    name: 'critical-css',
    value: 300,
    timestamp: Date.now() - 3000,
    rating: PerformanceRating.POOR,
  },
];

// Mock performance report
export const mockPerformanceReport: PerformanceReport = {
  metrics: mockPerformanceMetrics,
  summary: {
    totalMetrics: 3,
    goodMetrics: 1,
    needsImprovementMetrics: 1,
    poorMetrics: 1,
  },
  timestamp: Date.now(),
};

// Mock image optimization config
export const mockImageOptimizationConfig: ImageOptimizationConfig = {
  quality: 80,
  format: ImageFormat.WEBP,
  responsive: true,
  lazyThreshold: 100,
  placeholder: 'blur',
};

// Mock resource preload config
export const mockResourcePreloadConfig: ResourcePreloadConfig = {
  fonts: true,
  css: true,
  js: true,
  images: true,
  custom: [
    {
      href: '/api/data',
      as: 'fetch',
      crossOrigin: 'anonymous',
    },
  ],
};

// Mock critical CSS config
export const mockCriticalCSSConfig: CriticalCSSConfig = {
  extract: true,
  inline: true,
  selector: 'style[data-critical]',
  nonCriticalStrategy: NonCriticalStrategy.ASYNC,
};

// Mock HTTP cache config
export const mockHTTPCacheConfig: HTTPCacheConfig = {
  maxAge: 3600,
  sMaxAge: 86400,
  etag: true,
  lastModified: true,
  directives: ['public'],
};

// Mock production config
export const mockProductionConfig: ProductionConfig = {
  compression: true,
  minification: true,
  treeShaking: true,
  codeSplitting: true,
  bundleAnalyzer: false,
  sourceMaps: false,
};

// Mock performance data generators
export const generateMockPerformanceMetrics = (count: number = 5): PerformanceMetric[] => {
  return Array.from({ length: count }, (_, index) => ({
    name: `test-metric-${index}`,
    value: Math.random() * 1000,
    timestamp: Date.now() - index * 1000,
    rating: [PerformanceRating.GOOD, PerformanceRating.NEEDS_IMPROVEMENT, PerformanceRating.POOR][
      Math.floor(Math.random() * 3)
    ],
  }));
};

export const generateMockPerformanceReport = (metricsCount: number = 10): PerformanceReport => {
  const metrics = generateMockPerformanceMetrics(metricsCount);
  const goodMetrics = metrics.filter((m) => m.rating === PerformanceRating.GOOD).length;
  const needsImprovementMetrics = metrics.filter(
    (m) => m.rating === PerformanceRating.NEEDS_IMPROVEMENT
  ).length;
  const poorMetrics = metrics.filter((m) => m.rating === PerformanceRating.POOR).length;

  return {
    metrics,
    summary: {
      totalMetrics: metrics.length,
      goodMetrics,
      needsImprovementMetrics,
      poorMetrics,
    },
    timestamp: Date.now(),
  };
};
