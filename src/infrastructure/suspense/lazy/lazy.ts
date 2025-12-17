/**
 * Lazy Loading Utilities
 *
 * Simple, reliable lazy loading with retry logic for any application.
 */

import { ComponentType, lazy } from 'react';
import { Environment, RetryConfig } from '../types/types';

// ============================================================================
// TYPES
// ============================================================================

export interface LazyOptions {
  maxRetries?: number;
  retryDelay?: number;
}

// ============================================================================
// LAZY LOADING WITH RETRY
// ============================================================================

/**
 * Enhanced lazy loading with retry logic for chunk loading failures
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyOptions = {}
): React.LazyExoticComponent<T> {
  const {
    maxRetries = RetryConfig.DEFAULT_MAX_RETRIES,
    retryDelay = RetryConfig.DEFAULT_RETRY_DELAY,
  } = options;

  return lazy(async () => {
    let lastError: Error = new Error('Lazy loading failed');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await importFn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Log retry attempt in development
        if (process.env.NODE_ENV === Environment.DEVELOPMENT) {
          console.warn(
            `Lazy loading attempt ${attempt + 1}/${maxRetries + 1} failed, retrying...`,
            {
              error: lastError.message,
              attempt: attempt + 1,
            }
          );
        }

        // Wait before retrying with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }

    // If we get here, all attempts failed
    throw lastError;
  });
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Simple lazy loading without retry (for stable chunks)
 */
export function simpleLazy<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(importFn);
}

/**
 * Lazy loading with aggressive retry (for unstable networks)
 */
export function robustLazy<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazyWithRetry(importFn, {
    maxRetries: RetryConfig.ROBUST_MAX_RETRIES,
    retryDelay: RetryConfig.ROBUST_RETRY_DELAY,
  });
}
