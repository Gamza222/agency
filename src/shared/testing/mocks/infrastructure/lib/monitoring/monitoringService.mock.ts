/**
 * Monitoring Service Mock
 *
 * Mock factory for MonitoringService with comprehensive test scenarios.
 * Follows the established mock factory pattern for enterprise testing.
 */

import { MonitoringService } from '@/infrastructure/monitoring';
import { HealthStatus } from '@/infrastructure/monitoring/types/monitoring.types';

// ============================================================================
// MOCK FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a mock MonitoringService instance with customizable methods
 */
export const createMockMonitoringServiceInstance = (
  overrides: Partial<{
    getSystemHealth: jest.Mock;
    getDashboardData: jest.Mock;
    trackEvent: jest.Mock;
    trackPageView: jest.Mock;
    addMetric: jest.Mock;
    addAlert: jest.Mock;
    updateConfig: jest.Mock;
    getAnalyticsSession: jest.Mock;
  }> = {}
): jest.Mocked<MonitoringService> => {
  const defaultMock = {
    getSystemHealth: jest.fn(),
    getDashboardData: jest.fn(),
    trackEvent: jest.fn(),
    trackPageView: jest.fn(),
    addMetric: jest.fn(),
    addAlert: jest.fn(),
    updateConfig: jest.fn(),
    getAnalyticsSession: jest.fn(),
  };

  return {
    ...defaultMock,
    ...overrides,
  } as unknown as jest.Mocked<MonitoringService>;
};

/**
 * Create a mock MonitoringService class with getInstance method
 */
export const createMockMonitoringServiceClass = (instanceMock?: jest.Mocked<MonitoringService>) => {
  const mockInstance = instanceMock || createMockMonitoringServiceInstance();

  return {
    getInstance: jest.fn().mockReturnValue(mockInstance),
  } as unknown as typeof MonitoringService;
};

// ============================================================================
// DEFAULT MOCK INSTANCES
// ============================================================================

/**
 * Default mock MonitoringService instance with healthy system responses
 */
export const defaultMonitoringServiceMock = createMockMonitoringServiceInstance({
  getSystemHealth: jest.fn().mockResolvedValue({
    status: HealthStatus.HEALTHY,
    timestamp: new Date('2024-01-01T00:00:00Z'),
    uptime: 3600000,
    version: '1.0.0',
    services: [
      {
        name: 'database',
        status: HealthStatus.HEALTHY,
        responseTime: 5,
        lastCheck: new Date('2024-01-01T00:00:00Z'),
      },
      {
        name: 'api',
        status: HealthStatus.HEALTHY,
        responseTime: 10,
        lastCheck: new Date('2024-01-01T00:00:00Z'),
      },
    ],
    summary: {
      total: 2,
      healthy: 2,
      degraded: 0,
      unhealthy: 0,
    },
  }),
  getDashboardData: jest.fn().mockResolvedValue({
    systemHealth: {
      status: HealthStatus.HEALTHY,
      timestamp: new Date('2024-01-01T00:00:00Z'),
      uptime: 3600000,
      version: '1.0.0',
      services: [
        {
          name: 'database',
          status: HealthStatus.HEALTHY,
          responseTime: 5,
          lastCheck: new Date('2024-01-01T00:00:00Z'),
        },
        {
          name: 'api',
          status: HealthStatus.HEALTHY,
          responseTime: 10,
          lastCheck: new Date('2024-01-01T00:00:00Z'),
        },
      ],
      summary: {
        total: 2,
        healthy: 2,
        degraded: 0,
        unhealthy: 0,
      },
    },
    recentAlerts: [],
    metrics: [],
    analytics: {
      totalEvents: 100,
      activeSessions: 5,
      topPages: [
        { path: '/', views: 50 },
        { path: '/dashboard', views: 25 },
      ],
    },
  }),
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
  addMetric: jest.fn(),
  addAlert: jest.fn(),
  updateConfig: jest.fn(),
  getAnalyticsSession: jest.fn().mockReturnValue({
    id: 'session_123',
    startTime: new Date('2024-01-01T00:00:00Z'),
    lastActivity: new Date('2024-01-01T00:00:00Z'),
    pageViews: 10,
    events: 25,
  }),
});

