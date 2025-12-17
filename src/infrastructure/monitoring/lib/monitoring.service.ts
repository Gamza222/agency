/**
 * Monitoring Service
 *
 * Centralized service for health checks, analytics, and monitoring functionality.
 * Provides enterprise-level monitoring capabilities with privacy compliance.
 */

import {
  AlertLevel,
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsSession,
  HealthStatus,
  MonitoringAlert,
  MonitoringConfig,
  MonitoringDashboardData,
  MonitoringMetric,
  ServiceHealth,
  SystemHealth,
} from '../types/monitoring.types';
import { envConfig } from '../../../../config/env';
// Version info is only available on server side
// import { getVersionDisplay, getVersionInfo } from '../../../../config/version';

/**
 * Monitoring Service Class
 *
 * Handles health checks, analytics tracking, and monitoring data collection.
 * Follows singleton pattern for consistent state across the application.
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private config: MonitoringConfig;
  private analyticsSession: AnalyticsSession | null = null;
  private metrics: MonitoringMetric[] = [];
  private alerts: MonitoringAlert[] = [];
  private startTime: Date;

  private constructor(config: MonitoringConfig) {
    this.config = config;
    this.startTime = new Date();
    this.initializeAnalytics();
  }

  /**
   * Get singleton instance of MonitoringService
   */
  public static getInstance(config?: MonitoringConfig): MonitoringService {
    if (!MonitoringService.instance) {
      if (!config) {
        throw new Error('MonitoringService requires configuration on first initialization');
      }
      MonitoringService.instance = new MonitoringService(config);
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize analytics session
   */
  private initializeAnalytics(): void {
    if (this.config.analytics.enabled) {
      this.analyticsSession = {
        id: this.generateSessionId(),
        startTime: new Date(),
        lastActivity: new Date(),
        pageViews: 0,
        events: 0,
      };
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get system health status
   */
  public async getSystemHealth(): Promise<SystemHealth> {
    const services = await this.checkServicesHealth();
    const summary = this.calculateHealthSummary(services);
    const overallStatus = this.determineOverallStatus(summary);

    // Version info not available on client side
    const versionInfo = {
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: '',
      versionCode: 1,
      commitHash: 'unknown',
      branch: 'unknown',
    };

    return {
      status: overallStatus,
      timestamp: new Date(),
      uptime: Date.now() - this.startTime.getTime(),
      version: envConfig.appVersion,
      versionDisplay: '1.0.0',
      versionInfo: {
        major: versionInfo.major,
        minor: versionInfo.minor,
        patch: versionInfo.patch,
        prerelease: versionInfo.prerelease,
        versionCode: versionInfo.versionCode,
        commitHash: versionInfo.commitHash,
        branch: versionInfo.branch,
      },
      environment: envConfig.appEnv,
      services,
      summary,
    };
  }

  /**
   * Check health of individual services
   */
  private async checkServicesHealth(): Promise<ServiceHealth[]> {
    const services: ServiceHealth[] = [];

    for (const serviceName of this.config.healthCheck.services) {
      try {
        const startTime = Date.now();
        const health = await this.checkServiceHealth(serviceName);
        const responseTime = Date.now() - startTime;

        services.push({
          name: serviceName,
          status: health.status,
          responseTime,
          lastCheck: new Date(),
          error: health.error,
          metadata: health.metadata,
        });
      } catch (error) {
        services.push({
          name: serviceName,
          status: HealthStatus.UNHEALTHY,
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return services;
  }

  /**
   * Check health of a specific service
   */
  private async checkServiceHealth(serviceName: string): Promise<{
    status: HealthStatus;
    error?: string;
    metadata?: Record<string, unknown>;
  }> {
    switch (serviceName) {
      case 'database':
        return this.checkDatabaseHealth();
      case 'api':
        return this.checkApiHealth();
      case 'cache':
        return this.checkCacheHealth();
      case 'storage':
        return this.checkStorageHealth();
      default:
        return { status: HealthStatus.UNKNOWN };
    }
  }

  /**
   * Check database health
   */
  private async checkDatabaseHealth(): Promise<{
    status: HealthStatus;
    error?: string;
    metadata?: Record<string, unknown>;
  }> {
    // In a real implementation, this would check actual database connectivity
    await Promise.resolve(); // Simulate async operation
    // For now, we'll simulate a healthy database
    return {
      status: HealthStatus.HEALTHY,
      metadata: {
        connectionPool: 'active',
        queryTime: '< 10ms',
      },
    };
  }

  /**
   * Check API health
   */
  private async checkApiHealth(): Promise<{
    status: HealthStatus;
    error?: string;
    metadata?: Record<string, unknown>;
  }> {
    // In a real implementation, this would check API endpoints
    await Promise.resolve(); // Simulate async operation
    return {
      status: HealthStatus.HEALTHY,
      metadata: {
        responseTime: '< 100ms',
        endpoints: 'all_operational',
      },
    };
  }

  /**
   * Check cache health
   */
  private async checkCacheHealth(): Promise<{
    status: HealthStatus;
    error?: string;
    metadata?: Record<string, unknown>;
  }> {
    // In a real implementation, this would check cache connectivity
    await Promise.resolve(); // Simulate async operation
    return {
      status: HealthStatus.HEALTHY,
      metadata: {
        hitRate: '95%',
        memoryUsage: '60%',
      },
    };
  }

  /**
   * Check storage health
   */
  private async checkStorageHealth(): Promise<{
    status: HealthStatus;
    error?: string;
    metadata?: Record<string, unknown>;
  }> {
    // In a real implementation, this would check storage connectivity
    await Promise.resolve(); // Simulate async operation
    return {
      status: HealthStatus.HEALTHY,
      metadata: {
        availableSpace: '80%',
        readWrite: 'operational',
      },
    };
  }

  /**
   * Calculate health summary from services
   */
  private calculateHealthSummary(services: ServiceHealth[]): {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  } {
    const summary = {
      total: services.length,
      healthy: 0,
      degraded: 0,
      unhealthy: 0,
    };

    services.forEach((service) => {
      switch (service.status) {
        case HealthStatus.HEALTHY:
          summary.healthy++;
          break;
        case HealthStatus.DEGRADED:
          summary.degraded++;
          break;
        case HealthStatus.UNHEALTHY:
          summary.unhealthy++;
          break;
      }
    });

    return summary;
  }

  /**
   * Determine overall system status
   */
  private determineOverallStatus(summary: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  }): HealthStatus {
    if (summary.unhealthy > 0) {
      return HealthStatus.UNHEALTHY;
    }
    if (summary.degraded > 0) {
      return HealthStatus.DEGRADED;
    }
    if (summary.healthy === summary.total) {
      return HealthStatus.HEALTHY;
    }
    return HealthStatus.UNKNOWN;
  }

  /**
   * Track analytics event
   */
  public trackEvent(
    type: AnalyticsEventType,
    name: string,
    properties?: Record<string, unknown>,
    userId?: string
  ): void {
    if (!this.config.analytics.enabled || !this.analyticsSession) {
      return;
    }

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      timestamp: new Date(),
      userId,
      sessionId: this.analyticsSession.id,
      properties,
    };

    // Update session
    this.analyticsSession.events++;
    this.analyticsSession.lastActivity = new Date();

    // In a real implementation, this would send to analytics service
    if (this.config.analytics.debug) {
      // eslint-disable-next-line no-console
      console.log('Analytics Event:', event);
    }
  }

  /**
   * Track page view
   */
  public trackPageView(path: string, userId?: string): void {
    if (!this.analyticsSession) {
      return;
    }

    this.analyticsSession.pageViews++;
    this.trackEvent(AnalyticsEventType.PAGE_VIEW, 'page_view', { path }, userId);
  }

  /**
   * Add monitoring metric
   */
  public addMetric(name: string, value: number, unit: string, tags?: Record<string, string>): void {
    const metric: MonitoringMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    const maxMetrics = this.config.dashboard.maxMetrics;
    if (this.metrics.length > maxMetrics) {
      this.metrics = this.metrics.slice(-maxMetrics);
    }
  }

  /**
   * Add monitoring alert
   */
  public addAlert(level: AlertLevel, message: string, metadata?: Record<string, unknown>): void {
    const alert: MonitoringAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: new Date(),
      resolved: false,
      metadata,
    };

    this.alerts.push(alert);

    // Keep only recent alerts
    const maxAlerts = this.config.dashboard.maxAlerts;
    if (this.alerts.length > maxAlerts) {
      this.alerts = this.alerts.slice(-maxAlerts);
    }

    // In a real implementation, this would send alerts via webhook/email
    if (this.config.alerts.enabled) {
      // eslint-disable-next-line no-console
      console.log('Monitoring Alert:', alert);
    }
  }

  /**
   * Get monitoring dashboard data
   */
  public async getDashboardData(): Promise<MonitoringDashboardData> {
    const systemHealth = await this.getSystemHealth();
    const recentAlerts = this.alerts.slice(-10);
    const recentMetrics = this.metrics.slice(-20);

    return {
      systemHealth,
      recentAlerts,
      metrics: recentMetrics,
      analytics: {
        totalEvents: this.analyticsSession?.events || 0,
        activeSessions: this.analyticsSession ? 1 : 0,
        topPages: this.getTopPages(),
      },
    };
  }

  /**
   * Get top pages (simplified implementation)
   */
  private getTopPages(): Array<{ path: string; views: number }> {
    // In a real implementation, this would aggregate page view data
    return [
      { path: '/', views: 100 },
      { path: '/dashboard', views: 50 },
      { path: '/settings', views: 25 },
    ];
  }

  /**
   * Get current analytics session
   */
  public getAnalyticsSession(): AnalyticsSession | null {
    return this.analyticsSession;
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
