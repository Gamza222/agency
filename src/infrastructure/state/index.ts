/**
 * State Management
 *
 * Enterprise-grade state management foundation for any application.
 */

// Store creation
export { createStore, createSimpleStore } from './createStore/createStore';

// State hooks
export {
  useStore,
  useShallowStore,
  useStoreState,
  useStoreHydrated,
  useStoreActions,
} from './stateHooks/stateHooks';

// Types
export type {
  BaseState,
  StoreConfig,
  EnhancedStore,
  AsyncState,
  PaginationState,
  FilterState,
  UIState,
  StoreState,
  Selector,
} from './types/types';

// Enums
export { StorageType, BaseStateProperty } from './types/types';
export { Environment } from './types/stateEnums';
