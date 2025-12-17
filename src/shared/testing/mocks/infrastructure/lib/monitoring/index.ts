/**
 * Monitoring Mocks
 *
 * Centralized exports for all monitoring-related mocks.
 * Follows the established mock factory pattern for enterprise testing.
 */

// ============================================================================
// SERVICE MOCKS
// ============================================================================

export {
  // Service mock factory functions
  createMockMonitoringServiceInstance,
  createMockMonitoringServiceClass,

  // Default service mocks
  defaultMonitoringServiceMock,
  mockMonitoringService,

  // Specialized service mocks
  createUnhealthySystemMock,
  createDegradedSystemMock,
  createServiceErrorMock,

  // Mock utilities
  resetMonitoringServiceMocks,
  setupMonitoringServiceMock,
} from './monitoringService.mock';

// ============================================================================
// DATA MOCKS
// ============================================================================

export {
  // Base data generators
  createServiceHealth,
  createMonitoringAlert,

  // System health mocks
  mockHealthySystemHealth,
  mockUnhealthySystemHealth,
  mockDegradedSystemHealth,

  // Dashboard data mocks
  mockDashboardData,
  mockDashboardDataWithAlerts,
  mockDashboardDataNoAlerts,

  // Analytics data mocks
  mockAnalyticsSession,
  mockAnalyticsEvent,

  // Alert data mocks
  mockAlerts,

  // Metric data mocks
  mockMetrics,

  // Data generators
  generateServiceHealthArray,
  generateAlertsArray,
  createCustomDashboardData,
} from './monitoringData.mock';

// ============================================================================
// CONFIGURATION MOCKS
// ============================================================================

export {
  // Configuration factory
  createMonitoringConfig,

  // Default configurations
  mockMonitoringConfig,
  mockHealthCheckConfig,
  mockAnalyticsConfig,
  mockAlertsConfig,
  mockDashboardConfig,

  // Environment-specific configurations
  mockDevelopmentConfig,
  mockProductionConfig,
  mockMinimalConfig,
  mockDisabledConfig,

  // Configuration utilities
  createConfigForScenario,
  mergeConfigs,
} from './monitoringConfig.mock';
