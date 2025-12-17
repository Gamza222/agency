'use client';

import { useEffect } from 'react';
import { initWebVitals } from '../../lib/web-vitals';

/**
 * Hook to initialize performance monitoring
 */
export function usePerformance() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals({
      debug: process.env.NODE_ENV === 'development',
      reportToSentry: true,
    });
  }, []);
}

/**
 * Hook to measure component performance
 */
export function useComponentPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Log component render time in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }); // No dependency array to run on every render
}
