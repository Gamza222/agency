/**
 * Resource Preloading Utilities
 *
 * Critical resource preloading for maximum performance.
 * Built on top of existing performance monitoring infrastructure.
 */

import type {
  PerformanceMetric,
  PreloadResource,
  ResourcePreloadConfig,
} from '../../types/performance.types';
import { PerformanceRating } from '../../types/performance.enums';
import { performanceMonitor } from '../performance-monitor';

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: ResourcePreloadConfig = {
  fonts: true,
  css: true,
  js: true,
  images: false,
  custom: [],
};

// ============================================================================
// RESOURCE PRELOADING UTILITIES
// ============================================================================

/**
 * Preload critical fonts
 */
export function preloadCriticalFonts(fonts: string[]): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    fonts.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = font;
      link.crossOrigin = 'anonymous';
      link.setAttribute('type', 'font/woff2');

      document.head.appendChild(link);
    });

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'font_preloading',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'font_preloading_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Preload critical CSS
 */
export function preloadCriticalCSS(cssFiles: string[]): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    cssFiles.forEach((css) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = css;
      link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");

      document.head.appendChild(link);
    });

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'css_preloading',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'css_preloading_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Preload critical JavaScript
 */
export function preloadCriticalJS(jsFiles: string[]): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    jsFiles.forEach((js) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = js;
      link.setAttribute('importance', 'high');

      document.head.appendChild(link);
    });

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'js_preloading',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'js_preloading_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(images: string[]): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    images.forEach((image) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = image;
      link.setAttribute('importance', 'high');

      document.head.appendChild(link);
    });

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'image_preloading',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'image_preloading_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Preload custom resources
 */
export function preloadCustomResources(resources: PreloadResource[]): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.as;
      link.href = resource.href;

      if (resource.media) {
        link.setAttribute('media', resource.media);
      }

      if (resource.crossOrigin) {
        link.crossOrigin = resource.crossOrigin;
      }

      if (resource.importance) {
        link.setAttribute('importance', resource.importance);
      }

      document.head.appendChild(link);
    });

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'custom_resource_preloading',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'custom_resource_preloading_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Initialize resource preloading with configuration
 */
export function initializeResourcePreloading(
  config: ResourcePreloadConfig = {},
  resources: {
    fonts?: string[];
    css?: string[];
    js?: string[];
    images?: string[];
    custom?: PreloadResource[];
  } = {}
): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Preload fonts
  if (finalConfig.fonts && resources.fonts) {
    preloadCriticalFonts(resources.fonts);
  }

  // Preload CSS
  if (finalConfig.css && resources.css) {
    preloadCriticalCSS(resources.css);
  }

  // Preload JavaScript
  if (finalConfig.js && resources.js) {
    preloadCriticalJS(resources.js);
  }

  // Preload images
  if (finalConfig.images && resources.images) {
    preloadCriticalImages(resources.images);
  }

  // Preload custom resources
  if (finalConfig.custom && finalConfig.custom.length > 0) {
    preloadCustomResources(finalConfig.custom);
  }

  // Preload additional custom resources
  if (resources.custom) {
    preloadCustomResources(resources.custom);
  }
}

/**
 * Add resource hints (preconnect, dns-prefetch)
 */
export function addResourceHints(
  hints: { type: 'preconnect' | 'dns-prefetch'; url: string }[]
): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    hints.forEach(({ type, url }) => {
      const link = document.createElement('link');
      link.rel = type;
      link.href = url;

      if (type === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }

      document.head.appendChild(link);
    });

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'resource_hints',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 5 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'resource_hints_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Preload next page resources
 */
export function preloadNextPageResources(nextPageUrl: string): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    // Prefetch the next page
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = nextPageUrl;
    link.setAttribute('importance', 'low');

    document.head.appendChild(link);

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'next_page_prefetch',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 5 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'next_page_prefetch_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Get preload performance metrics
 */
export function getPreloadMetrics(): PerformanceMetric[] {
  return performanceMonitor
    .getMetricsByName('font_preloading')
    .concat(performanceMonitor.getMetricsByName('css_preloading'))
    .concat(performanceMonitor.getMetricsByName('js_preloading'))
    .concat(performanceMonitor.getMetricsByName('image_preloading'))
    .concat(performanceMonitor.getMetricsByName('custom_resource_preloading'))
    .concat(performanceMonitor.getMetricsByName('resource_hints'))
    .concat(performanceMonitor.getMetricsByName('next_page_prefetch'));
}
