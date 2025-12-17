/**
 * Image Optimization Utilities
 *
 * Next.js Image component optimization and utilities for maximum performance.
 * Built on top of existing performance monitoring infrastructure.
 */

import type {
  ImageOptimizationConfig,
  ImageOptimizationResult,
} from '../../types/performance.types';
import { ImageFormat, PerformanceRating } from '../../types/performance.enums';
import { performanceMonitor } from '../performance-monitor';

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: ImageOptimizationConfig = {
  quality: 75,
  format: ImageFormat.WEBP,
  responsive: true,
  lazyThreshold: 0.1,
  placeholder: 'blur',
};

// ============================================================================
// IMAGE OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Generate optimized image URL with Next.js Image optimization
 */
export function generateOptimizedImageUrl(
  src: string,
  width: number,
  height: number,
  config: ImageOptimizationConfig = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Start performance measurement
  const startTime = performance.now();

  try {
    // Build Next.js Image optimization URL
    const params = new URLSearchParams();

    // Add quality parameter
    if (finalConfig.quality) {
      params.set('q', finalConfig.quality.toString());
    }

    // Add format parameter
    if (finalConfig.format) {
      params.set('f', finalConfig.format);
    }

    // Add responsive parameter
    if (finalConfig.responsive) {
      params.set('w', width.toString());
      params.set('h', height.toString());
    }

    // Build optimized URL
    const optimizedUrl = `${src}?${params.toString()}`;

    // Measure performance
    const endTime = performance.now();
    const optimizationTime = endTime - startTime;

    // Track performance metric
    performanceMonitor.addMetric({
      name: 'image_optimization',
      value: optimizationTime,
      timestamp: Date.now(),
      rating:
        optimizationTime < 10
          ? PerformanceRating.GOOD
          : optimizationTime < 50
            ? PerformanceRating.NEEDS_IMPROVEMENT
            : PerformanceRating.POOR,
    });

    return optimizedUrl;
  } catch (error) {
    // Track error as performance metric
    performanceMonitor.addMetric({
      name: 'image_optimization_error',
      value: 0,
      timestamp: Date.now(),
      rating: PerformanceRating.POOR,
    });

    // Return original URL as fallback
    return src;
  }
}

/**
 * Generate responsive image sources for different screen sizes
 */
export function generateResponsiveImageSources(
  src: string,
  sizes: { width: number; height: number; breakpoint: string }[],
  config: ImageOptimizationConfig = {}
): { src: string; width: number; height: number; media: string }[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return sizes.map(({ width, height, breakpoint }) => ({
    src: generateOptimizedImageUrl(src, width, height, finalConfig),
    width,
    height,
    media: `(max-width: ${breakpoint})`,
  }));
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurPlaceholder(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create a simple gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * Calculate image optimization ratio
 */
export function calculateOptimizationRatio(originalSize: number, optimizedSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - optimizedSize) / originalSize) * 100);
}

/**
 * Get image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'avif' | 'jpeg' | 'png' {
  // Check for AVIF support
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Test AVIF support
      const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      if (avifSupported) return 'avif';

      // Test WebP support
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      if (webpSupported) return 'webp';
    }
  }

  // Fallback to JPEG
  return 'jpeg';
}

/**
 * Preload critical images with optimization
 */
export function preloadOptimizedImages(
  images: { src: string; width: number; height: number }[],
  config: ImageOptimizationConfig = {}
): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  images.forEach(({ src, width, height }) => {
    const optimizedSrc = generateOptimizedImageUrl(src, width, height, finalConfig);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedSrc;
    link.setAttribute('imagesizes', `${width}px`);
    link.setAttribute('imagesrcset', optimizedSrc);

    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyImageLoading(
  imageSelector: string = 'img[data-lazy]',
  config: ImageOptimizationConfig = {}
): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll(imageSelector);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.lazy;

          if (src) {
            // Load the optimized image
            const optimizedSrc = generateOptimizedImageUrl(
              src,
              img.width || 800,
              img.height || 600,
              finalConfig
            );

            img.src = optimizedSrc;
            img.removeAttribute('data-lazy');
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: `${(finalConfig.lazyThreshold || 0.1) * 100}%`,
    }
  );

  images.forEach((img) => observer.observe(img));
}

/**
 * Get image optimization result with metrics
 */
export function getImageOptimizationResult(
  _originalSrc: string,
  optimizedSrc: string,
  width: number,
  height: number
): ImageOptimizationResult {
  // Calculate file size (simplified - in real app you'd measure actual sizes)
  const estimatedOriginalSize = width * height * 3; // Rough estimate
  const estimatedOptimizedSize = Math.round(estimatedOriginalSize * 0.3); // WebP is ~70% smaller

  return {
    src: optimizedSrc,
    width,
    height,
    format: 'webp',
    size: estimatedOptimizedSize,
    optimizationRatio: calculateOptimizationRatio(estimatedOriginalSize, estimatedOptimizedSize),
  };
}
