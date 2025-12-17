/**
 * Critical CSS Utilities
 *
 * Critical CSS extraction and inlining for maximum performance.
 * Built on top of existing performance monitoring infrastructure.
 */

import type {
  CriticalCSSConfig,
  CriticalCSSResult,
  PerformanceMetric,
} from '../../types/performance.types';
import { NonCriticalStrategy, PerformanceRating } from '../../types/performance.enums';
import { performanceMonitor } from '../performance-monitor';

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: CriticalCSSConfig = {
  extract: true,
  inline: true,
  selector: 'body',
  nonCriticalStrategy: NonCriticalStrategy.ASYNC,
};

// ============================================================================
// CRITICAL CSS UTILITIES
// ============================================================================

/**
 * Extract critical CSS from stylesheet
 */
export function extractCriticalCSS(
  cssContent: string,
  _selector: string = 'body'
): { critical: string; nonCritical: string } {
  const startTime = performance.now();

  try {
    // Simple critical CSS extraction based on selectors
    // In a real implementation, you'd use a library like critical
    const criticalSelectors = [
      'html',
      'body',
      'head',
      'main',
      'header',
      'footer',
      'nav',
      '.container',
      '.wrapper',
      '.content',
      '.hero',
      '.banner',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'a',
      'button',
      '.btn',
      '.card',
      '.grid',
      '.flex',
      '.hidden',
      '.visible',
      '.text-',
      '.bg-',
      '.border-',
      '.p-',
      '.m-',
      '.w-',
      '.h-',
    ];

    const lines = cssContent.split('\n');
    const criticalLines: string[] = [];
    const nonCriticalLines: string[] = [];

    let inCriticalBlock = false;
    let braceCount = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check if line contains critical selectors
      const isCritical = criticalSelectors.some(
        (selector) =>
          trimmedLine.includes(selector) ||
          trimmedLine.startsWith('@media') ||
          trimmedLine.startsWith('@keyframes') ||
          trimmedLine.startsWith('@font-face')
      );

      if (isCritical) {
        inCriticalBlock = true;
        criticalLines.push(line);
      } else if (inCriticalBlock) {
        if (trimmedLine.includes('{')) {
          braceCount++;
        }
        if (trimmedLine.includes('}')) {
          braceCount--;
          if (braceCount === 0) {
            inCriticalBlock = false;
          }
        }
        criticalLines.push(line);
      } else {
        nonCriticalLines.push(line);
      }
    }

    const critical = criticalLines.join('\n');
    const nonCritical = nonCriticalLines.join('\n');

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'critical_css_extraction',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 50 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return { critical, nonCritical };
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'critical_css_extraction_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return { critical: '', nonCritical: cssContent };
  }
}

/**
 * Inline critical CSS in HTML
 */
export function inlineCriticalCSS(html: string, criticalCSS: string): string {
  const startTime = performance.now();

  try {
    // Find the head tag and insert critical CSS
    const headRegex = /<head[^>]*>/i;
    const headMatch = html.match(headRegex);

    if (headMatch) {
      const criticalStyle = `<style id="critical-css">${criticalCSS}</style>`;
      const htmlWithCritical = html.replace(headMatch[0], `${headMatch[0]}\n${criticalStyle}`);

      // Track performance metric
      const endTime = performance.now();
      performanceMonitor.addMetric({
        name: 'critical_css_inlining',
        value: endTime - startTime,
        timestamp: Date.now(),
        rating:
          endTime - startTime < 10 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
      });

      return htmlWithCritical;
    }

    return html;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'critical_css_inlining_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return html;
  }
}

/**
 * Load non-critical CSS asynchronously
 */
export function loadNonCriticalCSS(
  cssUrl: string,
  strategy: NonCriticalStrategy = NonCriticalStrategy.ASYNC
): void {
  const startTime = performance.now();

  try {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;

    switch (strategy) {
      case NonCriticalStrategy.ASYNC:
        link.setAttribute('media', 'print');
        link.setAttribute('onload', "this.media='all'");
        break;
      case NonCriticalStrategy.DEFER:
        link.setAttribute('defer', '');
        break;
      case NonCriticalStrategy.LAZY:
        link.setAttribute('media', 'print');
        link.setAttribute('onload', "this.media='all'");
        link.setAttribute('importance', 'low');
        break;
    }

    document.head.appendChild(link);

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'non_critical_css_loading',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 5 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'non_critical_css_loading_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });
  }
}

/**
 * Process critical CSS with full pipeline
 */
export function processCriticalCSS(
  cssContent: string,
  html: string,
  config: CriticalCSSConfig = {}
): CriticalCSSResult {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = performance.now();

  try {
    let result: CriticalCSSResult;

    if (finalConfig.extract) {
      const { critical, nonCritical } = extractCriticalCSS(cssContent, finalConfig.selector);

      if (finalConfig.inline && critical) {
        inlineCriticalCSS(html, critical);
      }

      result = {
        critical,
        nonCritical,
        size: cssContent.length,
        criticalRatio: critical.length / cssContent.length,
      };
    } else {
      result = {
        critical: cssContent,
        nonCritical: '',
        size: cssContent.length,
        criticalRatio: 1,
      };
    }

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'critical_css_processing',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 100 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return result;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'critical_css_processing_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return {
      critical: '',
      nonCritical: cssContent,
      size: cssContent.length,
      criticalRatio: 0,
    };
  }
}

/**
 * Generate critical CSS for above-the-fold content
 */
export function generateAboveTheFoldCSS(cssContent: string, _viewportHeight: number = 800): string {
  const startTime = performance.now();

  try {
    // Extract CSS rules that affect above-the-fold content
    const aboveTheFoldSelectors = [
      'html',
      'body',
      'head',
      'main',
      'header',
      'nav',
      '.hero',
      '.banner',
      '.above-fold',
      '.top-section',
      'h1',
      'h2',
      'h3',
      'p',
      'a',
      'button',
      '.btn',
      '.card',
      '.grid',
      '.flex',
      '.text-',
      '.bg-',
      '.border-',
      '.p-',
      '.m-',
      '.w-',
      '.h-',
      '.hidden',
      '.visible',
    ];

    const lines = cssContent.split('\n');
    const criticalLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      const isAboveTheFold = aboveTheFoldSelectors.some(
        (selector) =>
          trimmedLine.includes(selector) ||
          trimmedLine.startsWith('@media') ||
          trimmedLine.startsWith('@keyframes') ||
          trimmedLine.startsWith('@font-face')
      );

      if (isAboveTheFold) {
        criticalLines.push(line);
      }
    }

    const critical = criticalLines.join('\n');

    // Track performance metric
    const endTime = performance.now();
    performanceMonitor.addMetric({
      name: 'above_the_fold_css_generation',
      value: endTime - startTime,
      timestamp: Date.now(),
      rating:
        endTime - startTime < 30 ? PerformanceRating.GOOD : PerformanceRating.NEEDS_IMPROVEMENT,
    });

    return critical;
  } catch (error) {
    performanceMonitor.addMetric({
      name: 'above_the_fold_css_generation_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    return '';
  }
}

/**
 * Get critical CSS performance metrics
 */
export function getCriticalCSSMetrics(): PerformanceMetric[] {
  return performanceMonitor
    .getMetricsByName('critical_css_extraction')
    .concat(performanceMonitor.getMetricsByName('critical_css_inlining'))
    .concat(performanceMonitor.getMetricsByName('non_critical_css_loading'))
    .concat(performanceMonitor.getMetricsByName('critical_css_processing'))
    .concat(performanceMonitor.getMetricsByName('above_the_fold_css_generation'));
}
