'use client';

import { useEffect } from 'react';
import { initWebVitals } from '../../lib/web-vitals';

/**
 * Performance Initializer Component
 * Initializes performance monitoring when the app starts
 */
export function PerformanceInitializer() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals({
      debug: process.env.NODE_ENV === 'development',
      reportToSentry: true,
    });
  }, []);

  return null;
}
