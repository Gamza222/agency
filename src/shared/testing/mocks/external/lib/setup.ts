/**
 * External Mocks Auto-Setup
 *
 * Automatically applies external library mocks globally for all tests.
 * This file is imported by the Jest setup to ensure consistent mocking.
 */

import { mockSentry } from './sentry.mock';

// ============================================================================
// AUTOMATIC MOCK SETUP
// ============================================================================

/**
 * Auto-mock @sentry/react with our centralized mock
 * This ensures all test files get the same Sentry mock without manual setup
 */
jest.mock('@sentry/react', (): typeof mockSentry => mockSentry);

// ============================================================================
// FUTURE AUTO-MOCKS
// ============================================================================

// NOTE: Add other global mocks here as needed:
// jest.mock('google-analytics', () => mockGoogleAnalytics);
// jest.mock('@stripe/stripe-js', () => mockStripe);
// etc.
