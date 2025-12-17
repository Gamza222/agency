/**
 * Performance-related type definitions
 */

import { ImageFormat, NonCriticalStrategy, PerformanceRating } from './performance.enums';

// ============================================================================
// WEB VITALS TYPES
// ============================================================================

export interface WebVitalsConfig {
  /** Whether to report to console in development */
  debug?: boolean;
  /** Custom analytics function */
  analytics?: (metric: { name: string; value: number; delta: number; rating: string }) => void;
  /** Whether to report to Sentry */
  reportToSentry?: boolean;
}

// ============================================================================
// PERFORMANCE MONITORING TYPES
// ============================================================================

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  rating?: PerformanceRating;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    totalMetrics: number;
    goodMetrics: number;
    needsImprovementMetrics: number;
    poorMetrics: number;
  };
  timestamp: number;
}

// ============================================================================
// IMAGE OPTIMIZATION TYPES
// ============================================================================

export interface ImageOptimizationConfig {
  /** Image quality (1-100) */
  quality?: number;
  /** Image format preference */
  format?: ImageFormat;
  /** Enable responsive images */
  responsive?: boolean;
  /** Lazy loading threshold */
  lazyThreshold?: number;
  /** Placeholder blur data URL */
  placeholder?: 'blur' | 'empty';
}

export interface ImageOptimizationResult {
  /** Optimized image URL */
  src: string;
  /** Image width */
  width: number;
  /** Image height */
  height: number;
  /** Image format */
  format: string;
  /** File size in bytes */
  size: number;
  /** Optimization ratio */
  optimizationRatio: number;
}

// ============================================================================
// RESOURCE PRELOADING TYPES
// ============================================================================

export interface ResourcePreloadConfig {
  /** Preload critical fonts */
  fonts?: boolean;
  /** Preload critical CSS */
  css?: boolean;
  /** Preload critical JavaScript */
  js?: boolean;
  /** Preload critical images */
  images?: boolean;
  /** Custom preload resources */
  custom?: PreloadResource[];
}

export interface PreloadResource {
  /** Resource URL */
  href: string;
  /** Resource type */
  as: 'font' | 'style' | 'script' | 'image' | 'fetch';
  /** Resource media query */
  media?: string;
  /** Resource crossorigin */
  crossOrigin?: 'anonymous' | 'use-credentials';
  /** Resource importance */
  importance?: 'high' | 'low' | 'auto';
}

// ============================================================================
// CRITICAL CSS TYPES
// ============================================================================

export interface CriticalCSSConfig {
  /** Extract critical CSS */
  extract?: boolean;
  /** Inline critical CSS */
  inline?: boolean;
  /** Critical CSS selector */
  selector?: string;
  /** Non-critical CSS loading strategy */
  nonCriticalStrategy?: NonCriticalStrategy;
}

export interface CriticalCSSResult {
  /** Critical CSS content */
  critical: string;
  /** Non-critical CSS content */
  nonCritical: string;
  /** CSS size in bytes */
  size: number;
  /** Critical CSS ratio */
  criticalRatio: number;
}

// ============================================================================
// HTTP CACHING TYPES
// ============================================================================

export interface HTTPCacheConfig {
  /** Cache control max age (seconds) */
  maxAge?: number;
  /** Cache control s-maxage (seconds) */
  sMaxAge?: number;
  /** Enable ETag */
  etag?: boolean;
  /** Enable Last-Modified */
  lastModified?: boolean;
  /** Cache control directives */
  directives?: string[];
}

export interface CacheStrategyConfig {
  /** Resource type */
  type: 'static' | 'dynamic' | 'api' | 'image' | 'font';
  /** Cache configuration */
  config: HTTPCacheConfig;
  /** Cache key pattern */
  keyPattern?: string;
}

// ============================================================================
// PRODUCTION CONFIG TYPES
// ============================================================================

export interface ProductionConfig {
  /** Enable compression */
  compression?: boolean;
  /** Enable minification */
  minification?: boolean;
  /** Enable tree shaking */
  treeShaking?: boolean;
  /** Enable code splitting */
  codeSplitting?: boolean;
  /** Bundle analyzer */
  bundleAnalyzer?: boolean;
  /** Source maps */
  sourceMaps?: boolean;
}
