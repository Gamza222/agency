/**
 * CI/CD Configuration
 *
 * Centralized configuration for CI/CD pipelines including thresholds,
 * environment settings, and deployment parameters.
 */

export interface CiConfig {
  // Test configuration
  test: {
    coverageThreshold: number;
    timeout: number;
    retries: number;
    parallel: boolean;
  };

  // Performance configuration
  performance: {
    lighthouseThreshold: number;
    bundleSizeThreshold: number;
    loadTestThreshold: number;
  };

  // Security configuration
  security: {
    vulnerabilityThreshold: 'low' | 'moderate' | 'high' | 'critical';
    auditLevel: 'low' | 'moderate' | 'high' | 'critical';
    snykThreshold: 'low' | 'moderate' | 'high' | 'critical';
  };

  // Deployment configuration
  deployment: {
    environments: string[];
    rollbackEnabled: boolean;
    healthCheckTimeout: number;
    maxDeploymentTime: number;
  };

  // Notification configuration
  notifications: {
    slack: {
      enabled: boolean;
      webhookUrl?: string;
    };
    email: {
      enabled: boolean;
      recipients: string[];
    };
    github: {
      enabled: boolean;
      createIssues: boolean;
    };
  };
}

// ============================================================================
// DEFAULT CI CONFIGURATION
// ============================================================================

export const defaultCiConfig: CiConfig = {
  test: {
    coverageThreshold: 50,
    timeout: 30000,
    retries: 2,
    parallel: true,
  },

  performance: {
    lighthouseThreshold: 90,
    bundleSizeThreshold: 1000000, // 1MB
    loadTestThreshold: 2000, // 2 seconds
  },

  security: {
    vulnerabilityThreshold: 'moderate',
    auditLevel: 'moderate',
    snykThreshold: 'high',
  },

  deployment: {
    environments: ['development', 'preview', 'production'],
    rollbackEnabled: true,
    healthCheckTimeout: 300, // 5 minutes
    maxDeploymentTime: 1800, // 30 minutes
  },

  notifications: {
    slack: {
      enabled: false,
    },
    email: {
      enabled: false,
      recipients: [],
    },
    github: {
      enabled: true,
      createIssues: true,
    },
  },
};

// ============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATIONS
// ============================================================================

export const environmentConfigs: Record<string, Partial<CiConfig>> = {
  development: {
    test: {
      coverageThreshold: 50,
      timeout: 60000,
      retries: 3,
      parallel: true,
    },
    performance: {
      lighthouseThreshold: 50,
      bundleSizeThreshold: 2000000, // 2MB
      loadTestThreshold: 2000, // 2 seconds
    },
    security: {
      vulnerabilityThreshold: 'low',
      auditLevel: 'low',
      snykThreshold: 'low',
    },
  },

  preview: {
    test: {
      coverageThreshold: 50,
      timeout: 45000,
      retries: 2,
      parallel: true,
    },
    performance: {
      lighthouseThreshold: 50,
      bundleSizeThreshold: 1500000, // 1.5MB
      loadTestThreshold: 2000, // 2 seconds
    },
    security: {
      vulnerabilityThreshold: 'moderate',
      auditLevel: 'moderate',
      snykThreshold: 'moderate',
    },
  },

  production: {
    test: {
      coverageThreshold: 50,
      timeout: 30000,
      retries: 1,
      parallel: true,
    },
    performance: {
      lighthouseThreshold: 50,
      bundleSizeThreshold: 1000000, // 1MB
      loadTestThreshold: 2000, // 2 seconds
    },
    security: {
      vulnerabilityThreshold: 'high',
      auditLevel: 'high',
      snykThreshold: 'high',
    },
    deployment: {
      environments: ['production'],
      rollbackEnabled: true,
      healthCheckTimeout: 600, // 10 minutes
      maxDeploymentTime: 3600, // 1 hour
    },
  },
};

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

/**
 * Get CI configuration for specific environment
 */
export function getCiConfig(environment: string = 'development'): CiConfig {
  const baseConfig = { ...defaultCiConfig };
  const envConfig = environmentConfigs[environment] || {};

  return {
    ...baseConfig,
    ...envConfig,
    test: { ...baseConfig.test, ...envConfig.test },
    performance: { ...baseConfig.performance, ...envConfig.performance },
    security: { ...baseConfig.security, ...envConfig.security },
    deployment: { ...baseConfig.deployment, ...envConfig.deployment },
    notifications: { ...baseConfig.notifications, ...envConfig.notifications },
  };
}

/**
 * Validate CI configuration
 */
export function validateCiConfig(config: CiConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate test configuration
  if (config.test.coverageThreshold < 0 || config.test.coverageThreshold > 100) {
    errors.push('Coverage threshold must be between 0 and 100');
  }

  if (config.test.timeout <= 0) {
    errors.push('Test timeout must be greater than 0');
  }

  if (config.test.retries < 0) {
    errors.push('Test retries must be non-negative');
  }

  // Validate performance configuration
  if (config.performance.lighthouseThreshold < 0 || config.performance.lighthouseThreshold > 100) {
    errors.push('Lighthouse threshold must be between 0 and 100');
  }

  if (config.performance.bundleSizeThreshold <= 0) {
    errors.push('Bundle size threshold must be greater than 0');
  }

  if (config.performance.loadTestThreshold <= 0) {
    errors.push('Load test threshold must be greater than 0');
  }

  // Validate security configuration
  const validThresholds = ['low', 'moderate', 'high', 'critical'];
  if (!validThresholds.includes(config.security.vulnerabilityThreshold)) {
    errors.push('Invalid vulnerability threshold');
  }

  if (!validThresholds.includes(config.security.auditLevel)) {
    errors.push('Invalid audit level');
  }

  if (!validThresholds.includes(config.security.snykThreshold)) {
    errors.push('Invalid Snyk threshold');
  }

  // Validate deployment configuration
  if (config.deployment.environments.length === 0) {
    errors.push('At least one deployment environment must be specified');
  }

  if (config.deployment.healthCheckTimeout <= 0) {
    errors.push('Health check timeout must be greater than 0');
  }

  if (config.deployment.maxDeploymentTime <= 0) {
    errors.push('Max deployment time must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig(environment: string): CiConfig {
  const config = getCiConfig(environment);
  const validation = validateCiConfig(config);

  if (!validation.isValid) {
    console.warn('CI configuration validation warnings:', validation.errors);
  }

  return config;
}

// ============================================================================
// EXPORT DEFAULT CONFIGURATION
// ============================================================================

export const ciConfig = getEnvironmentConfig(process.env.NODE_ENV || 'development');
export default ciConfig;
