/**
 * Environment Configuration - Main Entry Point
 *
 * This is the SINGLE entry point for all environment configuration needs.
 * Follows FSD principles by providing a clean, organized interface.
 *
 * Usage:
 *   import { envConfig, isDevelopment, getEnvVariable } from '@/config/env';
 *   import { Environment, EnvConfig } from '@/config/env';
 */

// ============================================================================
// CORE EXPORTS - Most commonly used
// ============================================================================

// Environment configuration (most used)
export { envConfig, validateEnvironment } from './config';
export {
  isDevelopment,
  isProduction,
  isTest,
  isPreview,
  getCurrentEnvironment,
} from './validation';

// Environment variable access
export const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
};

// ============================================================================
// TYPE EXPORTS - For TypeScript usage
// ============================================================================

export type { CompleteEnvConfig, EnvConfig, EnvValidationResult } from './types';
export { Environment } from './types';

// ============================================================================
// ADVANCED EXPORTS - For advanced usage
// ============================================================================

// Validation functions
export { validateEnvironmentVariables, validateEnvVariable } from './validation';

// Constants (for advanced usage)
export { ENV_DEFAULTS, ENV_OVERRIDES, REQUIRED_ENV_VARS, ENV_VALIDATION_RULES } from './constants';

// ============================================================================
// DEFAULT EXPORT - Main configuration instance
// ============================================================================

export { envConfig as default } from './config';
