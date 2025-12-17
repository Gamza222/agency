/**
 * Monitoring Data Mock
 *
 * Mock data factory for monitoring-related data structures.
 * Provides consistent test data across all monitoring tests.
 */

import {
  AlertLevel,
  AnalyticsEventType,
  HealthStatus,
  MonitoringAlert,
  MonitoringDashboardData,
  ServiceHealth,
  SystemHealth,
} from '@/infrastructure/monitoring/types/monitoring.types';

// ============================================================================
// BASE DATA GENERATORS
// ============================================================================

/**
 * Create a service health object
 */
export const createServiceHealth = (overrides: Partial<ServiceHealth> = {}): ServiceHealth => {
  return {
    name: 'database',
    status: HealthStatus.HEALTHY,
    responseTime: 5,
    lastCheck: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
};

/**
 * Create a monitoring alert object
 */
export const createMonitoringAlert = (
  overrides: Partial<MonitoringAlert> = {}
): MonitoringAlert => {
  return {
    id: 'alert_123',
    level: AlertLevel.INFO,
    message: 'Test alert message',
    timestamp: new Date('2024-01-01T00:00:00Z'),
    resolved: false,
    ...overrides,
  };
};

// ============================================================================
// SYSTEM HEALTH MOCKS
// ============================================================================

/**
 * Default healthy system health data
 */
export const mockHealthySystemHealth: SystemHealth = {
  status: HealthStatus.HEALTHY,
  timestamp: new Date('2024-01-01T00:00:00Z'),
  uptime: 3600000, // 1 hour
  version: '1.0.0',
  versionDisplay: '1.0.0-dev',
  versionInfo: {
    major: 1,
    minor: 0,
    patch: 0,
    versionCode: 10000,
    commitHash: 'abc123',
    branch: 'main',
  },
  environment: 'development',
  services: [
    createServiceHealth({
      name: 'database',
      status: HealthStatus.HEALTHY,
      responseTime: 5,
    }),
    createServiceHealth({
      name: 'api',
      status: HealthStatus.HEALTHY,
      responseTime: 10,
    }),
    createServiceHealth({
      name: 'cache',
      status: HealthStatus.HEALTHY,
      responseTime: 2,
    }),
    createServiceHealth({
      name: 'storage',
      status: HealthStatus.HEALTHY,
      responseTime: 8,
    }),
  ],
  summary: {
    total: 4,
    healthy: 4,
    degraded: 0,
    unhealthy: 0,
  },
};

/**
 * Unhealthy system health data
 */
export const mockUnhealthySystemHealth: SystemHealth = {
  status: HealthStatus.UNHEALTHY,
  timestamp: new Date('2024-01-01T00:00:00Z'),
  uptime: 3600000,
  version: '1.0.0',
  versionDisplay: '1.0.0-dev',
  versionInfo: {
    major: 1,
    minor: 0,
    patch: 0,
    versionCode: 10000,
    commitHash: 'abc123',
    branch: 'main',
  },
  environment: 'development',
  services: [
    createServiceHealth({
      name: 'database',
      status: HealthStatus.UNHEALTHY,
      responseTime: 5000,
      error: 'Connection timeout',
    }),
    createServiceHealth({
      name: 'api',
      status: HealthStatus.HEALTHY,
      responseTime: 10,
    }),
  ],
  summary: {
    total: 2,
    healthy: 1,
    degraded: 0,
    unhealthy: 1,
  },
};

/**
 * Degraded system health data
 */
export const mockDegradedSystemHealth: SystemHealth = {
  status: HealthStatus.DEGRADED,
  timestamp: new Date('2024-01-01T00:00:00Z'),
  uptime: 3600000,
  version: '1.0.0',
  versionDisplay: '1.0.0-dev',
  versionInfo: {
    major: 1,
    minor: 0,
    patch: 0,
    versionCode: 10000,
    commitHash: 'abc123',
    branch: 'main',
  },
  environment: 'development',
  services: [
    createServiceHealth({
      name: 'database',
      status: HealthStatus.HEALTHY,
      responseTime: 5,
    }),
    createServiceHealth({
      name: 'cache',
      status: HealthStatus.DEGRADED,
      responseTime: 1000,
      error: 'High latency',
    }),
  ],
  summary: {
    total: 2,
    healthy: 1,
    degraded: 1,
    unhealthy: 0,
  },
};

// ============================================================================
// DASHBOARD DATA MOCKS
// ============================================================================

/**
 * Default dashboard data with healthy system
 */
export const mockDashboardData: MonitoringDashboardData = {
  systemHealth: mockHealthySystemHealth,
  recentAlerts: [
    createMonitoringAlert({
      id: 'alert_1',
      level: AlertLevel.INFO,
      message: 'System started successfully',
      timestamp: new Date('2024-01-01T00:00:00Z'),
    }),
  ],
  metrics: [
    {
      name: 'cpu_usage',
      value: 45.5,
      unit: 'percent',
      timestamp: new Date('2024-01-01T00:00:00Z'),
      tags: { server: 'web-01' },
    },
    {
      name: 'memory_usage',
      value: 67.2,
      unit: 'percent',
      timestamp: new Date('2024-01-01T00:00:00Z'),
      tags: { server: 'web-01' },
    },
  ],
  analytics: {
    totalEvents: 100,
    activeSessions: 5,
    topPages: [
      { path: '/', views: 50 },
      { path: '/dashboard', views: 25 },
      { path: '/settings', views: 15 },
    ],
  },
};

/**
 * Dashboard data with alerts
 */
export const mockDashboardDataWithAlerts: MonitoringDashboardData = {
  ...mockDashboardData,
  recentAlerts: [
    createMonitoringAlert({
      id: 'alert_1',
      level: AlertLevel.WARNING,
      message: 'High memory usage detected',
      timestamp: new Date('2024-01-01T00:00:00Z'),
    }),
    createMonitoringAlert({
      id: 'alert_2',
      level: AlertLevel.ERROR,
      message: 'Database connection failed',
      timestamp: new Date('2024-01-01T00:00:00Z'),
    }),
    createMonitoringAlert({
      id: 'alert_3',
      level: AlertLevel.CRITICAL,
      message: 'Service unavailable',
      timestamp: new Date('2024-01-01T00:00:00Z'),
    }),
  ],
};

/**
 * Dashboard data with no alerts
 */
export const mockDashboardDataNoAlerts: MonitoringDashboardData = {
  ...mockDashboardData,
  recentAlerts: [],
};

// ============================================================================
// ANALYTICS DATA MOCKS
// ============================================================================

/**
 * Default analytics session data
 */
export const mockAnalyticsSession = {
  id: 'session_123456',
  startTime: new Date('2024-01-01T00:00:00Z'),
  lastActivity: new Date('2024-01-01T00:30:00Z'),
  pageViews: 10,
  events: 25,
  userId: 'user_123',
};

/**
 * Analytics event data
 */
export const mockAnalyticsEvent = {
  id: 'event_123',
  type: AnalyticsEventType.PAGE_VIEW,
  name: 'page_view',
  timestamp: new Date('2024-01-01T00:00:00Z'),
  userId: 'user_123',
  sessionId: 'session_123456',
  properties: {
    path: '/dashboard',
    referrer: 'https://google.com',
  },
  metadata: {
    userAgent: 'Mozilla/5.0...',
    screenResolution: '1920x1080',
  },
};

// ============================================================================
// ALERT DATA MOCKS
// ============================================================================

/**
 * Various alert types for testing
 */
export const mockAlerts = {
  info: createMonitoringAlert({
    level: AlertLevel.INFO,
    message: 'Information alert',
  }),
  warning: createMonitoringAlert({
    level: AlertLevel.WARNING,
    message: 'Warning alert',
  }),
  error: createMonitoringAlert({
    level: AlertLevel.ERROR,
    message: 'Error alert',
  }),
  critical: createMonitoringAlert({
    level: AlertLevel.CRITICAL,
    message: 'Critical alert',
  }),
};

// ============================================================================
// METRIC DATA MOCKS
// ============================================================================

/**
 * Performance metrics for testing
 */
export const mockMetrics = {
  cpu: {
    name: 'cpu_usage',
    value: 45.5,
    unit: 'percent',
    timestamp: new Date('2024-01-01T00:00:00Z'),
    tags: { server: 'web-01' },
  },
  memory: {
    name: 'memory_usage',
    value: 67.2,
    unit: 'percent',
    timestamp: new Date('2024-01-01T00:00:00Z'),
    tags: { server: 'web-01' },
  },
  responseTime: {
    name: 'api_response_time',
    value: 150,
    unit: 'ms',
    timestamp: new Date('2024-01-01T00:00:00Z'),
    tags: { endpoint: '/api/users' },
  },
};

// ============================================================================
// DATA GENERATORS
// ============================================================================

/**
 * Generate multiple service health objects
 */
export const generateServiceHealthArray = (
  count: number,
  baseStatus: HealthStatus = HealthStatus.HEALTHY
): ServiceHealth[] => {
  return Array.from({ length: count }, (_, index) =>
    createServiceHealth({
      name: `service_${index + 1}`,
      status: baseStatus,
      responseTime: Math.random() * 100,
    })
  );
};

/**
 * Generate multiple alerts
 */
export const generateAlertsArray = (
  count: number,
  level: AlertLevel = AlertLevel.INFO
): MonitoringAlert[] => {
  return Array.from({ length: count }, (_, index) =>
    createMonitoringAlert({
      id: `alert_${index + 1}`,
      level,
      message: `Test alert ${index + 1}`,
    })
  );
};

/**
 * Create custom dashboard data
 */
export const createCustomDashboardData = (
  overrides: Partial<MonitoringDashboardData> = {}
): MonitoringDashboardData => {
  return {
    ...mockDashboardData,
    ...overrides,
  };
};
