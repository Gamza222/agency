import { AuthConfig, AuthProvider, AuthScope, AuthTokenType, JwtPayload } from './auth.types';

/**
 * Default authentication configuration
 */
export const authConfig: AuthConfig = {
  provider: AuthProvider.Local,
  tokenType: AuthTokenType.Bearer,
  tokenExpiry: 3600, // 1 hour
  refreshThreshold: 300, // 5 minutes before expiry
  scopes: [AuthScope.Read, AuthScope.Write],
};

/**
 * Generate authentication headers for API requests
 * @param token - Authentication token
 * @param tokenType - Type of token (default: Bearer)
 * @returns Headers object for HTTP requests
 */
export const getAuthHeaders = (
  token: string,
  tokenType: AuthTokenType = AuthTokenType.Bearer
): Record<string, string> => {
  return {
    Authorization: `${tokenType} ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Check if a JWT token is expired
 * @param token - JWT token to check
 * @returns true if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) return true;
    const payload = JSON.parse(atob(parts[1])) as JwtPayload;
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse it, consider it expired
  }
};

/**
 * Check if token needs refresh based on threshold
 * @param token - JWT token to check
 * @returns true if token should be refreshed
 */
export const shouldRefreshToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) return true;
    const payload = JSON.parse(atob(parts[1])) as JwtPayload;
    const currentTime = Date.now() / 1000;
    return payload.exp - currentTime < authConfig.refreshThreshold;
  } catch {
    return true;
  }
};
