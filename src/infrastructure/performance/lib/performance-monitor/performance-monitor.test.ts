import {
  getNavigationTiming,
  getPerformanceTiming,
  measureAsyncPerformance,
  measurePerformance,
  performanceMonitor,
  PerformanceMonitor,
} from './performance-monitor';
import { PerformanceRating } from '../../types/performance.enums';

// Import performance mocks from factory
import { mockNavigationEntries, setupPerformanceMock } from '@/shared/testing/mocks/browser';

// Setup performance mock
setupPerformanceMock();

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
    jest.clearAllMocks();
  });

  describe('addMetric', () => {
    it('should add a metric', () => {
      const metric = {
        name: 'test',
        value: 100,
        timestamp: Date.now(),
        rating: PerformanceRating.GOOD,
      };

      monitor.addMetric(metric);
      const metrics = monitor.getMetrics();

      expect(metrics).toHaveLength(1);
      expect(metrics[0]).toEqual(metric);
    });
  });

  describe('getMetricsByName', () => {
    it('should return metrics by name', () => {
      const metric1 = { name: 'test1', value: 100, timestamp: Date.now() };
      const metric2 = { name: 'test2', value: 200, timestamp: Date.now() };
      const metric3 = { name: 'test1', value: 300, timestamp: Date.now() };

      monitor.addMetric(metric1);
      monitor.addMetric(metric2);
      monitor.addMetric(metric3);

      const test1Metrics = monitor.getMetricsByName('test1');
      expect(test1Metrics).toHaveLength(2);
      expect(test1Metrics[0]).toEqual(metric1);
      expect(test1Metrics[1]).toEqual(metric3);
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers when metrics are added', () => {
      const callback = jest.fn();
      const unsubscribe = monitor.subscribe(callback);

      monitor.addMetric({ name: 'test', value: 100, timestamp: Date.now() });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.arrayContaining([expect.objectContaining({ name: 'test', value: 100 })]),
        })
      );

      unsubscribe();
    });
  });

  describe('clear', () => {
    it('should clear all metrics', () => {
      monitor.addMetric({ name: 'test', value: 100, timestamp: Date.now() });
      expect(monitor.getMetrics()).toHaveLength(1);

      monitor.clear();
      expect(monitor.getMetrics()).toHaveLength(0);
    });
  });
});

describe('measurePerformance', () => {
  it('should measure function execution time', () => {
    const fn = jest.fn(() => 'result');
    const result = measurePerformance('test', fn);

    expect(result).toBe('result');
    expect(fn).toHaveBeenCalled();
    expect(performanceMonitor.getMetrics()).toHaveLength(1);
  });
});

describe('measureAsyncPerformance', () => {
  it('should measure async function execution time', async () => {
    // Clear any existing metrics first
    performanceMonitor.clear();

    const fn = jest.fn(() => Promise.resolve('result'));
    const result = await measureAsyncPerformance('test', fn);

    expect(result).toBe('result');
    expect(fn).toHaveBeenCalled();
    expect(performanceMonitor.getMetrics()).toHaveLength(1);
  });
});

describe('getPerformanceTiming', () => {
  it('should return performance timing', () => {
    const timing = getPerformanceTiming();
    expect(timing).toEqual({
      navigationStart: 0,
      loadEventEnd: 1000,
    });
  });
});

describe('getNavigationTiming', () => {
  it('should return navigation timing', () => {
    // Use mock navigation entries from factory
    const mockEntries = mockNavigationEntries();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalGetEntriesByType = window.performance.getEntriesByType;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.performance.getEntriesByType = jest.fn((type) => {
      if (type === 'navigation') {
        return mockEntries;
      }
      return [];
    }) as any;

    const timing = getNavigationTiming();
    expect(timing).toBeDefined();
    expect(timing?.name).toBe('navigation');
    expect(timing?.startTime).toBe(0);
    expect(timing?.duration).toBe(1000);

    // Restore original function
    window.performance.getEntriesByType = originalGetEntriesByType;
  });
});
