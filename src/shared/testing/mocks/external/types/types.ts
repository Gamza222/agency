/**
 * External Library Mock Types
 *
 * Types for external library mocks used in testing.
 * These types ensure consistency across external mock implementations.
 */

// ============================================================================
// SENTRY MOCK TYPES
// ============================================================================

/**
 * Mock transaction object returned by Sentry.startTransaction
 */
export interface MockSentryTransaction {
  setTag: jest.Mock;
  setData: jest.Mock;
  finish: jest.Mock;
}

/**
 * Sentry mock interface matching the actual Sentry API
 */
export interface MockSentryInterface {
  // Error capturing
  captureException: jest.Mock;
  captureMessage: jest.Mock;

  // Context management
  setUser: jest.Mock;
  setTag: jest.Mock;
  setExtra: jest.Mock;
  addBreadcrumb: jest.Mock;
  configureScope: jest.Mock;

  // Scope management
  withScope: jest.Mock;
  getCurrentHub: jest.Mock;

  // Transaction/performance monitoring
  startTransaction: jest.Mock;

  // Integration helpers
  flush: jest.Mock;
  close: jest.Mock;
}

/**
 * Sentry test utilities interface
 */
export interface SentryTestUtilsInterface {
  clearMocks: () => void;
  resetMocks: () => void;
  expectExceptionCaptured: (error?: Error | string) => void;
  expectMessageCaptured: (message: string) => void;
  expectUserSet: (userId?: string) => void;
  expectTagSet: (key: string, value?: string) => void;
  getCapturedExceptions: () => jest.Mock['mock']['calls'];
  getCapturedMessages: () => jest.Mock['mock']['calls'];
}

// ============================================================================
// FUTURE EXTERNAL MOCK TYPES
// ============================================================================

// NOTE: Add other external library mock types here as needed:
// - Google Analytics types
// - Stripe SDK types
// - Auth0 types
// - AWS SDK types
// etc.
