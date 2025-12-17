/**
 * Browser API Mocks
 *
 * Type: 🔄 AUTOMATIC
 *
 * This file exports browser API mocks that are automatically applied
 * via Jest's setupFilesAfterEnv configuration. Only exports what's
 * useful for test control.
 */

// Useful test control exports
export { MockIntersectionObserver } from './lib/media/intersectionObserver.mock';
export { mockMatchMedia } from './lib/media/matchMedia.mock';
export { mockStorage } from './lib/storage/storage.mock';
export { mockLocation } from './lib/location/location.mock';
export { mockWindowLocationReload } from './lib/location/windowLocationReload.mock';
export { mockNavigator } from './lib/navigator/navigator.mock';
export { mockConsole } from './lib/console/console.mock';

// Event and React testing utilities
export {
  createMockEventListener,
  createMockEventListenerWithExpectations,
  createMockEventListenerWithTracking,
  createMockEvent,
  createMockEventEmitter,
} from './lib/event/event.mock';
export {
  createMockRenderCounter,
  createMockRenderCounterWithExpectations,
  createMockComponentProps,
  createMockRef,
  createMockCallbackRef,
  createMockStateSetter,
  createMockEffectCleanup,
} from './lib/react/react.mock';

// Performance API exports
export {
  mockPerformance,
  setupPerformanceMock,
  defaultPerformanceMock,
} from './lib/performance/performance.mock';
export {
  mockNavigationTiming,
  mockNavigationEntries,
  defaultNavigationMock,
} from './lib/performance/navigation.mock';

// Export types that might be needed for test typing
export type {
  mockIntersectionObserverInterface,
  mockMediaQueryInterface,
  mockStorageInterface,
  mockLocationInterface,
  mockNavigatorInterface,
  mockPerformanceInterface,
  mockNavigationTimingInterface,
} from './types/types';
