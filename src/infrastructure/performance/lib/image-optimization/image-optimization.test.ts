/**
 * Image Optimization Tests
 *
 * Comprehensive tests for image optimization utilities.
 */

import {
  calculateOptimizationRatio,
  generateBlurPlaceholder,
  generateOptimizedImageUrl,
  generateResponsiveImageSources,
  getImageOptimizationResult,
  getOptimalImageFormat,
  preloadOptimizedImages,
  setupLazyImageLoading,
} from './image-optimization';
import { ImageFormat } from '../../types/performance.enums';
// Mock performance monitor
jest.mock('../performance-monitor', () => ({
  performanceMonitor: {
    addMetric: jest.fn(),
  },
}));

describe('Image Optimization', () => {
  let performanceMonitor: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const { performanceMonitor: mockPerformanceMonitor } = await import('../performance-monitor');
    performanceMonitor = mockPerformanceMonitor;

    // Mock canvas
    Object.defineProperty(document, 'createElement', {
      value: jest.fn((tagName) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: jest.fn(() => ({
              createLinearGradient: jest.fn(() => ({
                addColorStop: jest.fn(),
              })),
              fillStyle: '',
              fillRect: jest.fn(),
            })),
            toDataURL: jest.fn((format) => {
              if (format === 'image/avif') return 'data:image/png;base64,';
              if (format === 'image/webp') return 'data:image/png;base64,';
              return 'data:image/jpeg;base64,';
            }),
          };
        }
        return {};
      }),
      writable: true,
    });
  });

  describe('generateOptimizedImageUrl', () => {
    it('should generate optimized URL with default config', () => {
      const result = generateOptimizedImageUrl('https://example.com/image.jpg', 800, 600);

      expect(result).toContain('https://example.com/image.jpg?');
      expect(result).toContain('q=75');
      expect(result).toContain('f=webp');
      expect(result).toContain('w=800');
      expect(result).toContain('h=600');
    });

    it('should generate optimized URL with custom config', () => {
      const config = {
        quality: 90,
        format: ImageFormat.AVIF,
        responsive: false,
      };

      const result = generateOptimizedImageUrl('https://example.com/image.jpg', 800, 600, config);

      expect(result).toContain('q=90');
      expect(result).toContain('f=avif');
      expect(result).not.toContain('w=800');
      expect(result).not.toContain('h=600');
    });

    it('should track performance metrics', () => {
      generateOptimizedImageUrl('https://example.com/image.jpg', 800, 600);

      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'image_optimization',
          value: expect.any(Number),
          timestamp: expect.any(Number),
          rating: expect.any(String),
        })
      );
    });

    it('should handle errors gracefully', () => {
      // Mock an error in the generation
      jest.spyOn(URLSearchParams.prototype, 'toString').mockImplementation(() => {
        throw new Error('URLSearchParams error');
      });

      const result = generateOptimizedImageUrl('https://example.com/image.jpg', 800, 600);

      expect(result).toBe('https://example.com/image.jpg');
      expect(performanceMonitor.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'image_optimization_error',
          rating: 'poor',
        })
      );
    });
  });

  describe('generateResponsiveImageSources', () => {
    it('should generate responsive sources for different breakpoints', () => {
      const sizes = [
        { width: 400, height: 300, breakpoint: '768px' },
        { width: 800, height: 600, breakpoint: '1024px' },
        { width: 1200, height: 900, breakpoint: '1440px' },
      ];

      const result = generateResponsiveImageSources('https://example.com/image.jpg', sizes);

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        width: 400,
        height: 300,
        media: '(max-width: 768px)',
      });
      expect(result[1]).toMatchObject({
        width: 800,
        height: 600,
        media: '(max-width: 1024px)',
      });
      expect(result[2]).toMatchObject({
        width: 1200,
        height: 900,
        media: '(max-width: 1440px)',
      });
    });
  });

  describe('generateBlurPlaceholder', () => {
    it('should generate blur placeholder data URL', () => {
      const result = generateBlurPlaceholder(10, 10);

      expect(result).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('should use default dimensions when not provided', () => {
      const result = generateBlurPlaceholder();

      expect(result).toMatch(/^data:image\/jpeg;base64,/);
    });
  });

  describe('calculateOptimizationRatio', () => {
    it('should calculate correct optimization ratio', () => {
      expect(calculateOptimizationRatio(1000, 300)).toBe(70);
      expect(calculateOptimizationRatio(1000, 500)).toBe(50);
      expect(calculateOptimizationRatio(1000, 1000)).toBe(0);
    });

    it('should handle zero original size', () => {
      expect(calculateOptimizationRatio(0, 300)).toBe(0);
    });
  });

  describe('getOptimalImageFormat', () => {
    it('should return jpeg as fallback', () => {
      const result = getOptimalImageFormat();
      expect(result).toBe('jpeg');
    });
  });

  describe('preloadOptimizedImages', () => {
    beforeEach(() => {
      // Mock document methods
      Object.defineProperty(document, 'createElement', {
        value: jest.fn(() => ({
          rel: '',
          as: '',
          href: '',
          setAttribute: jest.fn(),
        })),
        writable: true,
      });

      Object.defineProperty(document, 'head', {
        value: {
          appendChild: jest.fn(),
        },
        writable: true,
      });
    });

    it('should preload critical images', () => {
      const images = [
        { src: 'https://example.com/image1.jpg', width: 800, height: 600 },
        { src: 'https://example.com/image2.jpg', width: 400, height: 300 },
      ];

      preloadOptimizedImages(images);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(document.createElement).toHaveBeenCalledWith('link');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(document.head.appendChild).toHaveBeenCalledTimes(2);
    });
  });

  describe('setupLazyImageLoading', () => {
    beforeEach(() => {
      // Mock IntersectionObserver
      global.IntersectionObserver = jest.fn().mockImplementation((_callback) => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      }));

      // Mock document methods
      Object.defineProperty(document, 'querySelectorAll', {
        value: jest.fn(() => []),
        writable: true,
      });
    });

    it('should setup lazy loading for images', () => {
      setupLazyImageLoading();

      expect(global.IntersectionObserver).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(document.querySelectorAll).toHaveBeenCalledWith('img[data-lazy]');
    });

    it('should handle server-side rendering', () => {
      // Mock window as undefined
      const originalWindow = global.window;
      delete (global as any).window;

      setupLazyImageLoading();

      expect(global.IntersectionObserver).not.toHaveBeenCalled();

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('getImageOptimizationResult', () => {
    it('should return optimization result with metrics', () => {
      const result = getImageOptimizationResult(
        'https://example.com/original.jpg',
        'https://example.com/optimized.webp',
        800,
        600
      );

      expect(result).toMatchObject({
        src: 'https://example.com/optimized.webp',
        width: 800,
        height: 600,
        format: 'webp',
        size: expect.any(Number),
        optimizationRatio: expect.any(Number),
      });

      expect(result.optimizationRatio).toBeGreaterThan(0);
    });
  });
});
