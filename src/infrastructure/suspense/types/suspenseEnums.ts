/**
 * Suspense Enums
 *
 * Centralized constants for lazy loading and suspense configuration.
 * Foundation-level only - no overengineering.
 */

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

/**
 * Default retry configuration values
 */
export enum RetryConfig {
  DEFAULT_MAX_RETRIES = 3,
  DEFAULT_RETRY_DELAY = 1000,
  SIMPLE_MAX_RETRIES = 0,
  SIMPLE_RETRY_DELAY = 1,
  ROBUST_MAX_RETRIES = 5,
  ROBUST_RETRY_DELAY = 500,
}

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Loading state values
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// ============================================================================
// LOADING SIZES
// ============================================================================

/**
 * Loading fallback sizes
 */
export enum LoadingSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

/**
 * Component height values for loading fallbacks
 */
export enum ComponentHeight {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

// ============================================================================
// ENVIRONMENT VALUES
// ============================================================================

/**
 * Environment values
 */
export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
