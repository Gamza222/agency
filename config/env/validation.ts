/**
 * Environment Validation
 *
 * Validation functions for environment variables and configuration.
 * Clean, focused validation logic.
 */

import { Environment, EnvValidationResult, EnvVariableNames } from './types';
import { ENV_DEFAULTS, ENV_VALIDATION_RULES, REQUIRED_ENV_VARS } from './constants';

/**
 * Get current environment from NODE_ENV
 */
export function getCurrentEnvironment(): Environment {
  const nodeEnv = process.env.NODE_ENV as Environment;
  return Object.values(Environment).includes(nodeEnv) ? nodeEnv : Environment.Development;
}

/**
 * Check if running in development environment
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === Environment.Development;
}

/**
 * Check if running in production environment
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === Environment.Production;
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return getCurrentEnvironment() === Environment.Test;
}

/**
 * Check if running in preview environment
 */
export function isPreview(): boolean {
  return getCurrentEnvironment() === Environment.Preview;
}

/**
 * Validate a single environment variable
 */
export function validateEnvVariable(
  key: keyof EnvVariableNames,
  value: string
): { isValid: boolean; error?: string } {
  const rule = ENV_VALIDATION_RULES[key as keyof typeof ENV_VALIDATION_RULES];

  if (!rule) {
    return { isValid: true }; // No validation rule, assume valid
  }

  if (rule.required && (!value || value.trim() === '')) {
    return { isValid: false, error: `${key} is required but not set` };
  }

  if (rule.type === 'enum' && rule.values && !rule.values.includes(value as Environment)) {
    return { isValid: false, error: `${key} must be one of: ${rule.values.join(', ')}` };
  }

  if (rule.type === 'number') {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      return { isValid: false, error: `${key} must be a valid number` };
    }
    if (rule.min !== undefined && num < rule.min) {
      return { isValid: false, error: `${key} must be at least ${rule.min}` };
    }
    if (rule.max !== undefined && num > rule.max) {
      return { isValid: false, error: `${key} must be at most ${rule.max}` };
    }
  }

  if (rule.type === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      return { isValid: false, error: `${key} must be at least ${rule.minLength} characters` };
    }
  }

  if (rule.type === 'url') {
    try {
      new URL(value);
    } catch {
      return { isValid: false, error: `${key} must be a valid URL` };
    }
  }

  return { isValid: true };
}

/**
 * Validate all environment variables
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of REQUIRED_ENV_VARS) {
    const value = process.env[key];
    const validation = validateEnvVariable(key, value || '');

    if (!validation.isValid) {
      errors.push(validation.error!);
    }
  }

  // Check all environment variables
  for (const [key, value] of Object.entries(process.env)) {
    if (key in ENV_DEFAULTS) {
      const validation = validateEnvVariable(key as keyof EnvVariableNames, value || '');

      if (!validation.isValid) {
        errors.push(validation.error!);
      }
    }
  }

  // Check for production-specific warnings
  if (isProduction()) {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret === ENV_DEFAULTS.JWT_SECRET) {
      warnings.push('JWT_SECRET is using default value in production');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
