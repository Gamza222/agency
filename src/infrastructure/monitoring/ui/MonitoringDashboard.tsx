'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { MonitoringService } from '../lib/monitoring.service';
import {
  AlertLevel,
  HealthStatus,
  MonitoringAlert,
  MonitoringMetric,
  SystemHealth,
} from '../types/monitoring.types';
import styles from './MonitoringDashboard.module.scss';

interface MonitoringDashboardProps {
  className?: string;
  refreshInterval?: number;
}

const HealthStatusIndicator: React.FC<{ status: HealthStatus }> = ({ status }) => {
  const getStatusClass = (healthStatus: HealthStatus): string => {
    switch (healthStatus) {
      case HealthStatus.HEALTHY:
        return styles.statusDotGreen || '';
      case HealthStatus.DEGRADED:
        return styles.statusDotYellow || '';
      case HealthStatus.UNHEALTHY:
        return styles.statusDotRed || '';
      case HealthStatus.UNKNOWN:
        return styles.statusDotGray || '';
      default:
        return styles.statusDotGray || '';
    }
  };

  return (
    <div className={styles.statusIndicator}>
      <div className={`${styles.statusDot} ${getStatusClass(status)}`} />
      <span className={styles.statusText}>{status}</span>
    </div>
  );
};

const ServiceHealthCard: React.FC<{
  service: {
    name: string;
    status: HealthStatus;
    responseTime?: number;
    error?: string;
  };
}> = ({ service }) => (
  <div className={styles.serviceCard}>
    <div className={styles.serviceHeader}>
      <h3 className={styles.serviceName}>{service.name}</h3>
      <HealthStatusIndicator status={service.status} />
    </div>
    {service.responseTime && (
      <p className={styles.serviceResponse}>Response: {service.responseTime}ms</p>
    )}
    {service.error && <p className={styles.serviceError}>{service.error}</p>}
  </div>
);

const AlertLevelIndicator: React.FC<{ level: AlertLevel }> = ({ level }) => {
  const getLevelClass = (alertLevel: AlertLevel): string => {
    switch (alertLevel) {
      case AlertLevel.INFO:
        return styles.alertLevelInfo || '';
      case AlertLevel.WARNING:
        return styles.alertLevelWarning || '';
      case AlertLevel.ERROR:
        return styles.alertLevelError || '';
      case AlertLevel.CRITICAL:
        return styles.alertLevelCritical || '';
      default:
        return styles.alertLevelInfo || '';
    }
  };

  return <span className={`${styles.alertLevel} ${getLevelClass(level)}`}>{level}</span>;
};

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  className,
  refreshInterval = 10000,
}) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<MonitoringAlert[]>([]);
  const [_metrics, setMetrics] = useState<MonitoringMetric[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalEvents: number;
    activeSessions: number;
    topPages: { path: string; views: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize monitoring service with default config if not already initialized
  const monitoringService = React.useMemo(() => {
    try {
      return MonitoringService.getInstance();
    } catch (err) {
      // Initialize with default config if not already initialized
      const defaultConfig = {
        healthCheck: {
          enabled: true,
          interval: 30000,
          timeout: 5000,
          services: ['database', 'api', 'cache', 'storage'],
        },
        analytics: {
          enabled: true,
          debug: false,
          respectDoNotTrack: true,
          anonymizeIp: true,
          sampleRate: 1.0,
        },
        alerts: {
          enabled: true,
        },
        dashboard: {
          refreshInterval: 30000,
          maxAlerts: 50,
          maxMetrics: 100,
        },
      };
      return MonitoringService.getInstance(defaultConfig);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await monitoringService.getDashboardData();

      setSystemHealth(dashboardData.systemHealth);
      setRecentAlerts(dashboardData.recentAlerts || []);
      setMetrics(dashboardData.metrics || []);
      setAnalytics(dashboardData.analytics || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [monitoringService]);

  useEffect(() => {
    void fetchDashboardData();

    const interval = setInterval(() => void fetchDashboardData(), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchDashboardData]);

  if (loading && !systemHealth) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <div className={styles.loading}>
          <div className={styles.loadingTitle}></div>
          <div className={styles.loadingGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.loadingCard}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <div className={styles.error}>
          <div className={styles.errorCard}>
            <h3 className={styles.errorTitle}>Dashboard Error</h3>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={() => void fetchDashboardData()} className={styles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>System Monitoring</h1>
        <div className={styles.headerActions}>
          {systemHealth && <HealthStatusIndicator status={systemHealth.status} />}
          <button onClick={() => void fetchDashboardData()} className={styles.refreshButton}>
            Refresh
          </button>
        </div>
      </div>

      {/* System Overview */}
      {systemHealth && (
        <div className={styles.overview}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Uptime</h3>
            <p className={styles.cardValue}>{Math.floor(systemHealth.uptime / 1000 / 60)}m</p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Version</h3>
            <p className={styles.cardValue}>{systemHealth.version}</p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Healthy Services</h3>
            <p className={`${styles.cardValue} ${styles.cardValueGreen}`}>
              {systemHealth.summary.healthy}/{systemHealth.summary.total}
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Last Check</h3>
            <p className={`${styles.cardValue} ${styles.cardValueSmall}`}>
              {systemHealth.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Services Health */}
      {systemHealth && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Services Health</h2>
          <div className={styles.servicesGrid}>
            {systemHealth.services.map(
              (service: {
                name: string;
                status: HealthStatus;
                responseTime?: number;
                error?: string;
              }) => (
                <ServiceHealthCard key={service.name} service={service} />
              )
            )}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Alerts</h2>
        {recentAlerts && recentAlerts.length > 0 ? (
          <div className={styles.alertsList}>
            {recentAlerts.map((alert) => (
              <div key={alert?.id || Math.random()} className={styles.alertItem}>
                <div className={styles.alertHeader}>
                  <div className={styles.alertContent}>
                    <AlertLevelIndicator level={alert?.level || AlertLevel.INFO} />
                    <span className={styles.alertMessage}>{alert?.message || 'Unknown alert'}</span>
                  </div>
                  <span className={styles.alertTime}>
                    {alert?.timestamp?.toLocaleTimeString() || 'Unknown time'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noAlerts}>
            <p className={styles.noAlertsText}>No recent alerts</p>
          </div>
        )}
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics Overview</h2>
          <div className={styles.analyticsGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Total Events</h3>
              <p className={styles.cardValue}>{analytics.totalEvents}</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Active Sessions</h3>
              <p className={styles.cardValue}>{analytics.activeSessions}</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Top Page</h3>
              <p className={`${styles.cardValue} ${styles.cardValueSmall}`}>
                {analytics.topPages[0]?.path || 'N/A'} ({analytics.topPages[0]?.views || 0} views)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
