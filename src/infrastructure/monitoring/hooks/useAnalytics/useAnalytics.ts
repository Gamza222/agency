/**
 * Analytics Hook
 *
 * React hook for tracking user interactions and analytics events.
 * Provides a simple interface for analytics tracking with privacy compliance.
 */

'use client';

import { useCallback, useEffect } from 'react';
import { MonitoringService } from '../../lib/monitoring.service';
import { AnalyticsEventType } from '../../types/monitoring.types';

interface UseAnalyticsOptions {
  userId?: string;
  trackPageViews?: boolean;
  trackUserInteractions?: boolean;
}

interface UseAnalyticsReturn {
  trackEvent: (
    type: AnalyticsEventType,
    name: string,
    properties?: Record<string, unknown>
  ) => void;
  trackPageView: (path: string) => void;
  trackUserInteraction: (
    action: string,
    target?: string,
    properties?: Record<string, unknown>
  ) => void;
  trackPerformance: (metric: string, value: number, unit?: string) => void;
  trackError: (error: Error, context?: Record<string, unknown>) => void;
}

/**
 * Analytics hook for tracking user behavior and events
 *
 * @param options - Analytics configuration options
 * @returns Analytics tracking functions
 */
export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
  const { userId, trackPageViews = true, trackUserInteractions = true } = options;

  // Get monitoring service instance
  const monitoringService = MonitoringService.getInstance();

  // Track page views automatically
  useEffect(() => {
    if (trackPageViews && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      monitoringService.trackPageView(currentPath, userId);

      // Track page views on route changes (for SPA)
      const handleRouteChange = () => {
        const newPath = window.location.pathname;
        monitoringService.trackPageView(newPath, userId);
      };

      // Listen for popstate events (back/forward navigation)
      window.addEventListener('popstate', handleRouteChange);

      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
    // Return undefined for the else case
    return undefined;
  }, [trackPageViews, userId, monitoringService]);

  // Track generic events
  const trackEvent = useCallback(
    (type: AnalyticsEventType, name: string, properties?: Record<string, unknown>) => {
      monitoringService.trackEvent(type, name, properties, userId);
    },
    [monitoringService, userId]
  );

  // Track page views
  const trackPageView = useCallback(
    (path: string) => {
      monitoringService.trackPageView(path, userId);
    },
    [monitoringService, userId]
  );

  // Track user interactions
  const trackUserInteraction = useCallback(
    (action: string, target?: string, properties?: Record<string, unknown>) => {
      if (trackUserInteractions) {
        const interactionProperties = {
          action,
          target,
          ...properties,
        };
        monitoringService.trackEvent(
          AnalyticsEventType.USER_INTERACTION,
          'user_interaction',
          interactionProperties,
          userId
        );
      }
    },
    [trackUserInteractions, monitoringService, userId]
  );

  // Track performance metrics
  const trackPerformance = useCallback(
    (metric: string, value: number, unit: string = 'ms') => {
      monitoringService.trackEvent(
        AnalyticsEventType.PERFORMANCE_METRIC,
        'performance_metric',
        { metric, value, unit },
        userId
      );
    },
    [monitoringService, userId]
  );

  // Track errors
  const trackError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      monitoringService.trackEvent(
        AnalyticsEventType.ERROR_EVENT,
        'error_event',
        {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context,
        },
        userId
      );
    },
    [monitoringService, userId]
  );

  return {
    trackEvent,
    trackPageView,
    trackUserInteraction,
    trackPerformance,
    trackError,
  };
};
