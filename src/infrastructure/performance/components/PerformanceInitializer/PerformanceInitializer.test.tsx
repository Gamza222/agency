import { render } from '@testing-library/react';
import { PerformanceInitializer } from './PerformanceInitializer';
// Mock the web-vitals module
jest.mock('../../lib/web-vitals', () => ({
  initWebVitals: jest.fn(),
}));

describe('PerformanceInitializer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize web vitals on mount', async () => {
    const { initWebVitals } = await import('../../lib/web-vitals');

    render(<PerformanceInitializer />);

    expect(initWebVitals).toHaveBeenCalledWith({
      debug: process.env.NODE_ENV === 'development',
      reportToSentry: true,
    });
  });

  it('should only call initWebVitals once', async () => {
    const { initWebVitals } = await import('../../lib/web-vitals');

    const { rerender } = render(<PerformanceInitializer />);
    rerender(<PerformanceInitializer />);

    expect(initWebVitals).toHaveBeenCalledTimes(1);
  });

  it('should render nothing', () => {
    const { container } = render(<PerformanceInitializer />);

    expect(container.firstChild).toBeNull();
  });
});
