/**
 * Sentry Provider
 *
 * Sentry error tracking provider configuration.
 */

'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
interface SentryProviderProps {
  dsn?: string;
  environment?: string;
  tracesSampleRate?: number;
  debug?: boolean;
  enabled?: boolean;
  children: React.ReactNode;
}

// ============================================================================
// SENTRY PROVIDER
// ============================================================================

/**
 * Provides Sentry error tracking context to the application
 */
export const SentryProvider: React.FC<SentryProviderProps> = ({ children }) => {
  useEffect(() => {
    const initializeSentry = async () => {
      try {
        const { envConfig } = await import('../../../../config/env');

        Sentry.init({
          dsn: envConfig.sentryDsn,
          environment: envConfig.appEnv,
          tracesSampleRate: envConfig.isProduction ? 0.1 : 1.0,
          debug: envConfig.isDevelopment,
          enabled: !envConfig.isTest,
        });
      } catch (error) {
        // Sentry might already be initialized, ignore the error
      }
    };

    void initializeSentry();
  }, []);

  return <>{children}</>;
};
