/**
 * External Library Mocks
 *
 * Type: 🔄 AUTOMATIC & 📦 MANUAL
 *
 * This file exports external library mocks and auto-applies global mocks.
 * Some mocks are automatically applied globally (like Sentry), while others
 * need to be manually imported and configured in tests.
 *
 * Organization follows SOLID principles:
 * - sentry.mock.ts: Complete Sentry API mock (SRP: Sentry error reporting)
 */

// Auto-apply global mocks (must be first)
import './lib/setup';

// ============================================================================
// ANALYTICS & MONITORING MOCKS
// ============================================================================

export { mockSentry, createSentryMock, sentryTestUtils } from './lib/sentry.mock';

// ============================================================================
// TYPES
// ============================================================================

export type {
  MockSentryInterface,
  MockSentryTransaction,
  SentryTestUtilsInterface,
} from './types/types';

// ============================================================================
// FUTURE EXTERNAL MOCKS
// ============================================================================

// NOTE: Add other external library mocks here as needed:
// - Google Analytics mocks
// - Stripe SDK mocks
// - Auth0 mocks
// - AWS SDK mocks
// etc.
