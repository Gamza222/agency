/**
 * Environment Configuration Tests
 *
 * Tests for environment configuration system.
 */

import { envConfig, getEnvVariable, isDevelopment, isPreview, isProduction, isTest } from './index';
// import { Environment } from './types'; // Unused

// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Environment Configuration', () => {
  describe('Environment Detection', () => {
    it('should detect development environment', () => {
      (process.env as any).NODE_ENV = 'development';
      expect(isDevelopment()).toBe(true);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(false);
      expect(isPreview()).toBe(false);
    });

    it('should detect production environment', () => {
      (process.env as any).NODE_ENV = 'production';
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(true);
      expect(isTest()).toBe(false);
      expect(isPreview()).toBe(false);
    });

    it('should detect test environment', () => {
      (process.env as any).NODE_ENV = 'test';
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(true);
      expect(isPreview()).toBe(false);
    });

    it('should detect preview environment', () => {
      (process.env as any).NODE_ENV = 'preview';
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(false);
      expect(isPreview()).toBe(true);
    });
  });

  describe('Environment Configuration', () => {
    it('should use default values when env vars are not set', () => {
      (process.env as any).NODE_ENV = 'development';
      const config = envConfig;

      expect(config.appName).toBe('Abstract Team');
      expect(config.appVersion).toBe('2.0.0');
      expect(config.port).toBe(3000);
      expect(config.apiUrl).toBe('http://localhost:3000/api');
      expect(config.wsUrl).toBe('ws://localhost:3001');
      expect(config.graphqlUrl).toBe('/graphql');
    });

    it('should use environment variables when set', () => {
      (process.env as any).NODE_ENV = 'development';
      process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
      process.env.NEXT_PUBLIC_APP_VERSION = '1.0.0';
      process.env.PORT = '4000';
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000/api';

      const config = envConfig;

      expect(config.appName).toBe('Test App');
      expect(config.appVersion).toBe('1.0.0');
      expect(config.port).toBe(4000);
      expect(config.apiUrl).toBe('http://localhost:4000/api');
    });

    it('should handle boolean environment variables correctly', () => {
      (process.env as any).NODE_ENV = 'development';
      process.env.NEXT_PUBLIC_DEBUG = 'true';

      const config = envConfig;
      expect(config.debugEnabled).toBe(true);
    });

    it('should handle numeric environment variables correctly', () => {
      (process.env as any).NODE_ENV = 'development';
      process.env.PORT = '8080';

      const config = envConfig;
      expect(config.port).toBe(8080);
    });
  });

  describe('Environment Variable Access', () => {
    it('should get environment variable with default', () => {
      process.env.TEST_VAR = 'test-value';

      expect(getEnvVariable('TEST_VAR', 'default')).toBe('test-value');
    });

    it('should return default when env var is not set', () => {
      expect(getEnvVariable('NON_EXISTENT_VAR', 'default')).toBe('default');
    });

    it('should throw error when required env var is not set', () => {
      expect(() => getEnvVariable('REQUIRED_VAR')).toThrow(
        'Environment variable REQUIRED_VAR is required but not set'
      );
    });
  });

  describe('Validation', () => {
    it('should validate successfully in development', () => {
      (process.env as any).NODE_ENV = 'development';
      expect(() => envConfig.validate()).not.toThrow();
    });

    it('should warn about default JWT secret in production', () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

      expect(() => envConfig.validate()).toThrow(
        'JWT_SECRET must be changed from default value in production'
      );
    });

    it('should not warn about custom JWT secret in production', () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.JWT_SECRET = 'custom-production-secret-key';

      expect(() => envConfig.validate()).not.toThrow();
    });
  });
});
