import { fireEvent, render, screen } from '@testing-library/react';
import PageError from './PageError';

// Mock shared components
jest.mock('@/shared/ui/Text', () => ({
  Text: ({ children, as: Component = 'div' }: any) => <Component>{children}</Component>,
}));

jest.mock('@/shared/ui/Button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

// Mock classNames utility
jest.mock('@/shared/lib/utils/classNames/classNames', () => ({
  classNames: (main: string, _mods: any, additional: any[]) =>
    [main, ...(additional || [])].filter(Boolean).join(' '),
}));

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe('PageError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render default error message', () => {
    render(<PageError />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('should render custom error message', () => {
    const error = new Error('Custom error message');
    render(<PageError error={error} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should render chunk error UI', () => {
    const error = new Error('Loading chunk 123 failed');
    render(<PageError error={error} />);

    expect(screen.getByText('Update Available')).toBeInTheDocument();
    expect(
      screen.getByText('A new version is available. Please reload to get the latest updates.')
    ).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('should render network error UI', () => {
    const error = new Error('Failed to fetch');
    render(<PageError error={error} />);

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(
      screen.getByText('Unable to connect to the server. Please check your internet connection.')
    ).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should reload page when button is clicked', () => {
    render(<PageError />);

    const button = screen.getByText('Try again');
    fireEvent.click(button);

    expect(mockReload).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { container } = render(<PageError className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
