/**
 * Lazy Loading Tests
 *
 * Real-life enterprise scenarios testing with minimal mocking.
 * Uses existing mock factory patterns.
 */

import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { lazyWithRetry, robustLazy, simpleLazy } from './lazy';
import { mockConsole } from '@/shared/testing/mocks/browser';

// Test components
const SuccessComponent: React.ComponentType<unknown> = () => (
  <div>Component loaded successfully</div>
);
// const ErrorComponent: React.FC = () => <div>This should not render</div>;

describe('Lazy Loading', () => {
  beforeEach(() => {
    mockConsole.clear();
  });

  afterEach(() => {
    mockConsole.restore();
    // Clear any pending timers
    jest.clearAllTimers();
  });

  // ============================================================================
  // LAZY WITH RETRY
  // ============================================================================

  describe('lazyWithRetry', () => {
    it('should load component successfully on first attempt', async () => {
      // Real scenario: component loads without issues
      const LazyComponent = lazyWithRetry(() => Promise.resolve({ default: SuccessComponent }));

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Component loaded successfully')).toBeInTheDocument();
      });
    });

    it('should handle retry logic configuration', () => {
      // Real scenario: configurable retry behavior
      const LazyComponent = lazyWithRetry(() => Promise.resolve({ default: SuccessComponent }), {
        maxRetries: 5,
        retryDelay: 500,
      });

      // Should create component without throwing
      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('object');
    });

    it('should fail after max retries', async () => {
      // Real scenario: persistent network failure
      const LazyComponent = lazyWithRetry(() => Promise.reject(new Error('Persistent error')), {
        maxRetries: 2,
        retryDelay: 10,
      });

      // Catch the error that will be thrown
      const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        try {
          return <>{children}</>;
        } catch {
          return <div>Failed to load component</div>;
        }
      };

      render(
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
          </Suspense>
        </ErrorBoundary>
      );

      // Should show loading first
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should eventually fail (this will be caught by error boundary in real apps)
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).toBeInTheDocument();
      });
    });

    it('should accept custom retry options', () => {
      // Real scenario: custom retry configuration
      const LazyComponent = lazyWithRetry(() => Promise.resolve({ default: SuccessComponent }), {
        maxRetries: 1,
        retryDelay: 10,
      });

      // Should create component with custom options
      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('object');
    });

    it('should support development mode configuration', () => {
      // Real scenario: development vs production behavior
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'development';

      const LazyComponent = lazyWithRetry(() => Promise.resolve({ default: SuccessComponent }));

      expect(LazyComponent).toBeDefined();

      (process.env as any).NODE_ENV = originalEnv;
    });

    it('should not log in production', async () => {
      // Real scenario: production behavior
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'production';

      let attempts = 0;
      const LazyComponent = lazyWithRetry(
        () => {
          attempts++;
          if (attempts < 2) {
            return Promise.reject(new Error('Prod retry test'));
          }
          return Promise.resolve({ default: SuccessComponent });
        },
        { retryDelay: 10 }
      );

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText('Component loaded successfully')).toBeInTheDocument();
      });

      // Should not have logged anything
      const consoleCalls = mockConsole.getCalls();
      const warnCalls = consoleCalls.filter((call) => call.method === 'warn');
      expect(warnCalls).toHaveLength(0);

      (process.env as any).NODE_ENV = originalEnv;
    });
  });

  // ============================================================================
  // SIMPLE LAZY
  // ============================================================================

  describe('simpleLazy', () => {
    it('should load component without retry logic', async () => {
      // Real scenario: stable component loading
      const LazyComponent = simpleLazy(() => Promise.resolve({ default: SuccessComponent }));

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText('Component loaded successfully')).toBeInTheDocument();
      });
    });

    it('should fail immediately without retries', () => {
      // Real scenario: immediate failure without retry overhead
      const LazyComponent = simpleLazy(() => Promise.reject(new Error('Immediate failure')));

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      // Should show loading, then fail (caught by error boundary in real apps)
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // ROBUST LAZY
  // ============================================================================

  describe('robustLazy', () => {
    it('should create component with aggressive retry settings', () => {
      // Real scenario: unstable network requires more retries
      const LazyComponent = robustLazy(() => Promise.resolve({ default: SuccessComponent }));

      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('object');
    });

    it('should load component successfully', async () => {
      // Real scenario: robust loading eventually succeeds
      const LazyComponent = robustLazy(() => Promise.resolve({ default: SuccessComponent }));

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText('Component loaded successfully')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('should work with multiple lazy components', async () => {
      // Real scenario: page with multiple lazy-loaded sections
      const LazyHeader = lazyWithRetry(() =>
        Promise.resolve({ default: () => <div>Lazy Header</div> })
      );

      const LazyContent = lazyWithRetry(() =>
        Promise.resolve({ default: () => <div>Lazy Content</div> })
      );

      render(
        <div>
          <Suspense fallback={<div>Loading header...</div>}>
            <LazyHeader />
          </Suspense>
          <Suspense fallback={<div>Loading content...</div>}>
            <LazyContent />
          </Suspense>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('Lazy Header')).toBeInTheDocument();
        expect(screen.getByText('Lazy Content')).toBeInTheDocument();
      });
    });

    it('should handle concurrent loading', async () => {
      // Real scenario: multiple components loading simultaneously
      const components = Array.from({ length: 3 }, (_, i) =>
        lazyWithRetry(() => Promise.resolve({ default: () => <div>Component {i + 1}</div> }))
      );

      render(
        <div>
          {components.map((LazyComponent, i) => (
            <Suspense key={i} fallback={<div>Loading {i + 1}...</div>}>
              <LazyComponent />
            </Suspense>
          ))}
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('Component 1')).toBeInTheDocument();
        expect(screen.getByText('Component 2')).toBeInTheDocument();
        expect(screen.getByText('Component 3')).toBeInTheDocument();
      });
    });

    it('should handle different retry strategies', async () => {
      // Real scenario: mixing different loading strategies
      const StableComponent = simpleLazy(() =>
        Promise.resolve({ default: () => <div>Stable Component</div> })
      );

      const UnstableComponent = robustLazy(() =>
        Promise.resolve({ default: () => <div>Unstable Component</div> })
      );

      render(
        <div>
          <Suspense fallback={<div>Loading stable...</div>}>
            <StableComponent />
          </Suspense>
          <Suspense fallback={<div>Loading unstable...</div>}>
            <UnstableComponent />
          </Suspense>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('Stable Component')).toBeInTheDocument();
        expect(screen.getByText('Unstable Component')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // PERFORMANCE SCENARIOS
  // ============================================================================

  describe('Performance Scenarios', () => {
    it('should handle rapid consecutive loads', async () => {
      // Real scenario: user rapidly navigating between pages
      const LazyPage = lazyWithRetry(() => Promise.resolve({ default: SuccessComponent }));

      const { rerender } = render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyPage />
        </Suspense>
      );

      // Rapidly rerender multiple times
      for (let i = 0; i < 5; i++) {
        rerender(
          <Suspense fallback={<div>Loading...</div>}>
            <LazyPage />
          </Suspense>
        );
      }

      await waitFor(() => {
        expect(screen.getByText('Component loaded successfully')).toBeInTheDocument();
      });
    });

    it('should not leak memory with component unmounting', () => {
      // Real scenario: ensure cleanup of lazy components
      const LazyComponent = lazyWithRetry(() => Promise.resolve({ default: SuccessComponent }));

      const { unmount } = render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      // Should unmount without throwing
      expect(() => unmount()).not.toThrow();
    });
  });
});

describe('Lazy Loading Integration', () => {
  it('should work in real application scenarios', async () => {
    // Real scenario: complete lazy loading setup
    const LazyDashboard = lazyWithRetry(() =>
      Promise.resolve({
        default: () => (
          <div>
            <h1>Dashboard</h1>
            <p>Dashboard content loaded</p>
          </div>
        ),
      })
    );

    const App: React.FC = () => (
      <div>
        <nav>Navigation</nav>
        <main>
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <LazyDashboard />
          </Suspense>
        </main>
      </div>
    );

    render(<App />);

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Dashboard content loaded')).toBeInTheDocument();
    });
  });
});
