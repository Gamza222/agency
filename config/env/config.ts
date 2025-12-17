/**
 * Environment Configuration
 *
 * Main environment configuration class.
 * Clean, focused configuration with better organization.
 */

import { EnvConfig, Environment } from './types';
import { ENV_DEFAULTS } from './constants';
import {
  getCurrentEnvironment,
  isDevelopment,
  isPreview,
  isProduction,
  isTest,
} from './validation';

export class EnvironmentConfig implements EnvConfig {
  // Environment detection
  public readonly isDevelopment: boolean;
  public readonly isProduction: boolean;
  public readonly isTest: boolean;
  public readonly isPreview: boolean;

  // Core configuration
  public readonly port: number;
  public readonly appName: string;
  public readonly appVersion: string;
  public readonly appEnv: Environment;

  // API configuration
  public readonly apiUrl: string;
  public readonly wsUrl: string;
  public readonly graphqlUrl: string;

  // Security configuration
  public readonly jwtSecret: string;
  public readonly jwtExpiresIn: string;
  public readonly rateLimitWindowMs: number;
  public readonly rateLimitMaxRequests: number;

  // Monitoring configuration
  public readonly sentryDsn: string;
  public readonly analyticsId: string;

  // Debug configuration
  public readonly debugEnabled: boolean;

  constructor() {
    const currentEnv = getCurrentEnvironment();

    // Environment detection
    this.isDevelopment = isDevelopment();
    this.isProduction = isProduction();
    this.isTest = isTest();
    this.isPreview = isPreview();

    // Core configuration
    this.port = this.getNumber('PORT', Number(ENV_DEFAULTS.PORT) || 3000);
    this.appName = this.getString(
      'NEXT_PUBLIC_APP_NAME',
      ENV_DEFAULTS.NEXT_PUBLIC_APP_NAME || 'Abstract Team'
    );
    this.appVersion = this.getString(
      'NEXT_PUBLIC_APP_VERSION',
      ENV_DEFAULTS.NEXT_PUBLIC_APP_VERSION || '2.0.0'
    );
    this.appEnv = currentEnv;

    // API configuration
    this.apiUrl = this.getString(
      'NEXT_PUBLIC_API_URL',
      ENV_DEFAULTS.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    );
    this.wsUrl = this.getString(
      'NEXT_PUBLIC_WS_URL',
      ENV_DEFAULTS.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws'
    );
    this.graphqlUrl = this.getString(
      'NEXT_PUBLIC_GRAPHQL_URL',
      ENV_DEFAULTS.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql'
    );

    // Security configuration
    this.jwtSecret = this.getString(
      'JWT_SECRET',
      ENV_DEFAULTS.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    );
    this.jwtExpiresIn = this.getString('JWT_EXPIRES_IN', ENV_DEFAULTS.JWT_EXPIRES_IN || '1h');
    this.rateLimitWindowMs = this.getNumber(
      'RATE_LIMIT_WINDOW_MS',
      parseInt(ENV_DEFAULTS.RATE_LIMIT_WINDOW_MS || '900000')
    );
    this.rateLimitMaxRequests = this.getNumber(
      'RATE_LIMIT_MAX_REQUESTS',
      parseInt(ENV_DEFAULTS.RATE_LIMIT_MAX_REQUESTS || '100')
    );

    // Monitoring configuration
    this.sentryDsn = this.getString('SENTRY_DSN', ENV_DEFAULTS.SENTRY_DSN || '');
    this.analyticsId = this.getString(
      'NEXT_PUBLIC_ANALYTICS_ID',
      ENV_DEFAULTS.NEXT_PUBLIC_ANALYTICS_ID || ''
    );

    // Debug configuration
    this.debugEnabled = this.getBoolean(
      'NEXT_PUBLIC_DEBUG',
      ENV_DEFAULTS.NEXT_PUBLIC_DEBUG === 'true'
    );
  }

  private getString(key: string, defaultValue: string): string {
    const value = process.env[key];
    return value !== undefined ? value : defaultValue;
  }

  private getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  private getBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  public validate(): void {
    // Validate JWT secret in production
    if (this.isProduction) {
      if (
        !this.jwtSecret ||
        this.jwtSecret ===
          (ENV_DEFAULTS.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production')
      ) {
        throw new Error('JWT_SECRET must be changed from default value in production');
      }
    }
  }
}

export const envConfig = new EnvironmentConfig();
export const validateEnvironment = () => envConfig.validate();
