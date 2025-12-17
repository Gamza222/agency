/**
 * ErrorBoundary.mock.ts
 *
 * Single Responsibility: Provides factory function for creating mock reset functions
 * specifically for ErrorBoundary testing.
 *
 * Usage:
 * - Use createMockResetFunction to generate mock reset functions for testing error boundary recovery
 * - This is the only mock currently used in the ErrorBoundary test suite
 */

// External dependencies
// Reset handler function type
type ResetHandlerFunction = () => void;

// ============================================================================
// MOCK FUNCTION FACTORIES
// ============================================================================

/**
 * Creates a mock reset function with default implementation
 *
 * @usage
 * Use this when testing reset functionality, recovery flows,
 * or when you need to verify that reset functions are called correctly.
 *
 * PREFER real reset functions when testing integration scenarios.
 * Use this mock when you need to control the reset behavior or verify calls.
 */
export const createMockResetFunction = (): jest.MockedFunction<ResetHandlerFunction> => {
  return jest.fn();
};
