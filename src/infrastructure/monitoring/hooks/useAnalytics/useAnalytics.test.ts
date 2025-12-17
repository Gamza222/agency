/**
 * Analytics Hook Tests
 *
 * Tests for the useAnalytics hook including event tracking,
 * page view tracking, and user interaction tracking.
 */

/* eslint-disable @typescript-eslint/unbound-method */

import { act, renderHook } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { MonitoringService } from '../../lib/monitoring.service';
import { AnalyticsEventType } from '../../types/monitoring.types';
import { createMockMonitoringServiceInstance } from '@/shared/testing/mocks/infrastructure';
import { mockLocation } from '@/shared/testing/mocks/browser';

// Mock the monitoring service
jest.mock('../../lib/monitoring.service');
const MockedMonitoringService = MonitoringService as any;

// Mock the static methods
MockedMonitoringService.getInstance = jest.fn();

describe('useAnalytics', () => {
  let mockInstance: jest.Mocked<MonitoringService>;

  beforeEach(() => {
    mockInstance = createMockMonitoringServiceInstance({
      trackEvent: jest.fn(),
      trackPageView: jest.fn(),
    });

    (MockedMonitoringService.getInstance as jest.Mock).mockReturnValue(mockInstance);

    // Mock window.location using mock factory
    mockLocation('http://localhost/test-page');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should track page views automatically', () => {
    renderHook(() => useAnalytics({ trackPageViews: true }));

    expect(mockInstance.trackPageView).toHaveBeenCalledWith('/test-page', undefined);
  });

  it('should not track page views when disabled', () => {
    renderHook(() => useAnalytics({ trackPageViews: false }));

    expect(mockInstance.trackPageView).not.toHaveBeenCalled();
  });

  it('should track page views with userId', () => {
    renderHook(() => useAnalytics({ userId: 'user123' }));

    expect(mockInstance.trackPageView).toHaveBeenCalledWith('/test-page', 'user123');
  });

  it('should provide trackEvent function', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent(AnalyticsEventType.CUSTOM_EVENT, 'test_event', { test: 'data' });
    });

    expect(mockInstance.trackEvent).toHaveBeenCalledWith(
      AnalyticsEventType.CUSTOM_EVENT,
      'test_event',
      { test: 'data' },
      undefined
    );
  });

  it('should provide trackPageView function', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPageView('/custom-page');
    });

    expect(mockInstance.trackPageView).toHaveBeenCalledWith('/custom-page', undefined);
  });

  it('should provide trackUserInteraction function', () => {
    const { result } = renderHook(() => useAnalytics({ trackUserInteractions: true }));

    act(() => {
      result.current.trackUserInteraction('click', 'button', { id: 'submit-btn' });
    });

    expect(mockInstance.trackEvent).toHaveBeenCalledWith(
      AnalyticsEventType.USER_INTERACTION,
      'user_interaction',
      {
        action: 'click',
        target: 'button',
        id: 'submit-btn',
      },
      undefined
    );
  });

  it('should not track user interactions when disabled', () => {
    const { result } = renderHook(() => useAnalytics({ trackUserInteractions: false }));

    act(() => {
      result.current.trackUserInteraction('click', 'button');
    });

    expect(mockInstance.trackEvent).not.toHaveBeenCalled();
  });

  it('should provide trackPerformance function', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPerformance('page_load', 1500, 'ms');
    });

    expect(mockInstance.trackEvent).toHaveBeenCalledWith(
      AnalyticsEventType.PERFORMANCE_METRIC,
      'performance_metric',
      { metric: 'page_load', value: 1500, unit: 'ms' },
      undefined
    );
  });

  it('should use default unit for performance tracking', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPerformance('api_response', 200);
    });

    expect(mockInstance.trackEvent).toHaveBeenCalledWith(
      AnalyticsEventType.PERFORMANCE_METRIC,
      'performance_metric',
      { metric: 'api_response', value: 200, unit: 'ms' },
      undefined
    );
  });

  it('should provide trackError function', () => {
    const { result } = renderHook(() => useAnalytics());

    const testError = new Error('Test error');
    testError.stack = 'Error stack trace';

    act(() => {
      result.current.trackError(testError, { component: 'test-component' });
    });

    expect(mockInstance.trackEvent).toHaveBeenCalledWith(
      AnalyticsEventType.ERROR_EVENT,
      'error_event',
      {
        error: {
          name: 'Error',
          message: 'Test error',
          stack: 'Error stack trace',
        },
        context: { component: 'test-component' },
      },
      undefined
    );
  });

  it('should pass userId to all tracking functions', () => {
    const { result } = renderHook(() => useAnalytics({ userId: 'user123' }));

    act(() => {
      result.current.trackEvent(AnalyticsEventType.CUSTOM_EVENT, 'test');
      result.current.trackPageView('/test');
      result.current.trackUserInteraction('click');
      result.current.trackPerformance('test', 100);
      result.current.trackError(new Error('test'));
    });

    expect(mockInstance.trackEvent).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'user123'
    );
    expect(mockInstance.trackPageView).toHaveBeenCalledWith('/test', 'user123');
  });

  it('should handle route changes', () => {
    renderHook(() => useAnalytics());

    // Simulate route change
    act(() => {
      mockLocation('http://localhost/new-page');

      // Trigger popstate event
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(mockInstance.trackPageView).toHaveBeenCalledWith('/new-page', undefined);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useAnalytics());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
