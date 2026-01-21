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
export { envConfig, validateEnvironment } from './config.ts';
export {
  isDevelopment,
  isProduction,
  isTest,
  isPreview,
  getCurrentEnvironment,
} from './validation.ts';

// Environment variable access
import { getEnv } from './env-utils.ts';

export const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = getEnv(key);
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
};

// ============================================================================
// TYPE EXPORTS - For TypeScript usage
// ============================================================================

export type { CompleteEnvConfig, EnvConfig, EnvValidationResult } from './types.ts';
export { Environment } from './types.ts';

// ============================================================================
// ADVANCED EXPORTS - For advanced usage
// ============================================================================

// Validation functions
export { validateEnvironmentVariables, validateEnvVariable } from './validation.ts';

// Constants (for advanced usage)
export { ENV_DEFAULTS, ENV_OVERRIDES, REQUIRED_ENV_VARS, ENV_VALIDATION_RULES } from './constants.ts';

// ============================================================================
// DEFAULT EXPORT - Main configuration instance
// ============================================================================

