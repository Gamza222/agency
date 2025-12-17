/**
 * Authentication Token Constants
 *
 * Centralized auth token keys for consistent usage.
 * Foundation-level only - no overengineering.
 */

// ============================================================================
// AUTH TOKEN KEYS
// ============================================================================

/**
 * Authentication token storage keys
 */
export enum AuthTokenKey {
  AUTH_TOKEN = 'auth_token',
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  ID_TOKEN = 'id_token',
}

// ============================================================================
// AUTH TOKEN UTILITIES
// ============================================================================

/**
 * Get all possible auth token keys
 */
export function getAllAuthTokenKeys(): string[] {
  return Object.values(AuthTokenKey);
}

/**
 * Get primary auth token key (most commonly used)
 */
export function getPrimaryAuthTokenKey(): string {
  return AuthTokenKey.ACCESS_TOKEN;
}
