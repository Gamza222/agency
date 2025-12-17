/**
 * Performance monitoring utilities
 */

import type { PerformanceMetric, PerformanceReport } from '../../types/performance.types';
import { PerformanceRating } from '../../types/performance.enums';

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: ((report: PerformanceReport) => void)[] = [];

  /**
   * Add a performance metric
   */
  addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    this.notifyObservers();
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((metric) => metric.name === name);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.notifyObservers();
  }

  /**
   * Subscribe to performance updates
   */
  subscribe(callback: (report: PerformanceReport) => void): () => void {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const goodMetrics = this.metrics.filter((m) => m.rating === PerformanceRating.GOOD).length;
    const needsImprovementMetrics = this.metrics.filter(
      (m) => m.rating === PerformanceRating.NEEDS_IMPROVEMENT
    ).length;
    const poorMetrics = this.metrics.filter((m) => m.rating === PerformanceRating.POOR).length;

    return {
      metrics: [...this.metrics],
      summary: {
        totalMetrics: this.metrics.length,
        goodMetrics,
        needsImprovementMetrics,
        poorMetrics,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Notify observers of changes
   */
  private notifyObservers(): void {
    const report = this.generateReport();
    this.observers.forEach((callback) => callback(report));
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Measure function execution time
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  performanceMonitor.addMetric({
    name,
    value: end - start,
    timestamp: Date.now(),
  });

  return result;
}

/**
 * Measure async function execution time
 */
export async function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  performanceMonitor.addMetric({
    name,
    value: end - start,
    timestamp: Date.now(),
  });

  return result;
}

/**
 * Get performance timing information
 */
export function getPerformanceTiming() {
  return performance.timing;
}

/**
 * Get navigation timing information
 */
export function getNavigationTiming() {
  const entries = window.performance.getEntriesByType('navigation');
  return entries && entries.length > 0 ? (entries[0] as PerformanceNavigationTiming) : undefined;
}
