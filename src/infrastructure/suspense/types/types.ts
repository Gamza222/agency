/**
 * Suspense Types
 *
 * Universal types for lazy loading and suspense fallbacks.
 * Foundation-level only - no overengineering.
 */

import { ComponentType } from 'react';

// ============================================================================
// SUSPENSE ENUMS
// ============================================================================

export {
  RetryConfig,
  LoadingState,
  LoadingSize,
  ComponentHeight,
  Environment,
} from './suspenseEnums';

// ============================================================================
// LAZY LOADING TYPES
// ============================================================================

export interface LazyRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  isDevelopment?: boolean;
}

export interface LazyComponentProps {
  [key: string]: unknown;
}

export type LazyImportFn<T = ComponentType<unknown>> = () => Promise<{ default: T }>;

// ============================================================================
// FALLBACK TYPES
// ============================================================================

export interface LoadingFallbackProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  height?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
}

export interface SuspenseFallbackProps {
  text?: string;
  className?: string;
}

// ============================================================================
// UTILITIES
// ============================================================================

export type LoadingStateType = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingContext {
  state: LoadingStateType;
  retry?: () => void;
  error?: Error;
}
