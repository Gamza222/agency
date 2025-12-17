// Mock web-vitals before importing
jest.mock('web-vitals', () => ({
  onCLS: jest.fn((callback) => callback({ name: 'CLS', value: 0.05, rating: 'good' })),
  onINP: jest.fn((callback) => callback({ name: 'INP', value: 100, rating: 'good' })),
  onFCP: jest.fn((callback) => callback({ name: 'FCP', value: 1200, rating: 'good' })),
  onLCP: jest.fn((callback) => callback({ name: 'LCP', value: 2000, rating: 'good' })),
  onTTFB: jest.fn((callback) => callback({ name: 'TTFB', value: 600, rating: 'good' })),
}));

import {
  checkPerformanceBudget,
  getPerformanceRating,
  initWebVitals,
  PERFORMANCE_BUDGETS,
} from './web-vitals';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

describe('Web Vitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initWebVitals', () => {
    it('should initialize web vitals monitoring', async () => {
      // Import the mocked functions
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

      initWebVitals({
        debug: true,
        reportToSentry: false,
      });

      // Check that the web-vitals functions are called
      expect(onCLS).toHaveBeenCalled();
      expect(onINP).toHaveBeenCalled();
      expect(onFCP).toHaveBeenCalled();
      expect(onLCP).toHaveBeenCalled();
      expect(onTTFB).toHaveBeenCalled();
    });

    it('should not log in production', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      initWebVitals({
        debug: false,
        reportToSentry: false,
      });

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('PERFORMANCE_BUDGETS', () => {
    it('should have correct budget values', () => {
      expect(PERFORMANCE_BUDGETS.LCP).toBe(2500);
      expect(PERFORMANCE_BUDGETS.INP).toBe(200);
      expect(PERFORMANCE_BUDGETS.CLS).toBe(0.1);
      expect(PERFORMANCE_BUDGETS.FCP).toBe(1800);
      expect(PERFORMANCE_BUDGETS.TTFB).toBe(800);
    });
  });

  describe('checkPerformanceBudget', () => {
    it('should return true for good metrics', () => {
      expect(checkPerformanceBudget({ name: 'LCP', value: 2000 })).toBe(true);
      expect(checkPerformanceBudget({ name: 'INP', value: 100 })).toBe(true);
      expect(checkPerformanceBudget({ name: 'CLS', value: 0.05 })).toBe(true);
    });

    it('should return false for poor metrics', () => {
      expect(checkPerformanceBudget({ name: 'LCP', value: 3000 })).toBe(false);
      expect(checkPerformanceBudget({ name: 'INP', value: 300 })).toBe(false);
      expect(checkPerformanceBudget({ name: 'CLS', value: 0.2 })).toBe(false);
    });
  });

  describe('getPerformanceRating', () => {
    it('should return good for excellent metrics', () => {
      expect(getPerformanceRating({ name: 'LCP', value: 1000 })).toBe('good');
      expect(getPerformanceRating({ name: 'INP', value: 50 })).toBe('good');
    });

    it('should return needs-improvement for borderline metrics', () => {
      expect(getPerformanceRating({ name: 'LCP', value: 2000 })).toBe('needs-improvement');
      expect(getPerformanceRating({ name: 'INP', value: 180 })).toBe('needs-improvement');
    });

    it('should return poor for bad metrics', () => {
      expect(getPerformanceRating({ name: 'LCP', value: 3000 })).toBe('poor');
      expect(getPerformanceRating({ name: 'INP', value: 300 })).toBe('poor');
    });
  });
});
