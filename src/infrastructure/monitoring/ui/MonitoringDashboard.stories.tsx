import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Mock data for Storybook
const mockDashboardData = {
  systemHealth: {
    status: 'healthy',
    uptime: 3600000,
    version: '1.0.0',
    timestamp: new Date(),
    summary: {
      healthy: 4,
      total: 4,
    },
    services: [
      { name: 'API', status: 'healthy', responseTime: 120 },
      { name: 'Database', status: 'healthy', responseTime: 45 },
      { name: 'Cache', status: 'healthy', responseTime: 12 },
      { name: 'Queue', status: 'healthy', responseTime: 8 },
    ],
  },
  recentAlerts: [
    {
      id: '1',
      level: 'info',
      message: 'System maintenance scheduled',
      timestamp: new Date(Date.now() - 300000),
    },
  ],
  metrics: [
    { name: 'CPU Usage', value: 30, unit: '%' },
    { name: 'Memory Usage', value: 50, unit: '%' },
    { name: 'Disk Usage', value: 20, unit: '%' },
    { name: 'Network I/O', value: 10, unit: 'MB/s' },
  ],
  analytics: {
    totalEvents: 10000,
    activeSessions: 100,
    topPages: [
      { path: '/', views: 500 },
      { path: '/dashboard', views: 300 },
      { path: '/reports', views: 200 },
    ],
  },
};

// Create a mock component that uses the mock data
function MockedMonitoringDashboard() {
  const [dashboardData, setDashboardData] = React.useState(mockDashboardData);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div
      className="monitoring-dashboard"
      style={{
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <div
        className="monitoring-dashboard__header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ margin: 0, color: '#1f2937' }}>System Monitoring Dashboard</h2>
        <div className="monitoring-dashboard__status">
          Status:{' '}
          <span
            className="status-healthy"
            style={{
              color: '#059669',
              fontWeight: '600',
              padding: '4px 8px',
              backgroundColor: '#d1fae5',
              borderRadius: '4px',
            }}
          >
            Healthy
          </span>
        </div>
      </div>

      <div className="monitoring-dashboard__content" style={{ display: 'grid', gap: '20px' }}>
        <div
          className="monitoring-dashboard__section"
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>System Health</h3>
          <div className="health-metrics" style={{ display: 'grid', gap: '12px' }}>
            <div
              className="health-metric"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <span style={{ color: '#6b7280' }}>Uptime:</span>
              <span style={{ fontWeight: '600' }}>
                {Math.floor(dashboardData.systemHealth.uptime / 1000 / 60)} minutes
              </span>
            </div>
            <div
              className="health-metric"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <span style={{ color: '#6b7280' }}>Version:</span>
              <span style={{ fontWeight: '600' }}>{dashboardData.systemHealth.version}</span>
            </div>
            <div
              className="health-metric"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
              }}
            >
              <span style={{ color: '#6b7280' }}>Services:</span>
              <span style={{ fontWeight: '600', color: '#059669' }}>
                {dashboardData.systemHealth.summary.healthy}/
                {dashboardData.systemHealth.summary.total} healthy
              </span>
            </div>
          </div>
        </div>

        <div className="monitoring-dashboard__section">
          <h3>Recent Alerts</h3>
          <div className="alerts-list">
            {dashboardData.recentAlerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <span className="alert-level">{alert.level}</span>
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time">{alert.timestamp.toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="monitoring-dashboard__section">
          <h3>Metrics</h3>
          <div className="metrics-grid">
            {dashboardData.metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-name">{metric.name}</div>
                <div className="metric-value">
                  {metric.value} {metric.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="monitoring-dashboard__section">
          <h3>Analytics</h3>
          <div className="analytics-stats">
            <div className="stat">
              <span>Total Events:</span>
              <span>{dashboardData.analytics.totalEvents.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span>Active Sessions:</span>
              <span>{dashboardData.analytics.activeSessions}</span>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="monitoring-dashboard__loading">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: 'Infrastructure/Monitoring/Dashboard',
  component: MockedMonitoringDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Real-time monitoring dashboard displaying system health, alerts, metrics, and analytics.',
      },
    },
  },
  argTypes: {
    refreshInterval: {
      control: { type: 'number', min: 1000, max: 60000, step: 1000 },
      description: 'Auto-refresh interval in milliseconds',
    },
  },
} satisfies Meta<typeof MockedMonitoringDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    refreshInterval: 10000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default monitoring dashboard with sample data.',
      },
    },
  },
};

export const WithAlerts: Story = {
  args: {
    refreshInterval: 5000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Monitoring dashboard with active alerts and warnings.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    refreshInterval: 30000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Monitoring dashboard with no data collected yet.',
      },
    },
  },
};
