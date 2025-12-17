/**
 * Suspense
 *
 * Enterprise-grade suspense foundation for any application.
 */

// Lazy loading utilities
export { lazyWithRetry, simpleLazy, robustLazy } from './lazy/lazy';

// Suspense fallbacks
export {
  ComponentLoadingFallback,
  PageLoadingFallback,
  DefaultSuspenseFallback,
  InlineLoadingFallback,
  CardLoadingFallback,
} from './fallbacks/fallbacks';

// Types
export type {
  LazyRetryOptions,
  LazyComponentProps,
  LazyImportFn,
  LoadingFallbackProps,
  SuspenseFallbackProps,
  LoadingStateType,
  LoadingContext,
} from './types/types';

// Enums
export {
  RetryConfig,
  LoadingState,
  LoadingSize,
  ComponentHeight,
  Environment,
} from './types/types';
