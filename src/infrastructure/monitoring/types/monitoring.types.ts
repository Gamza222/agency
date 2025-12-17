/**
 * Monitoring Infrastructure Types
 *
 * Type definitions for monitoring, analytics, and health check systems.
 */

// ============================================================================
// HEALTH CHECK TYPES
// ============================================================================

/**
 * Health status levels
 */
export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown',
}

/**
 * Service health information
 */
export interface ServiceHealth {
  name: string;
  status: HealthStatus;
  responseTime?: number;
  lastCheck: Date;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Overall system health status
 */
export interface SystemHealth {
  status: HealthStatus;
  timestamp: Date;
  uptime: number;
  version: string;
  versionDisplay: string;
  versionInfo: {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
    versionCode: number;
    commitHash?: string;
    branch?: string;
  };
  environment: string;
  services: ServiceHealth[];
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Analytics event types
 */
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  USER_INTERACTION = 'user_interaction',
  PERFORMANCE_METRIC = 'performance_metric',
  ERROR_EVENT = 'error_event',
  CUSTOM_EVENT = 'custom_event',
}

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  name: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  respectDoNotTrack: boolean;
  anonymizeIp: boolean;
  sampleRate: number;
  debug: boolean;
}

/**
 * Analytics session information
 */
export interface AnalyticsSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: number;
  userId?: string;
}

// ============================================================================
// MONITORING TYPES
// ============================================================================

/**
 * Monitoring metrics
 */
export interface MonitoringMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

/**
 * Monitoring alert levels
 */
export enum AlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Monitoring alert
 */
export interface MonitoringAlert {
  id: string;
  level: AlertLevel;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Monitoring dashboard data
 */
export interface MonitoringDashboardData {
  systemHealth: SystemHealth;
  recentAlerts: MonitoringAlert[];
  metrics: MonitoringMetric[];
  analytics: {
    totalEvents: number;
    activeSessions: number;
    topPages: Array<{ path: string; views: number }>;
  };
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
  healthCheck: {
    enabled: boolean;
    interval: number;
    timeout: number;
    services: string[];
  };
  analytics: AnalyticsConfig;
  alerts: {
    enabled: boolean;
    webhook?: string;
    email?: string;
  };
  dashboard: {
    refreshInterval: number;
    maxAlerts: number;
    maxMetrics: number;
  };
}
