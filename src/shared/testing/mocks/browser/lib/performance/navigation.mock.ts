/**
 * Navigation Timing Mock for Testing
 *
 * Provides a mock implementation of navigation timing for testing environments.
 * Simulates navigation timing entries and performance measurements.
 */

import { mockNavigationTimingInterface } from '../../types/types';

// Default navigation timing data
const defaultNavigationData: mockNavigationTimingInterface = {
  name: 'navigation',
  startTime: 0,
  duration: 1000,
  loadEventEnd: 1000,
  loadEventStart: 500,
  domContentLoadedEventEnd: 800,
  domContentLoadedEventStart: 700,
  responseEnd: 300,
  responseStart: 200,
  requestStart: 150,
  connectEnd: 100,
  connectStart: 50,
  domainLookupEnd: 40,
  domainLookupStart: 30,
  navigationStart: 0,
};

/**
 * Creates a mock navigation timing entry for testing
 *
 * @param customData - Optional custom navigation timing data to override defaults
 * @returns A mock navigation timing entry
 */
export const mockNavigationTiming = (
  customData: Partial<mockNavigationTimingInterface> = {}
): mockNavigationTimingInterface => {
  return {
    ...defaultNavigationData,
    ...customData,
  };
};

/**
 * Creates an array of navigation timing entries for testing
 *
 * @param customData - Optional custom navigation timing data to override defaults
 * @returns An array containing a mock navigation timing entry
 */
export const mockNavigationEntries = (
  customData: Partial<mockNavigationTimingInterface> = {}
): mockNavigationTimingInterface[] => {
  return [mockNavigationTiming(customData)];
};

// Default navigation timing mock instance
export const defaultNavigationMock = mockNavigationTiming();
