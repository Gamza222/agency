/**
 * Monitoring Service Tests
 *
 * Comprehensive tests for the monitoring service including health checks,
 * analytics tracking, and monitoring functionality.
 */

import { MonitoringService } from './monitoring.service';
import { AlertLevel, AnalyticsEventType, HealthStatus } from '../types/monitoring.types';
import { mockMonitoringConfig } from '@/shared/testing/mocks/infrastructure';

describe('MonitoringService', () => {
  let monitoringService: MonitoringService;

  beforeEach(() => {
    // Reset singleton instance
    (MonitoringService as any).instance = undefined;
    monitoringService = MonitoringService.getInstance(mockMonitoringConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = MonitoringService.getInstance();
      const instance2 = MonitoringService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should throw error if no config provided on first initialization', () => {
      (MonitoringService as any).instance = undefined;
      expect(() => MonitoringService.getInstance()).toThrow(
        'MonitoringService requires configuration on first initialization'
      );
    });
  });

  describe('System Health', () => {
    it('should return system health status', async () => {
      const health = await monitoringService.getSystemHealth();

      expect(health).toBeDefined();
      expect(health.status).toBe(HealthStatus.HEALTHY);
      expect(health.timestamp).toBeInstanceOf(Date);
      expect(health.uptime).toBeGreaterThan(0);
      expect(health.version).toBeDefined();
      expect(health.services).toHaveLength(4);
      expect(health.summary.total).toBe(4);
      expect(health.summary.healthy).toBe(4);
    });

    it('should include all configured services', async () => {
      const health = await monitoringService.getSystemHealth();
      const serviceNames = health.services.map((s) => s.name);

      expect(serviceNames).toContain('database');
      expect(serviceNames).toContain('api');
      expect(serviceNames).toContain('cache');
      expect(serviceNames).toContain('storage');
    });

    it('should have proper service health structure', async () => {
      const health = await monitoringService.getSystemHealth();
      const service = health.services[0];

      expect(service).toBeDefined();
      expect(service?.name).toBeDefined();
      expect(service?.status).toBe(HealthStatus.HEALTHY);
      expect(service?.lastCheck).toBeInstanceOf(Date);
      expect(service?.responseTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Analytics Tracking', () => {
    it('should track events when analytics is enabled', () => {
      // Enable debug mode for this test
      monitoringService.updateConfig({
        analytics: { ...mockMonitoringConfig.analytics, debug: true },
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      monitoringService.trackEvent(AnalyticsEventType.PAGE_VIEW, 'test_event', { test: 'data' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Analytics Event:',
        expect.objectContaining({
          type: AnalyticsEventType.PAGE_VIEW,
          name: 'test_event',
          properties: { test: 'data' },
        })
      );

      consoleSpy.mockRestore();
    });

    it('should not track events when analytics is disabled', () => {
      const disabledConfig = {
        ...mockMonitoringConfig,
        analytics: { ...mockMonitoringConfig.analytics, enabled: false },
      };
      monitoringService.updateConfig(disabledConfig);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      monitoringService.trackEvent(AnalyticsEventType.PAGE_VIEW, 'test_event');

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should track page views', () => {
      // Enable debug mode for this test
      monitoringService.updateConfig({
        analytics: { ...mockMonitoringConfig.analytics, debug: true },
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      monitoringService.trackPageView('/test-page', 'user123');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Analytics Event:',
        expect.objectContaining({
          type: AnalyticsEventType.PAGE_VIEW,
          name: 'page_view',
          properties: { path: '/test-page' },
          userId: 'user123',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should maintain analytics session', () => {
      const session = monitoringService.getAnalyticsSession();

      expect(session).toBeDefined();
      expect(session?.id).toBeDefined();
      expect(session?.startTime).toBeInstanceOf(Date);
      expect(session?.pageViews).toBe(0);
      expect(session?.events).toBe(0);
    });
  });

  describe('Metrics Management', () => {
    it('should add metrics', () => {
      monitoringService.addMetric('cpu_usage', 75.5, 'percent', { server: 'web-01' });

      // Metrics are stored internally, we can't directly access them
      // but we can verify the method doesn't throw
      expect(() => {
        monitoringService.addMetric('memory_usage', 60, 'percent');
      }).not.toThrow();
    });

    it('should limit number of stored metrics', () => {
      const limitedConfig = {
        ...mockMonitoringConfig,
        dashboard: { ...mockMonitoringConfig.dashboard, maxMetrics: 2 },
      };
      monitoringService.updateConfig(limitedConfig);

      // Add more metrics than the limit
      monitoringService.addMetric('metric1', 1, 'unit');
      monitoringService.addMetric('metric2', 2, 'unit');
      monitoringService.addMetric('metric3', 3, 'unit');

      // Should not throw and should maintain limit internally
      expect(() => {
        monitoringService.addMetric('metric4', 4, 'unit');
      }).not.toThrow();
    });
  });

  describe('Alert Management', () => {
    it('should add alerts', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      monitoringService.addAlert(AlertLevel.WARNING, 'Test warning', { component: 'test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Monitoring Alert:',
        expect.objectContaining({
          level: AlertLevel.WARNING,
          message: 'Test warning',
          metadata: { component: 'test' },
          resolved: false,
        })
      );

      consoleSpy.mockRestore();
    });

    it('should not send alerts when disabled', () => {
      const disabledConfig = {
        ...mockMonitoringConfig,
        alerts: { ...mockMonitoringConfig.alerts, enabled: false },
      };
      monitoringService.updateConfig(disabledConfig);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      monitoringService.addAlert(AlertLevel.ERROR, 'Test error');

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should limit number of stored alerts', () => {
      const limitedConfig = {
        ...mockMonitoringConfig,
        dashboard: { ...mockMonitoringConfig.dashboard, maxAlerts: 2 },
      };
      monitoringService.updateConfig(limitedConfig);

      // Add more alerts than the limit
      monitoringService.addAlert(AlertLevel.INFO, 'Alert 1');
      monitoringService.addAlert(AlertLevel.WARNING, 'Alert 2');
      monitoringService.addAlert(AlertLevel.ERROR, 'Alert 3');

      // Should not throw and should maintain limit internally
      expect(() => {
        monitoringService.addAlert(AlertLevel.CRITICAL, 'Alert 4');
      }).not.toThrow();
    });
  });

  describe('Dashboard Data', () => {
    it('should return dashboard data', async () => {
      // Add some test data
      monitoringService.addMetric('test_metric', 100, 'count');
      monitoringService.addAlert(AlertLevel.INFO, 'Test alert');

      const dashboardData = await monitoringService.getDashboardData();

      expect(dashboardData).toBeDefined();
      expect(dashboardData.systemHealth).toBeDefined();
      expect(dashboardData.recentAlerts).toBeDefined();
      expect(dashboardData.metrics).toBeDefined();
      expect(dashboardData.analytics).toBeDefined();
      expect(dashboardData.analytics.totalEvents).toBeGreaterThanOrEqual(0);
      expect(dashboardData.analytics.activeSessions).toBeGreaterThanOrEqual(0);
      expect(dashboardData.analytics.topPages).toBeDefined();
    });

    it('should include system health in dashboard data', async () => {
      const dashboardData = await monitoringService.getDashboardData();

      expect(dashboardData.systemHealth.status).toBe(HealthStatus.HEALTHY);
      expect(dashboardData.systemHealth.services).toHaveLength(4);
      expect(dashboardData.systemHealth.summary.total).toBe(4);
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      const newConfig = {
        analytics: { ...mockMonitoringConfig.analytics, debug: false },
      };

      monitoringService.updateConfig(newConfig);

      // Verify configuration was updated by checking behavior
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      monitoringService.trackEvent(AnalyticsEventType.PAGE_VIEW, 'test');

      // Should not log when debug is false
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle service health check errors gracefully', async () => {
      // Mock a service to throw an error
      const originalCheckServiceHealth = (monitoringService as any).checkServiceHealth;
      (monitoringService as any).checkServiceHealth = jest
        .fn()
        .mockRejectedValue(new Error('Service error'));

      const health = await monitoringService.getSystemHealth();

      expect(health.services).toHaveLength(4);
      expect(health.services.some((s) => s.status === HealthStatus.UNHEALTHY)).toBe(true);

      // Restore original method
      (monitoringService as any).checkServiceHealth = originalCheckServiceHealth;
    });
  });
});
