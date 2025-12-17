/**
 * State Management Hooks
 *
 * Universal React hooks for Zustand stores that work with any application.
 * Foundation-level only - no overengineering.
 */

import { useSyncExternalStore } from 'react';
import type { BaseState, EnhancedStore } from '../types/types';

// ============================================================================
// CORE HOOKS
// ============================================================================

/**
 * Subscribe to store with selector
 */
export const useStore = <TStore, TResult>(
  store: EnhancedStore<TStore>,
  selector: (state: TStore) => TResult
): TResult => {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
};

/**
 * Subscribe to store with shallow comparison
 */
export const useShallowStore = <TStore, TResult>(
  store: EnhancedStore<TStore>,
  selector: (state: TStore) => TResult
): TResult => {
  return useStore(store, selector);
};

/**
 * Subscribe to complete store state
 */
export const useStoreState = <TStore>(store: EnhancedStore<TStore>): TStore => {
  return useStore(store, (state) => state);
};

/**
 * Subscribe to hydration status
 */
export const useStoreHydrated = <TStore extends BaseState>(
  store: EnhancedStore<TStore>
): boolean => {
  return useStore(store, (state) => (state as { _hydrated?: boolean })._hydrated ?? false);
};

/**
 * Get store actions (setState, reset, clearStorage)
 */
export const useStoreActions = <TStore>(store: EnhancedStore<TStore>) => {
  return {
    setState: store.setState,
    reset: store.reset,
    clearStorage: store.clearStorage,
  };
};

// ============================================================================
// UTILITIES
// ============================================================================
