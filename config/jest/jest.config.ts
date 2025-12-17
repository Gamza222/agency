// This is the main entry point for Jest's configuration.
// And it combines all the modular configuration files into a single object.

import { baseConfig, coverageConfig, pathsConfig } from './config';

const jestConfig = {
  ...baseConfig,
  ...coverageConfig,
  ...pathsConfig,
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{ts,tsx}'],
};

export default jestConfig;
