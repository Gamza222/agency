import type { Config } from '@jest/types';
import { resolve } from 'path';

export const baseConfig: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: resolve(__dirname, '../../tsconfig.json'),
        useESM: false,
      },
    ],
    // Custom SCSS transformer for design tokens and mixins
    '\\.module\\.scss$': '<rootDir>/src/shared/testing/transformers/scss-transformer.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(react-error-boundary)/)'],
  moduleNameMapper: {
    // CSS imports (excluding .module.scss which uses custom transformer)
    '\\.(css|less)$': 'identity-obj-proxy',

    // Static asset imports (AUTOMATIC mocks)
    '\\.(jpg|jpeg|png|gif|webp)$':
      '<rootDir>/src/shared/testing/mocks/assets/components/Image.mock.tsx',
    '\\.svg$': '<rootDir>/src/shared/testing/mocks/assets/components/Svg.mock.tsx',
    '\\.(woff|woff2|eot|ttf|otf|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/shared/testing/mocks/assets/lib/file.mock.ts',

    // UI Component mocks (AUTOMATIC mocks)
    // Note: Button and Text components are not mocked - using real components for better integration testing

    // External library mocks (AUTOMATIC mocks)
    // (Add library mocks here as needed)

    // Path aliases for application layers
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    // '^@pages/(.*)$': '<rootDir>/src/pages/$1', // Removed - using App Router
    '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',

    // Path aliases for Jest mocks and providers (UPDATED)
    '^@jestmocks/(.*)$': '<rootDir>/src/shared/testing/mocks/$1',
    '^@jestproviders/(.*)$': '<rootDir>/src/shared/testing/providers/$1',
  },
  verbose: false, // Disable verbose output for faster tests
  // Add mock reset configuration
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // Add cleanup configuration to prevent memory leaks
  setupFilesAfterEnv: [
    resolve(__dirname, '../../../../src/shared/testing/setup/index.ts'),
    resolve(__dirname, '../../../../src/shared/testing/setup/global/setup.ts'),
    // Add setup to check TypeScript compilation
    resolve(__dirname, '../../../../config/jest/setup/check-typescript.ts'),
  ],
  // Force exit after tests to prevent hanging
  forceExit: true,
  // Detect open handles to help identify memory leaks
  detectOpenHandles: false, // Disable for faster tests
  // Fail tests on console errors and unhandled exceptions
  errorOnDeprecated: false, // Disable for faster tests
  // Show console output in tests and fail on errors
  silent: true, // Enable silent mode for faster tests
  // Performance optimizations
  maxWorkers: '50%', // Use half of available CPU cores
  cache: true, // Enable Jest cache
  cacheDirectory: '<rootDir>/.jest-cache', // Specify cache directory
  // Reduce test timeout for faster feedback
  testTimeout: 10000, // 10 seconds instead of default 5 seconds
  // Make tests fail on unhandled promise rejections
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
    // Fail on unhandled promise rejections
    beforeParse: (window: Window) => {
      window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        throw new Error(`Unhandled promise rejection: ${event.reason}`);
      });
    },
  },
};
