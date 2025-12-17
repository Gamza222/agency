/**
 * Error Mocks
 *
 * Type: 📦 MANUAL
 *
 * This file exports only the actively used mocks for error-related testing utilities.
 * These are MANUAL mocks - they use named exports for functions that need to be imported
 * and controlled in tests.
 *
 * Organization follows SOLID principles:
 * - errorBoundary.mock.ts: Reset function factory for ErrorBoundary testing (SRP: reset functions)
 */

// ============================================================================
// ERROR BOUNDARY MOCKING
// ============================================================================

export { createMockResetFunction } from './lib/errorBoundary.mock';
