/**
 * Sentry Mock
 *
 * Centralized mock for @sentry/react to avoid duplication across test files.
 * Used for testing error reporting and analytics functionality.
 */

import type {
  MockSentryInterface,
  MockSentryTransaction,
  SentryTestUtilsInterface,
} from '../types/types';

/**
 * Sentry API mock implementation
 * Provides all essential Sentry functions as Jest mocks
 */
export const mockSentry: MockSentryInterface = {
  // Error capturing
  captureException: jest.fn(),
  captureMessage: jest.fn(),

  // Context management
  setUser: jest.fn(),
  setTag: jest.fn(),
  setExtra: jest.fn(),
  addBreadcrumb: jest.fn(),
  configureScope: jest.fn(),

  // Scope management
  withScope: jest.fn((callback: (scope: MockSentryInterface) => void) => callback(mockSentry)),
  getCurrentHub: jest.fn(() => mockSentry),

  // Transaction/performance monitoring
  startTransaction: jest.fn(
    (): MockSentryTransaction => ({
      setTag: jest.fn(),
      setData: jest.fn(),
      finish: jest.fn(),
    })
  ),

  // Integration helpers
  flush: jest.fn(() => Promise.resolve(true)),
  close: jest.fn(() => Promise.resolve(true)),
};

/**
 * Factory function to create fresh Sentry mock instances
 * Useful when you need isolated mocks for specific tests
 */
export const createSentryMock = (): MockSentryInterface => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setExtra: jest.fn(),
  addBreadcrumb: jest.fn(),
  configureScope: jest.fn(),
  withScope: jest.fn((callback: (scope: MockSentryInterface) => void) => callback(mockSentry)),
  getCurrentHub: jest.fn(() => mockSentry),
  startTransaction: jest.fn(
    (): MockSentryTransaction => ({
      setTag: jest.fn(),
      setData: jest.fn(),
      finish: jest.fn(),
    })
  ),
  flush: jest.fn(() => Promise.resolve(true)),
  close: jest.fn(() => Promise.resolve(true)),
});

/**
 * Test utilities for Sentry mock assertions
 */
export const sentryTestUtils: SentryTestUtilsInterface = {
  /**
   * Clear all Sentry mock calls
   */
  clearMocks: () => {
    Object.values(mockSentry).forEach((mock) => {
      if (jest.isMockFunction(mock)) {
        mock.mockClear();
      }
    });
  },

  /**
   * Reset all Sentry mocks to their initial state
   */
  resetMocks: () => {
    Object.values(mockSentry).forEach((mock) => {
      if (jest.isMockFunction(mock)) {
        mock.mockReset();
      }
    });
  },

  /**
   * Assert that an exception was captured
   */
  expectExceptionCaptured: (error?: Error | string) => {
    expect(mockSentry.captureException).toHaveBeenCalled();
    if (error) {
      expect(mockSentry.captureException).toHaveBeenCalledWith(
        expect.objectContaining(
          typeof error === 'string' ? { message: error } : { message: error.message }
        ),
        expect.any(Object)
      );
    }
  },

  /**
   * Assert that a message was captured
   */
  expectMessageCaptured: (message: string) => {
    expect(mockSentry.captureMessage).toHaveBeenCalledWith(message, expect.any(String));
  },

  /**
   * Assert that user context was set
   */
  expectUserSet: (userId?: string) => {
    expect(mockSentry.setUser).toHaveBeenCalled();
    if (userId) {
      expect(mockSentry.setUser).toHaveBeenCalledWith(expect.objectContaining({ id: userId }));
    }
  },

  /**
   * Assert that tags were set
   */
  expectTagSet: (key: string, value?: string) => {
    expect(mockSentry.setTag).toHaveBeenCalledWith(key, value || expect.any(String));
  },

  /**
   * Get all captured exceptions
   */
  getCapturedExceptions: (): jest.Mock['mock']['calls'] => {
    return mockSentry.captureException.mock.calls;
  },

  /**
   * Get all captured messages
   */
  getCapturedMessages: (): jest.Mock['mock']['calls'] => {
    return mockSentry.captureMessage.mock.calls;
  },
};

// Export the main mock for Jest module mocking
export default mockSentry;
