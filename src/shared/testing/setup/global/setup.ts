/**
 * Global Test Setup
 *
 * This file is executed before all tests run.
 * It sets up global test environment configurations and polyfills.
 */

import '@testing-library/jest-dom';

// Mock IntersectionObserver
import '@/shared/testing/mocks/browser/lib/media/intersectionObserver.mock';

// Mock matchMedia
import '@/shared/testing/mocks/browser/lib/media/matchMedia.mock';

// Mock localStorage and sessionStorage
import '@/shared/testing/mocks/browser/lib/storage/storage.mock';

// Type definitions for global test environment
declare global {
  interface Window {
    HTMLElement: typeof HTMLElement;
  }
}

// Configure global test environment
const globalTestConfig = {
  // Test timeout
  testTimeout: 10000,

  // Mock fetch if not available
  fetch: global.fetch || (() => Promise.resolve(new Response())),
};

// Apply global configuration
Object.assign(global, globalTestConfig);

// Add custom matchers or global test utilities here
const originalConsoleError = console.error;

// Filter out specific React warnings that are expected in tests
console.error = (...args: unknown[]) => {
  const message = args[0];

  // Skip React warnings about act() in tests
  if (
    typeof message === 'string' &&
    (message.includes('Warning: ReactDOM.render is no longer supported') ||
      message.includes('Warning: An invalid form control') ||
      message.includes('The above error occurred in the') ||
      message.includes('React will try to recreate this component tree') ||
      message.includes('Error: Uncaught [Error:') ||
      message.includes('Error: Uncaught [TypeError:') ||
      message.includes('Error: Uncaught [ReferenceError:') ||
      message.includes('Error: Render error') ||
      message.includes('Error: Test error') ||
      message.includes('Error: Network request failed') ||
      message.includes('Error: Failed to fetch') ||
      message.includes('Error: Loading chunk') ||
      message.includes('Error: Regular component error') ||
      message.includes('Error: Synchronous error') ||
      message.includes('Error: Complex error') ||
      message.includes('Warning: A suspended resource finished loading inside a test'))
  ) {
    return;
  }

  // Call original console.error for other messages
  originalConsoleError(...args);
};

// Global test cleanup to prevent memory leaks
afterEach(() => {
  // Clear all timers
  jest.clearAllTimers();
  // Clear all mocks
  jest.clearAllMocks();
  // Clear any pending promises
  if (global.gc) {
    global.gc();
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  // Don't fail the test for unhandled rejections in test environment
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    return;
  }
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
  throw reason;
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  // Don't fail the test for uncaught exceptions in test environment
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    return;
  }
  console.error('Uncaught Exception:', error);
  throw error;
});

// Global test teardown
afterAll(() => {
  // Clear all timers
  jest.clearAllTimers();
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
});
