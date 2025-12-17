/**
 * State Enums
 *
 * Centralized constants for state management configuration.
 * Foundation-level only - no overengineering.
 */

// ============================================================================
// STORAGE TYPES
// ============================================================================

/**
 * Storage types for persistence
 */
export enum StorageType {
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage',
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

// ============================================================================
// STORE CONFIGURATION
// ============================================================================

/**
 * Default store configuration values
 */
export enum StoreConfigDefaults {
  DEFAULT_STORAGE = 'localStorage',
}

// ============================================================================
// BASE STATE PROPERTIES
// ============================================================================

/**
 * Base state property names
 */
export enum BaseStateProperty {
  HYDRATED = '_hydrated',
}
