import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Mock Suspense fallback
jest.mock('@/infrastructure/suspense', () => ({
  DefaultSuspenseFallback: () => <div>Loading...</div>,
}));

// Mock PageError widget
jest.mock('@/widgets/PageError', () => ({
  PageError: () => <div>Error Page</div>,
}));

// Mock the log function
jest.mock('../lib/lib', () => ({
  logError: jest.fn(),
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  it('should render PageError when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Page')).toBeInTheDocument();
    expect(screen.queryByText('No Error')).not.toBeInTheDocument();
  });

  it('should render multiple children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