/**
 * Mock MonitoringService class with default instance
 */
export const mockMonitoringService = createMockMonitoringServiceClass(defaultMonitoringServiceMock);

// ============================================================================
// SPECIALIZED MOCK SCENARIOS
// ============================================================================

/**
 * Mock for unhealthy system scenario
 */
export const createUnhealthySystemMock = (): jest.Mocked<MonitoringService> => {
  return createMockMonitoringServiceInstance({
    getSystemHealth: jest.fn().mockResolvedValue({
      status: HealthStatus.UNHEALTHY,
      timestamp: new Date('2024-01-01T00:00:00Z'),
      uptime: 3600000,
      version: '1.0.0',
      services: [
        {
          name: 'database',
          status: HealthStatus.UNHEALTHY,
          responseTime: 5000,
          lastCheck: new Date('2024-01-01T00:00:00Z'),
          error: 'Connection timeout',
        },
      ],
      summary: {
        total: 1,
        healthy: 0,
        degraded: 0,
        unhealthy: 1,
      },
    }),
  });
};

/**
 * Mock for degraded system scenario
 */
export const createDegradedSystemMock = (): jest.Mocked<MonitoringService> => {
  return createMockMonitoringServiceInstance({
    getSystemHealth: jest.fn().mockResolvedValue({
      status: HealthStatus.DEGRADED,
      timestamp: new Date('2024-01-01T00:00:00Z'),
      uptime: 3600000,
      version: '1.0.0',
      services: [
        {
          name: 'database',
          status: HealthStatus.HEALTHY,
          responseTime: 5,
          lastCheck: new Date('2024-01-01T00:00:00Z'),
        },
        {
          name: 'cache',
          status: HealthStatus.DEGRADED,
          responseTime: 1000,
          lastCheck: new Date('2024-01-01T00:00:00Z'),
          error: 'High latency',
        },
      ],
      summary: {
        total: 2,
        healthy: 1,
        degraded: 1,
        unhealthy: 0,
      },
    }),
  });
};

/**
 * Mock for service error scenario
 */
export const createServiceErrorMock = (): jest.Mocked<MonitoringService> => {
  return createMockMonitoringServiceInstance({
    getSystemHealth: jest.fn().mockRejectedValue(new Error('Service unavailable')),
    getDashboardData: jest.fn().mockRejectedValue(new Error('Dashboard data unavailable')),
  });
};

// ============================================================================
// MOCK UTILITIES
// ============================================================================

/**
 * Reset all mocks to default state
 */
export const resetMonitoringServiceMocks = (mockInstance: jest.Mocked<MonitoringService>): void => {
  Object.values(mockInstance).forEach((mockFn) => {
    if (jest.isMockFunction(mockFn)) {
      mockFn.mockReset();
    }
  });
};

/**
 * Setup mock for specific test scenario
 */
export const setupMonitoringServiceMock = (
  mockInstance: jest.Mocked<MonitoringService>,
  scenario: 'healthy' | 'unhealthy' | 'degraded' | 'error' = 'healthy'
): void => {
  switch (scenario) {
    case 'healthy':
      mockInstance.getSystemHealth.mockResolvedValue(
        defaultMonitoringServiceMock.getSystemHealth()
      );
      break;
    case 'unhealthy':
      mockInstance.getSystemHealth.mockResolvedValue(createUnhealthySystemMock().getSystemHealth());
      break;
    case 'degraded':
      mockInstance.getSystemHealth.mockResolvedValue(createDegradedSystemMock().getSystemHealth());
      break;
    case 'error':
      mockInstance.getSystemHealth.mockRejectedValue(new Error('Service error'));
      break;
  }
};
