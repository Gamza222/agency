import { AppConfig } from './app.types';
import { envConfig } from '../../../../config/env';
import { BuildMode } from '../common';

/**
 * Core application configuration
 * This combines environment configuration with additional app-specific settings
 */
export const appConfig: AppConfig = {
  apiUrl: envConfig.apiUrl,
  wsUrl: envConfig.wsUrl,
  isProd: envConfig.isProduction,
  isDev: envConfig.isDevelopment,
  mode: envConfig.isProduction ? BuildMode.Production : BuildMode.Development,
  port: envConfig.port,
};

/**
 * Create a custom app configuration
 * @param overrides - Configuration overrides
 * @returns Custom app configuration
 */
export const createAppConfig = (overrides: Partial<AppConfig> = {}): AppConfig => {
  return {
    ...appConfig,
    ...overrides,
  };
};

/**
 * Get application build info
 * @returns Build information object
 */
export const getBuildInfo = () => {
  return {
    version: process.env.npm_package_version || '0.0.0',
    buildNumber: process.env.BUILD_NUMBER || '0',
    gitCommit: process.env.GIT_COMMIT || 'dev',
    environment: envConfig.isProduction ? 'production' : envConfig.isTest ? 'test' : 'development',
    buildTime: new Date().toISOString(),
  };
};
