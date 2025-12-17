/**
 * Performance configuration
 */

export interface PerformanceConfig {
  /** Bundle size budgets in bytes */
  bundleBudgets: {
    js: number;
    css: number;
    images: number;
    total: number;
  };

  /** Core Web Vitals thresholds */
  webVitals: {
    lcp: number; // Largest Contentful Paint (ms)
    fid: number; // First Input Delay (ms)
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint (ms)
    ttfb: number; // Time to First Byte (ms)
  };

  /** Performance monitoring settings */
  monitoring: {
    enabled: boolean;
    sampleRate: number;
    reportToSentry: boolean;
    debugMode: boolean;
  };

  /** Lighthouse CI settings */
  lighthouse: {
    enabled: boolean;
    minScore: number;
    numberOfRuns: number;
    throttling: {
      rttMs: number;
      throughputKbps: number;
    };
  };
}

/**
 * Default performance configuration
 */
export const defaultPerformanceConfig: PerformanceConfig = {
  bundleBudgets: {
    js: 250000, // 250KB
    css: 50000, // 50KB
    images: 1000000, // 1MB
    total: 1000000, // 1MB total
  },

  webVitals: {
    lcp: 2500, // 2.5 seconds
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    fcp: 1800, // 1.8 seconds
    ttfb: 800, // 800ms
  },

  monitoring: {
    enabled: true,
    sampleRate: 1.0,
    reportToSentry: true,
    debugMode: process.env.NODE_ENV === 'development',
  },

  lighthouse: {
    enabled: true,
    minScore: 0.9,
    numberOfRuns: 3,
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
    },
  },
};

/**
 * Get performance configuration
 */
export function getPerformanceConfig(): PerformanceConfig {
  return {
    ...defaultPerformanceConfig,
    monitoring: {
      ...defaultPerformanceConfig.monitoring,
      debugMode: process.env.NODE_ENV === 'development',
    },
  };
}

/**
 * Performance budget validation
 */
export function validatePerformanceBudget(
  metric: string,
  value: number,
  config: PerformanceConfig = defaultPerformanceConfig
): boolean {
  const budgets = config.bundleBudgets;

  switch (metric) {
    case 'js':
      return value <= budgets.js;
    case 'css':
      return value <= budgets.css;
    case 'images':
      return value <= budgets.images;
    case 'total':
      return value <= budgets.total;
    default:
      return true;
  }
}

/**
 * Web Vitals validation
 */
export function validateWebVitals(
  metric: string,
  value: number,
  config: PerformanceConfig = defaultPerformanceConfig
): boolean {
  const thresholds = config.webVitals;

  switch (metric) {
    case 'lcp':
      return value <= thresholds.lcp;
    case 'fid':
      return value <= thresholds.fid;
    case 'cls':
      return value <= thresholds.cls;
    case 'fcp':
      return value <= thresholds.fcp;
    case 'ttfb':
      return value <= thresholds.ttfb;
    default:
      return true;
  }
}
