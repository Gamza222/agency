/**
 * Security Configuration
 *
 * Comprehensive security settings for enterprise applications.
 * Includes CSP, security headers, authentication, and authorization.
 */

import { Environment } from '../../../../../config/env';
import type { SecurityConfig } from '../../types/security.types';

// ============================================================================
// ENVIRONMENT-SPECIFIC SECURITY CONFIGURATION
// ============================================================================

const getSecurityConfig = (): SecurityConfig => {
  const isProduction = process.env.NODE_ENV === Environment.Production;
  const isDevelopment = process.env.NODE_ENV === Environment.Development;

  // Base CSP policy
  const baseCSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' ws: wss: https:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  // Add development-specific CSP
  if (isDevelopment) {
    baseCSP.push("'unsafe-eval'"); // Required for Next.js dev mode
  }

  // Add production-specific CSP
  if (isProduction) {
    // Remove unsafe-inline and unsafe-eval in production
    const productionCSP = baseCSP.map((directive) => {
      if (directive.includes('unsafe-inline') || directive.includes('unsafe-eval')) {
        return directive.replace(/ 'unsafe-inline'|'unsafe-eval'/g, '');
      }
      return directive;
    });
    baseCSP.splice(0, baseCSP.length, ...productionCSP);
  }

  return {
    headers: {
      'Content-Security-Policy': baseCSP.join('; '),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'X-XSS-Protection': '1; mode=block',
      ...(isProduction && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      }),
    },
    cors: {
      origin: isDevelopment
        ? ['http://localhost:3000', 'http://localhost:3001']
        : process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
      ],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
      maxAge: 86400, // 24 hours
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
      passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
      passwordRequireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL_CHARS === 'true',
      passwordRequireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
      passwordRequireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10), // 1 hour
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
      skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'false',
    },
  };
};

export const securityConfig = getSecurityConfig();

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Validate password strength based on security configuration
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const config = securityConfig.auth;
  const errors: string[] = [];

  if (password.length < config.passwordMinLength) {
    errors.push(`Password must be at least ${config.passwordMinLength} characters long`);
  }

  if (config.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  if (config.passwordRequireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate secure random string for tokens
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    result += chars[(array[i] || 0) % chars.length];
  }

  return result;
};

/**
 * Check if request origin is allowed
 */
export const isOriginAllowed = (origin: string): boolean => {
  const config = securityConfig.cors;
  const allowedOrigins = Array.isArray(config.origin) ? config.origin : [config.origin];
  return allowedOrigins.includes(origin);
};
