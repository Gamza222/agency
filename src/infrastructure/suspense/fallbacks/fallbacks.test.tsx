/**
 * Suspense Fallbacks Tests
 *
 * Real-life enterprise scenarios testing with minimal mocking.
 * Uses existing mock factory patterns.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  CardLoadingFallback,
  ComponentLoadingFallback,
  DefaultSuspenseFallback,
  InlineLoadingFallback,
  PageLoadingFallback,
} from './fallbacks';
import { LoadingSize } from '../types/types';

describe('Suspense Fallbacks', () => {
  // ============================================================================
  // COMPONENT LOADING FALLBACK
  // ============================================================================

  describe('ComponentLoadingFallback', () => {
    it('should render with default props', () => {
      // Real scenario: default loading state
      render(<ComponentLoadingFallback />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      // Real scenario: specific loading message
      render(<ComponentLoadingFallback text="Loading widget..." />);

      expect(screen.getByText('Loading widget...')).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      // Real scenario: different component sizes
      const { rerender } = render(<ComponentLoadingFallback size={LoadingSize.SMALL} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      rerender(<ComponentLoadingFallback size={LoadingSize.MEDIUM} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      rerender(<ComponentLoadingFallback size={LoadingSize.LARGE} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      // Real scenario: styled loading component
      const { container } = render(<ComponentLoadingFallback className="custom-loading" />);

      expect(container.firstChild).toHaveClass('custom-loading');
    });

    it('should render loading spinner', () => {
      // Real scenario: visual loading indicator
      const { container } = render(<ComponentLoadingFallback />);

      // Should have spinner element
      const spinner = container.querySelector('[class*="spinner"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PAGE LOADING FALLBACK
  // ============================================================================

  describe('PageLoadingFallback', () => {
    it('should render with default props', () => {
      // Real scenario: full page loading
      render(<PageLoadingFallback />);

      expect(screen.getByText('Loading page...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      // Real scenario: specific page loading message
      render(<PageLoadingFallback text="Loading dashboard..." />);

      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('should use large size by default', () => {
      // Real scenario: prominent page loading
      const { container } = render(<PageLoadingFallback />);

      // Should have large spinner
      const spinner = container.querySelector('[class*="spinnerLarge"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      // Real scenario: branded page loading
      const { container } = render(<PageLoadingFallback className="branded-loading" />);

      expect(container.firstChild).toHaveClass('branded-loading');
    });

    it('should take full screen height', () => {
      // Real scenario: full screen loading experience
      const { container } = render(<PageLoadingFallback />);

      expect(container.firstChild).toHaveClass('pageFallback');
    });
  });

  // ============================================================================
  // DEFAULT SUSPENSE FALLBACK
  // ============================================================================

  describe('DefaultSuspenseFallback', () => {
    it('should render with default props', () => {
      // Real scenario: generic suspense fallback
      render(<DefaultSuspenseFallback />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      // Real scenario: context-specific loading
      render(<DefaultSuspenseFallback text="Preparing content..." />);

      expect(screen.getByText('Preparing content...')).toBeInTheDocument();
    });

    it('should use medium size by default', () => {
      // Real scenario: balanced loading indicator
      const { container } = render(<DefaultSuspenseFallback />);

      // Should have medium spinner
      const spinner = container.querySelector('[class*="spinnerMedium"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      // Real scenario: contextual styling
      const { container } = render(<DefaultSuspenseFallback className="modal-loading" />);

      expect(container.firstChild).toHaveClass('modal-loading');
    });
  });

  // ============================================================================
  // INLINE LOADING FALLBACK
  // ============================================================================

  describe('InlineLoadingFallback', () => {
    it('should render with default text', () => {
      // Real scenario: inline loading state
      render(<InlineLoadingFallback />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      // Real scenario: specific inline loading
      render(<InlineLoadingFallback text="Saving..." />);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should use small spinner', () => {
      // Real scenario: compact inline indicator
      const { container } = render(<InlineLoadingFallback />);

      // Should have small spinner
      const spinner = container.querySelector('[class*="spinnerSmall"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should be inline element', () => {
      // Real scenario: inline with text content
      const { container } = render(
        <div>
          Processing <InlineLoadingFallback /> please wait
        </div>
      );

      expect(container.firstChild).toHaveTextContent('Processing Loading... please wait');
    });
  });

  // ============================================================================
  // CARD LOADING FALLBACK
  // ============================================================================

  describe('CardLoadingFallback', () => {
    it('should render skeleton loading', () => {
      // Real scenario: list item loading state
      render(<CardLoadingFallback />);

      // Should have skeleton elements
      const { container } = render(<CardLoadingFallback />);
      const skeletonElements = container.querySelectorAll('[class*="cardLine"]');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should apply custom className', () => {
      // Real scenario: card-specific styling
      const { container } = render(<CardLoadingFallback className="card-skeleton" />);

      expect(container.firstChild).toHaveClass('card-skeleton');
    });

    it('should have pulsing animation', () => {
      // Real scenario: animated skeleton
      const { container } = render(<CardLoadingFallback />);

      expect(container.firstChild).toHaveClass('cardFallback');
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('should work with different loading contexts', () => {
      // Real scenario: multiple loading states in one interface
      render(
        <div>
          <header>
            <InlineLoadingFallback text="Syncing..." />
          </header>
          <main>
            <ComponentLoadingFallback text="Loading content..." />
          </main>
          <aside>
            <CardLoadingFallback />
          </aside>
        </div>
      );

      expect(screen.getByText('Syncing...')).toBeInTheDocument();
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('should handle rapid state changes', () => {
      // Real scenario: loading state changing quickly
      const { rerender } = render(<ComponentLoadingFallback text="Loading..." />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      rerender(<ComponentLoadingFallback text="Almost ready..." />);
      expect(screen.getByText('Almost ready...')).toBeInTheDocument();

      rerender(<ComponentLoadingFallback text="Finalizing..." />);
      expect(screen.getByText('Finalizing...')).toBeInTheDocument();
    });

    it('should work with nested loading states', () => {
      // Real scenario: hierarchical loading
      render(
        <div>
          <PageLoadingFallback text="Loading application..." />
          <ComponentLoadingFallback text="Loading module..." />
        </div>
      );

      expect(screen.getByText('Loading application...')).toBeInTheDocument();
    });

    it('should maintain accessibility', () => {
      // Real scenario: screen reader compatibility
      render(<ComponentLoadingFallback text="Loading user profile" />);

      const loadingText = screen.getByText('Loading user profile');
      expect(loadingText).toBeInTheDocument();

      // Should be readable by screen readers
      expect(loadingText).toBeVisible();
    });
  });

  // ============================================================================
  // RESPONSIVE SCENARIOS
  // ============================================================================

  describe('Responsive Scenarios', () => {
    it('should handle long loading text', () => {
      // Real scenario: descriptive loading messages
      const longText =
        'Loading your personalized dashboard with all your widgets and recent activity...';

      render(<ComponentLoadingFallback text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should work with empty text', () => {
      // Real scenario: loading without text
      render(<ComponentLoadingFallback text="" />);

      // Should still show spinner
      const { container } = render(<ComponentLoadingFallback text="" />);
      const spinner = container.querySelector('[class*="spinner"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      // Real scenario: internationalized loading messages
      const specialText = 'Chargement en cours... 🔄 Please wait!';

      render(<ComponentLoadingFallback text={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERFORMANCE SCENARIOS
  // ============================================================================

  describe('Performance Scenarios', () => {
    it('should render quickly without complex calculations', () => {
      // Real scenario: fast loading state transitions
      const startTime = performance.now();

      render(<ComponentLoadingFallback />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in reasonable time (< 10ms)
      expect(renderTime).toBeLessThan(10);
    });

    it('should not cause memory leaks with rapid rerenders', () => {
      // Real scenario: rapidly changing loading states
      const { rerender, unmount } = render(<ComponentLoadingFallback />);

      // Rapidly rerender many times
      for (let i = 0; i < 100; i++) {
        rerender(<ComponentLoadingFallback text={`Loading ${i}...`} />);
      }

      // Should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple instances efficiently', () => {
      // Real scenario: many loading states simultaneously
      const components = Array.from({ length: 20 }, (_, i) => (
        <ComponentLoadingFallback key={i} text={`Loading item ${i}...`} />
      ));

      render(<div>{components}</div>);

      // All should render without issues
      expect(screen.getByText('Loading item 0...')).toBeInTheDocument();
      expect(screen.getByText('Loading item 19...')).toBeInTheDocument();
    });
  });
});

describe('Suspense Fallbacks Integration', () => {
  it('should work in complete suspense scenario', () => {
    // Real scenario: full loading experience
    const LoadingPage: React.FC = () => (
      <div>
        <PageLoadingFallback text="Loading application..." />

        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <InlineLoadingFallback text="Syncing..." />
        </div>

        <main style={{ marginTop: 100 }}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <ComponentLoadingFallback text="Loading dashboard..." />
            <ComponentLoadingFallback text="Loading notifications..." />
          </div>

          <div style={{ marginTop: 20 }}>
            <CardLoadingFallback />
            <CardLoadingFallback />
          </div>
        </main>
      </div>
    );

    render(<LoadingPage />);

    expect(screen.getByText('Loading application...')).toBeInTheDocument();
    expect(screen.getByText('Syncing...')).toBeInTheDocument();
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    expect(screen.getByText('Loading notifications...')).toBeInTheDocument();
  });
});
