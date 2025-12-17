/**
 * Performance API Mock for Testing
 *
 * Provides a mock implementation of the Performance API for testing environments.
 * Simulates performance timing and measurement capabilities.
 */

import { mockPerformanceInterface } from '../../types/types';

// Default performance mock data
const defaultPerformanceData = {
  now: jest.fn(() => 1000),
  timing: {
    navigationStart: 0,
    loadEventEnd: 1000,
  },
  getEntriesByType: jest.fn((type: string) => {
    if (type === 'navigation') {
      return [
        {
          name: 'navigation',
          startTime: 0,
          duration: 1000,
        },
      ];
    }
    return [];
  }),
};

/**
 * Creates a mock performance object for testing
 *
 * @param customData - Optional custom performance data to override defaults
 * @returns A mock performance object that implements mockPerformanceInterface
 */
export const mockPerformance = (
  customData: Partial<mockPerformanceInterface> = {}
): mockPerformanceInterface => {
  const performanceMock: mockPerformanceInterface = {
    ...defaultPerformanceData,
    ...customData,
  };

  return performanceMock;
};

// Global performance mock setup
export const setupPerformanceMock = (customData: Partial<mockPerformanceInterface> = {}): void => {
  const performanceMock = mockPerformance(customData);

  Object.defineProperty(window, 'performance', {
    value: performanceMock,
    writable: true,
  });
};

// Default performance mock instance
export const defaultPerformanceMock = mockPerformance();
