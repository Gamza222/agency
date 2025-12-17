/**
 * Monitoring Dashboard Tests
 *
 * Tests for the monitoring dashboard component including rendering,
 * data fetching, and user interactions.
 */

/* eslint-disable @typescript-eslint/unbound-method */

import _React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MonitoringDashboard } from './MonitoringDashboard';
import { MonitoringService } from '../lib/monitoring.service';
import { HealthStatus } from '../types/monitoring.types';
import {
  createMockMonitoringServiceInstance,
  mockDashboardData,
  mockDashboardDataNoAlerts,
} from '@/shared/testing/mocks/infrastructure';

// Mock the monitoring service
jest.mock('../lib/monitoring.service');
const MockedMonitoringService = MonitoringService as any;

// Mock the static methods
MockedMonitoringService.getInstance = jest.fn();

describe('MonitoringDashboard', () => {
  let mockInstance: jest.Mocked<MonitoringService>;

  beforeEach(() => {
    mockInstance = createMockMonitoringServiceInstance({
      getDashboardData: jest.fn().mockResolvedValue(mockDashboardData),
    });

    (MockedMonitoringService.getInstance as jest.Mock).mockReturnValue(mockInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<MonitoringDashboard />);

    // In loading state, we should see the loading skeleton
    // The header and refresh button are not visible during loading
    expect(document.querySelector("[class*='loading']")).toBeInTheDocument();
  });

  it('should render dashboard data after loading', async () => {
    render(<MonitoringDashboard />);

    await waitFor(() => {
      expect(screen.getByText('System Monitoring')).toBeInTheDocument();
    });

    // Check system overview
    expect(screen.getByText('60m')).toBeInTheDocument(); // uptime
    expect(screen.getByText('1.0.0')).toBeInTheDocument(); // version
    expect(screen.getByText('4/4')).toBeInTheDocument(); // healthy services (4 services in mock data)

    // Check services health
    expect(screen.getByText('Services Health')).toBeInTheDocument();
    expect(screen.getByText('database')).toBeInTheDocument();
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('cache')).toBeInTheDocument();
    expect(screen.getByText('storage')).toBeInTheDocument();

    // Check recent alerts
    expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
    expect(screen.getByText('System started successfully')).toBeInTheDocument();

    // Check analytics overview
    expect(screen.getByText('Analytics Overview')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // total events
    expect(screen.getByText('5')).toBeInTheDocument(); // active sessions
  });

  it('should display health status indicator', async () => {
    render(<MonitoringDashboard />);

    await waitFor(() => {
      // There should be at least one "healthy" status indicator
      expect(screen.getAllByText('healthy')).toHaveLength(5); // Overall + 4 services
    });
  });

  it('should handle refresh button click', async () => {
    render(<MonitoringDashboard />);

    await waitFor(() => {
      expect(mockInstance.getDashboardData).toHaveBeenCalled();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockInstance.getDashboardData).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to fetch data';
    mockInstance.getDashboardData.mockRejectedValue(new Error(errorMessage));

    render(<MonitoringDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Check retry button
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();

    // Test retry functionality
    mockInstance.getDashboardData.mockResolvedValue(mockDashboardData);
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('System Monitoring')).toBeInTheDocument();
    });
  });

  it('should display no alerts message when no alerts', async () => {
    mockInstance.getDashboardData.mockResolvedValue(mockDashboardDataNoAlerts);

    render(<MonitoringDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No recent alerts')).toBeInTheDocument();
    });
  });

  it('should apply custom className', async () => {
    const customClass = 'custom-dashboard';
    render(<MonitoringDashboard className={customClass} />);

    await waitFor(() => {
      // Find the root container with the custom class
      const dashboard = document.querySelector(`.${customClass}`);
      expect(dashboard).toBeInTheDocument();
      expect(dashboard).toHaveClass(customClass);
    });
  });

  it('should handle different health statuses', async () => {
    const degradedHealthData = {
      ...mockDashboardData,
      systemHealth: {
        ...mockDashboardData.systemHealth,
        status: HealthStatus.DEGRADED,
        summary: {
          total: 2,
          healthy: 1,
          degraded: 1,
          unhealthy: 0,
        },
      },
    };
    mockInstance.getDashboardData.mockResolvedValue(degradedHealthData);

    render(<MonitoringDashboard />);

    await waitFor(() => {
      expect(screen.getByText('degraded')).toBeInTheDocument();
      expect(screen.getByText('1/2')).toBeInTheDocument(); // healthy services
    });
  });

  it('should display service response times', async () => {
    render(<MonitoringDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Response: 5ms')).toBeInTheDocument();
      expect(screen.getByText('Response: 10ms')).toBeInTheDocument();
    });
  });

  it('should display analytics data correctly', async () => {
    render(<MonitoringDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('Top Page')).toBeInTheDocument();
      expect(screen.getByText('/ (50 views)')).toBeInTheDocument();
    });
  });

  it('should handle auto-refresh', async () => {
    jest.useFakeTimers();

    render(<MonitoringDashboard refreshInterval={1000} />);

    await waitFor(() => {
      expect(mockInstance.getDashboardData).toHaveBeenCalledTimes(1);
    });

    // Fast-forward time to trigger auto-refresh
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockInstance.getDashboardData).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });
});
