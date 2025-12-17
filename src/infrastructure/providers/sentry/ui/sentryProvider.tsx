'use client';

import { type FC, type PropsWithChildren, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { envConfig } from '../../../../../config/env';

interface SentryProviderProps extends PropsWithChildren {
  dsn?: string;
  environment?: string;
  tracesSampleRate?: number;
  debug?: boolean;
  enabled?: boolean;
}

const SentryProvider: FC<SentryProviderProps> = (props) => {
  const {
    children,
    dsn = envConfig.sentryDsn,
    environment = envConfig.appEnv,
    tracesSampleRate = envConfig.isProduction ? 0.1 : 1.0,
    debug = envConfig.isDevelopment,
    enabled = !envConfig.isTest,
  } = props;

  useEffect(() => {
    // Only initialize if DSN is provided and enabled
    if (!dsn || !enabled) return;

    try {
      Sentry.init({
        dsn,
        environment,
        tracesSampleRate,
        debug,
        enabled,
      });
    } catch (error) {
      // Sentry initialization failed, continue without it
      if (debug) {
        console.warn('Sentry initialization failed:', error);
      }
    }
  }, [dsn, environment, tracesSampleRate, debug, enabled]);

  return <>{children}</>;
};

export default SentryProvider;
