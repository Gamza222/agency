import type { ErrorInfo } from 'react';

export const logError = (error: Error, errorInfo: ErrorInfo): void => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(error, errorInfo);
  }

  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    // Import Sentry dynamically to avoid issues in tests
    void import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(error, {
        extra: {
          componentStack: errorInfo.componentStack,
        },
        tags: {
          errorBoundary: true,
        },
      });
    });
  }
};
