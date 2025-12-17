/**
 * State Management Types
 *
 * Universal types for state management that work with any application.
 * Foundation-level only - no overengineering.
 */

// ============================================================================
// STATE ENUMS
// ============================================================================

export { StorageType, Environment, BaseStateProperty } from './stateEnums';
import { StorageType } from './stateEnums';

// ============================================================================
// CORE TYPES
// ============================================================================

export interface BaseState {
  _hydrated: boolean;
}

export interface StoreConfig<T> {
  name: string;
  initialState: T;
  persist?: {
    key: string;
    storage?: StorageType;
  };
  devtools?: boolean;
}

export interface EnhancedStore<T> {
  getState: () => T;
  setState: (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  reset: () => void;
  clearStorage: () => void;
}

// ============================================================================
// COMMON STATE PATTERNS
// ============================================================================

/**
 * Standard async operation state
 */
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Standard pagination state
 */
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Standard filter state
 */
export interface FilterState {
  search: string;
  filters: Record<string, unknown>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Standard UI state
 */
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  currentRoute: string;
}

// ============================================================================
// STORE UTILITIES
// ============================================================================

/**
 * Helper type to extract state type from store
 */
export type StoreState<T> = T extends EnhancedStore<infer S> ? S : never;

/**
 * Helper type for store selector functions
 */
export type Selector<TStore, TResult> = (state: StoreState<TStore>) => TResult;
