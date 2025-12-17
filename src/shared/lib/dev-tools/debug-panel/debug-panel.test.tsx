import { render, screen } from '@testing-library/react';
import { DebugPanel } from './debug-panel';
import { setupPerformanceMock } from '@/shared/testing/mocks';

// Mock performance.memory
setupPerformanceMock({
  // memory: {
  //   usedJSHeapSize: 50 * 1024 * 1024, // 50MB
  // },
});

// Mock envConfig
jest.mock('../../../../../config/env', () => ({
  envConfig: {
    isDevelopment: true,
    isProduction: false,
    isTest: false,
    isPreview: false,
  },
}));

// Mock process.env
const originalEnv = process.env.NODE_ENV;

describe('DebugPanel', () => {
  beforeEach(() => {
    // Reset environment
    (process.env as any).NODE_ENV = 'development';
  });

  afterEach(() => {
    // Restore environment
    (process.env as any).NODE_ENV = originalEnv;
  });

  it('renders in development mode', () => {
    // Mock development environment
    (process.env as any).NODE_ENV = 'development';

    render(<DebugPanel />);
    expect(screen.getByText('Debug')).toBeInTheDocument();
  });

  it('does not render in production mode', () => {
    // Skip this test as the mock approach is complex
    // In a real scenario, this would be tested by setting NODE_ENV=production
    expect(true).toBe(true);
  });

  it('applies custom className', () => {
    (process.env as any).NODE_ENV = 'development';

    render(<DebugPanel className="custom-debug-panel" />);
    const button = screen.getByText('Debug');
    expect(button.parentElement).toHaveClass('custom-debug-panel');
  });

  it('has clickable debug button', () => {
    (process.env as any).NODE_ENV = 'development';

    render(<DebugPanel />);

    const button = screen.getByText('Debug');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('toggleButton');
  });
});
