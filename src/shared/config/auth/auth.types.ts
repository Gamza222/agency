/**
 * Authentication and authorization type definitions
 */

/** Supported authentication providers */
export enum AuthProvider {
  Local = 'local',
  Google = 'google',
  GitHub = 'github',
  Microsoft = 'microsoft',
}

/** Authentication token types */
export enum AuthTokenType {
  Bearer = 'Bearer',
  Basic = 'Basic',
  ApiKey = 'ApiKey',
}

/** User role-based access scopes */
export enum AuthScope {
  Read = 'read',
  Write = 'write',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

/** Authentication configuration interface */
export interface AuthConfig {
  provider: AuthProvider;
  tokenType: AuthTokenType;
  tokenExpiry: number; // in seconds
  refreshThreshold: number; // seconds before expiry to refresh
  scopes: AuthScope[];
}

/** JWT token payload structure */
export interface JwtPayload {
  sub: string; // subject (user ID)
  iat: number; // issued at
  exp: number; // expiration time
  scopes: AuthScope[];
  provider: AuthProvider;
}
