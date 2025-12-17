import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import type { WebVitalsConfig } from '../../types/performance.types';

/**
 * Default Web Vitals configuration
 */
const defaultConfig: WebVitalsConfig = {
  debug: process.env.NODE_ENV === 'development',
  reportToSentry: true,
};

/**
 * Report Web Vitals to analytics
 */
function reportToAnalytics(
  metric: { name: string; value: number; delta: number; rating: string },
  config: WebVitalsConfig
) {
  // Report to custom analytics if provided
  if (config.analytics) {
    config.analytics(metric);
  }

  // Report to Sentry if enabled
  if (config.reportToSentry) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const { captureException } = require('@sentry/nextjs');
      if (metric.rating === 'poor') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        captureException(new Error(`Poor Web Vital: ${metric.name}`), {
          tags: {
            metric: metric.name,
            rating: metric.rating,
          },
          extra: {
            value: metric.value,
            delta: metric.delta,
          },
        });
      }
    } catch (error) {
      // Sentry not available
    }
  }

  // Debug logging
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals(config: WebVitalsConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  onCLS((metric) => reportToAnalytics(metric, finalConfig));
  onINP((metric) => reportToAnalytics(metric, finalConfig));
  onLCP((metric) => reportToAnalytics(metric, finalConfig));
  onFCP((metric) => reportToAnalytics(metric, finalConfig));
  onTTFB((metric) => reportToAnalytics(metric, finalConfig));
}

/**
 * Performance budgets for Web Vitals
 */
export const PERFORMANCE_BUDGETS = {
  // Core Web Vitals thresholds
  LCP: 2500, // Largest Contentful Paint (ms)
  INP: 200, // Interaction to Next Paint (ms)
  CLS: 0.1, // Cumulative Layout Shift

  // Additional metrics
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 800, // Time to First Byte (ms)
};

/**
 * Check if metric meets performance budget
 */
export function checkPerformanceBudget(metric: { name: string; value: number }): boolean {
  const budget = PERFORMANCE_BUDGETS[metric.name as keyof typeof PERFORMANCE_BUDGETS];
  if (!budget) return true;

  return metric.value <= budget;
}

/**
 * Get performance rating based on thresholds
 */
export function getPerformanceRating(metric: {
  name: string;
  value: number;
}): 'good' | 'needs-improvement' | 'poor' {
  const budget = PERFORMANCE_BUDGETS[metric.name as keyof typeof PERFORMANCE_BUDGETS];
  if (!budget) return 'good';

  if (metric.value <= budget * 0.75) return 'good';
  if (metric.value <= budget) return 'needs-improvement';
  return 'poor';
}
