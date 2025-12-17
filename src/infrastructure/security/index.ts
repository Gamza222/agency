/**
 * Security Infrastructure Exports
 */

// Export types
export type {
  User,
  UserRole,
  Permission,
  AuthToken,
  LoginCredentials,
  RegisterData,
  AuthorizationContext,
  PermissionCheck,
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity,
  RateLimitInfo,
  RateLimitConfig,
  SecurityConfig,
  CorsConfig,
  AuthConfig,
  CSPDirective,
  CSPViolation,
  SecurityHeaders,
  EncryptionConfig,
  EncryptedData,
} from './types/security.types';

// Export lib functionality
export { AuthService } from './lib';
export { AuthorizationService } from './lib';
export { RateLimiterService } from './lib';
export {
  applySecurityHeaders,
  generateNonce,
  updateCSPWithNonce,
  reportCSPViolation,
  isSuspiciousRequest,
  securityMiddleware,
  corsMiddleware,
} from './lib';
export { securityConfig, validatePassword, generateSecureToken, isOriginAllowed } from './lib';
