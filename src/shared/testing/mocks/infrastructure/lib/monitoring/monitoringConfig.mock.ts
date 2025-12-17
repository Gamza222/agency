/**
 * Monitoring Configuration Mock
 *
 * Mock configuration factory for monitoring-related configurations.
 * Provides consistent test configurations across all monitoring tests.
 */

import { MonitoringConfig } from '@/infrastructure/monitoring/types/monitoring.types';

// ============================================================================
// BASE CONFIGURATION GENERATORS
// ============================================================================

/**
 * Create a monitoring configuration with customizable options
 */
export const createMonitoringConfig = (
  overrides: Partial<MonitoringConfig> = {}
): MonitoringConfig => {
  return {
    healthCheck: {
      enabled: true,
      interval: 30000,
      timeout: 5000,
      services: ['database', 'api', 'cache', 'storage'],
    },
    analytics: {
      enabled: true,
      respectDoNotTrack: true,
      anonymizeIp: true,
      sampleRate: 1.0,
      debug: false,
    },
    alerts: {
      enabled: true,
    },
    dashboard: {
      refreshInterval: 10000,
      maxAlerts: 100,
      maxMetrics: 1000,
    },
    ...overrides,
  };
};

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

/**
 * Default monitoring configuration for testing
 */
export const mockMonitoringConfig: MonitoringConfig = createMonitoringConfig();

/**
 * Health check specific configuration
 */
export const mockHealthCheckConfig: MonitoringConfig = createMonitoringConfig({
  healthCheck: {
    enabled: true,
    interval: 15000,
    timeout: 3000,
    services: ['database', 'api'],
  },
  analytics: {
    enabled: false,
    respectDoNotTrack: true,
    anonymizeIp: true,
    sampleRate: 1.0,
    debug: false,
  },
  alerts: {
    enabled: false,
  },
});

/**
 * Analytics specific configuration
 */
export const mockAnalyticsConfig: MonitoringConfig = createMonitoringConfig({
  analytics: {
    enabled: true,
    respectDoNotTrack: true,
    anonymizeIp: true,
    sampleRate: 0.5,
    debug: true,
  },
  healthCheck: {
    enabled: false,
    interval: 30000,
    timeout: 5000,
    services: [],
  },
  alerts: {
    enabled: false,
  },
});

/**
 * Alerts specific configuration
 */
export const mockAlertsConfig: MonitoringConfig = createMonitoringConfig({
  alerts: {
    enabled: true,
    webhook: 'https://hooks.slack.com/services/test',
    email: 'alerts@company.com',
  },
  healthCheck: {
    enabled: true,
    interval: 10000,
    timeout: 2000,
    services: ['database', 'api', 'cache'],
  },
});

/**
 * Dashboard specific configuration
 */
export const mockDashboardConfig: MonitoringConfig = createMonitoringConfig({
  dashboard: {
    refreshInterval: 5000,
    maxAlerts: 50,
    maxMetrics: 500,
  },
});

// ============================================================================
// SPECIALIZED CONFIGURATIONS
// ============================================================================

/**
 * Development environment configuration
 */
export const mockDevelopmentConfig: MonitoringConfig = createMonitoringConfig({
  analytics: {
    enabled: true,
    respectDoNotTrack: false,
    anonymizeIp: false,
    sampleRate: 1.0,
    debug: true,
  },
  healthCheck: {
    enabled: true,
    interval: 10000,
    timeout: 2000,
    services: ['database', 'api', 'cache', 'storage'],
  },
  alerts: {
    enabled: true,
    webhook: 'https://dev-hooks.slack.com/services/test',
  },
});

/**
 * Production environment configuration
 */
export const mockProductionConfig: MonitoringConfig = createMonitoringConfig({
  analytics: {
    enabled: true,
    respectDoNotTrack: true,
    anonymizeIp: true,
    sampleRate: 0.1,
    debug: false,
  },
  healthCheck: {
    enabled: true,
    interval: 60000,
    timeout: 10000,
    services: ['database', 'api', 'cache', 'storage'],
  },
  alerts: {
    enabled: true,
    webhook: 'https://prod-hooks.slack.com/services/prod',
    email: 'prod-alerts@company.com',
  },
});

/**
 * Minimal configuration for basic testing
 */
export const mockMinimalConfig: MonitoringConfig = createMonitoringConfig({
  healthCheck: {
    enabled: true,
    interval: 30000,
    timeout: 5000,
    services: ['database'],
  },
  analytics: {
    enabled: false,
    respectDoNotTrack: true,
    anonymizeIp: true,
    sampleRate: 1.0,
    debug: false,
  },
  alerts: {
    enabled: false,
  },
  dashboard: {
    refreshInterval: 10000,
    maxAlerts: 10,
    maxMetrics: 100,
  },
});

/**
 * Disabled configuration
 */
export const mockDisabledConfig: MonitoringConfig = createMonitoringConfig({
  healthCheck: {
    enabled: false,
    interval: 30000,
    timeout: 5000,
    services: [],
  },
  analytics: {
    enabled: false,
    respectDoNotTrack: true,
    anonymizeIp: true,
    sampleRate: 1.0,
    debug: false,
  },
  alerts: {
    enabled: false,
  },
});

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

/**
 * Create configuration for specific test scenario
 */
export const createConfigForScenario = (
  scenario: 'healthy' | 'unhealthy' | 'degraded' | 'minimal' | 'disabled'
): MonitoringConfig => {
  switch (scenario) {
    case 'healthy':
      return mockMonitoringConfig;
    case 'unhealthy':
      return createMonitoringConfig({
        healthCheck: {
          enabled: true,
          interval: 5000,
          timeout: 1000,
          services: ['database', 'api', 'cache', 'storage'],
        },
        alerts: {
          enabled: true,
          webhook: 'https://alerts.company.com/webhook',
        },
      });
    case 'degraded':
      return createMonitoringConfig({
        healthCheck: {
          enabled: true,
          interval: 10000,
          timeout: 3000,
          services: ['database', 'api'],
        },
      });
    case 'minimal':
      return mockMinimalConfig;
    case 'disabled':
      return mockDisabledConfig;
    default:
      return mockMonitoringConfig;
  }
};

/**
 * Merge configurations for complex test scenarios
 */
export const mergeConfigs = (...configs: Partial<MonitoringConfig>[]): MonitoringConfig => {
  let result = { ...mockMonitoringConfig };

  for (const config of configs) {
    result = {
      ...result,
      ...config,
      healthCheck: { ...result.healthCheck, ...config.healthCheck },
      analytics: { ...result.analytics, ...config.analytics },
      alerts: { ...result.alerts, ...config.alerts },
      dashboard: { ...result.dashboard, ...config.dashboard },
    };
  }

  return result;
};
