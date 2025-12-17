/**
 * Environment Configuration Types
 *
 * Type definitions for environment configuration system.
 * Clean, focused types without any bloat.
 */

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Preview = 'preview',
}

// Core environment variables (only the essential ones)
export interface EnvConfig {
  // Environment detection
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
  readonly isPreview: boolean;

  // Core configuration
  readonly port: number;
  readonly appName: string;
  readonly appVersion: string;
  readonly appEnv: Environment;

  // API configuration
  readonly apiUrl: string;
  readonly wsUrl: string;
  readonly graphqlUrl: string;

  // Security configuration
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly rateLimitWindowMs: number;
  readonly rateLimitMaxRequests: number;

  // Monitoring configuration
  readonly sentryDsn: string;
  readonly analyticsId: string;

  // Debug configuration
  readonly debugEnabled: boolean;
}

// Environment variable names (as they appear in process.env)
export interface EnvVariableNames {
  // Core Application
  NODE_ENV: string;
  PORT: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
  NEXT_PUBLIC_APP_ENV: string;

  // API Configuration
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_WS_URL: string;
  NEXT_PUBLIC_GRAPHQL_URL: string;

  // Security
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RATE_LIMIT_WINDOW_MS: string;
  RATE_LIMIT_MAX_REQUESTS: string;

  // Monitoring
  SENTRY_DSN: string;
  NEXT_PUBLIC_ANALYTICS_ID: string;

  // Debug
  NEXT_PUBLIC_DEBUG: string;
  NEXT_PUBLIC_DEBUG_TOOLS: string;
  NEXT_PUBLIC_ANALYTICS: string;

  // Deployment
  VERCEL_TOKEN: string;
  VERCEL_ORG_ID: string;
  VERCEL_PROJECT_ID: string;
  DEPLOYMENT_URL: string;
}

// Complete environment configuration (all variables)
export interface CompleteEnvConfig extends EnvConfig {
  // Add all other environment variables here
}

// Environment validation result
export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
