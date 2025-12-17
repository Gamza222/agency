import { render } from '@testing-library/react';
import SentryProvider from './sentryProvider';

// Mock Sentry
const mockSentryInit = jest.fn();
jest.mock('@sentry/nextjs', () => ({
  init: mockSentryInit,
}));

// Mock the config import
jest.mock('../../../../../config/env', () => ({
  envConfig: {
    sentryDsn: '',
    appEnv: 'test',
    isProduction: false,
    isDevelopment: true,
    isTest: true, // Disable by default in tests
  },
}));

describe('SentryProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children without errors', () => {
    const { getByText } = render(
      <SentryProvider>
        <div>Test Child</div>
      </SentryProvider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <SentryProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </SentryProvider>
    );

    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
  });

  it('should not initialize when disabled by default', () => {
    render(
      <SentryProvider>
        <div>Test</div>
      </SentryProvider>
    );

    // Should not call Sentry.init because isTest=true (enabled=false)
    expect(mockSentryInit).not.toHaveBeenCalled();
  });

  it('should not initialize when no DSN provided', () => {
    render(
      <SentryProvider enabled={true} dsn="">
        <div>Test</div>
      </SentryProvider>
    );

    expect(mockSentryInit).not.toHaveBeenCalled();
  });

  it('should accept all props without errors', () => {
    const { getByText } = render(
      <SentryProvider
        dsn="test-dsn"
        environment="test-env"
        tracesSampleRate={0.5}
        debug={false}
        enabled={false}
      >
        <div>Test</div>
      </SentryProvider>
    );

    expect(getByText('Test')).toBeInTheDocument();
    expect(mockSentryInit).not.toHaveBeenCalled();
  });
});
