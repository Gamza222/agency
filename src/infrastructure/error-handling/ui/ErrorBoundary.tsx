'use client';

import React, { Suspense, type ErrorInfo, type ReactNode } from 'react';
import { DefaultSuspenseFallback } from '@/infrastructure/suspense';
import { PageError } from '@/widgets/PageError';
import { logError } from '../lib/lib';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../types/types';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console and Sentry
    logError(error, errorInfo);
  }

  override render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // Wrap PageError in Suspense in case it has any lazy dependencies
      return (
        <Suspense fallback={<DefaultSuspenseFallback />}>
          <PageError />
        </Suspense>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
