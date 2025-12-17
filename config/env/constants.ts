/**
 * Environment Constants
 *
 * Default values and environment-specific overrides for all environment variables.
 * Clean, organized constants with better structure.
 */

import { Environment, EnvVariableNames } from './types';

// Core defaults (only essential variables)
export const CORE_DEFAULTS = {
  NODE_ENV: Environment.Development,
  PORT: 3000,
  NEXT_PUBLIC_APP_NAME: 'Abstract Team',
  NEXT_PUBLIC_APP_VERSION: '2.0.0',
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  NEXT_PUBLIC_WS_URL: 'ws://localhost:3000/ws',
  NEXT_PUBLIC_GRAPHQL_URL: 'http://localhost:3000/graphql',
  JWT_SECRET: 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: '1h',
  SENTRY_DSN: '',
  NEXT_PUBLIC_ANALYTICS_ID: 'dev-analytics-id',
  NEXT_PUBLIC_DEBUG: false,
} as const;

// Extended defaults (all environment variables)
export const ENV_DEFAULTS: Partial<EnvVariableNames> = {
  // Core Application
  NODE_ENV: Environment.Development,
  PORT: '3000',
  NEXT_PUBLIC_APP_NAME: 'Abstract Team',
  NEXT_PUBLIC_APP_VERSION: '2.0.0',
  NEXT_PUBLIC_APP_ENV: Environment.Development,

  // API Configuration
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  NEXT_PUBLIC_WS_URL: 'ws://localhost:3000/ws',
  NEXT_PUBLIC_GRAPHQL_URL: 'http://localhost:3000/graphql',

  // Security
  JWT_SECRET: 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: '1h',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100',

  // Monitoring
  SENTRY_DSN: '',
  NEXT_PUBLIC_ANALYTICS_ID: 'dev-analytics-id',

  // Debug
  NEXT_PUBLIC_DEBUG: 'false',
  NEXT_PUBLIC_DEBUG_TOOLS: 'false',
  NEXT_PUBLIC_ANALYTICS: 'false',

  // Deployment
  VERCEL_TOKEN: '',
  VERCEL_ORG_ID: '',
  VERCEL_PROJECT_ID: '',
  DEPLOYMENT_URL: '',
};

// Environment-specific overrides
export const ENV_OVERRIDES: Record<Environment, Partial<EnvVariableNames>> = {
  [Environment.Development]: {
    NEXT_PUBLIC_DEBUG: 'true',
    NEXT_PUBLIC_ANALYTICS: 'false',
    NEXT_PUBLIC_DEBUG_TOOLS: 'true',
  },
  [Environment.Production]: {
    NEXT_PUBLIC_DEBUG: 'false',
    NEXT_PUBLIC_ANALYTICS: 'true',
    NEXT_PUBLIC_DEBUG_TOOLS: 'false',
  },
  [Environment.Test]: {
    NEXT_PUBLIC_DEBUG: 'false',
    NEXT_PUBLIC_ANALYTICS: 'false',
    NEXT_PUBLIC_DEBUG_TOOLS: 'false',
  },
  [Environment.Preview]: {
    NEXT_PUBLIC_DEBUG: 'true',
    NEXT_PUBLIC_ANALYTICS: 'false',
    NEXT_PUBLIC_DEBUG_TOOLS: 'true',
  },
} as const;

// Required environment variables
export const REQUIRED_ENV_VARS: (keyof EnvVariableNames)[] = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_API_URL',
  'JWT_SECRET',
];

// Validation rules
export const ENV_VALIDATION_RULES = {
  NODE_ENV: { type: 'enum', values: Object.values(Environment), required: true },
  PORT: { type: 'number', min: 1, max: 65535, required: true },
  NEXT_PUBLIC_API_URL: { type: 'url', required: true },
  JWT_SECRET: { type: 'string', minLength: 32, required: true },
  NEXT_PUBLIC_APP_NAME: { type: 'string', minLength: 1, required: true },
} as const;
