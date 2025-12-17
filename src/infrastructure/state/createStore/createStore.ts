/**
 * Universal Store Factory
 *
 * Simple, enterprise-grade store factory for any application.
 * Foundation-level only - no overengineering.
 */

import { create, type StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { Environment, StorageType } from '../types/stateEnums';
import type { BaseState, EnhancedStore, StoreConfig } from '../types/types';

// ============================================================================
// STORE FACTORY
// ============================================================================

/**
 * Create a universal store that works for any application
 */
export const createStore = <T extends Record<string, unknown>>(
  config: StoreConfig<T>
): EnhancedStore<T & BaseState> => {
  // Enhanced initial state with base properties
  const enhancedInitialState = {
    ...config.initialState,
    _hydrated: false,
  } as T & BaseState;

  // Create state creator function
  const stateCreator: StateCreator<T & BaseState, [], [], T & BaseState> = (set) => ({
    ...enhancedInitialState,

    // Built-in reset action
    reset: () => set(enhancedInitialState),
  });

  // Apply middleware
  let enhancedCreator: StateCreator<unknown, [], [], unknown> = stateCreator as StateCreator<
    unknown,
    [],
    [],
    unknown
  >;

  // 1. Persistence middleware (if configured)
  if (config.persist) {
    enhancedCreator = persist(
      enhancedCreator as StateCreator<unknown, [['zustand/persist', unknown]], [], unknown>,
      {
        name: config.persist.key,
        storage: createJSONStorage(() =>
          config.persist?.storage === StorageType.SESSION_STORAGE ? sessionStorage : localStorage
        ),
        onRehydrateStorage: () => (state) => {
          if (state) {
            const stateWithHydrated = state as Record<string, unknown> & { _hydrated?: boolean };
            stateWithHydrated._hydrated = true;
          }
        },
      }
    ) as StateCreator<unknown, [], [], unknown>;
  }

  // 2. Selector subscription (for optimized selectors)
  enhancedCreator = subscribeWithSelector(
    enhancedCreator as StateCreator<
      unknown,
      [['zustand/subscribeWithSelector', never]],
      [],
      unknown
    >
  ) as StateCreator<unknown, [], [], unknown>;

  // 3. DevTools (development only)
  if (config.devtools && process.env.NODE_ENV === Environment.DEVELOPMENT) {
    enhancedCreator = devtools(
      enhancedCreator as StateCreator<unknown, [['zustand/devtools', never]], [], unknown>,
      { name: config.name }
    ) as StateCreator<unknown, [], [], unknown>;
  }

  // Create the Zustand store
  const store = create(enhancedCreator);

  // Enhanced store with utility methods
  const enhancedStore: EnhancedStore<T & BaseState> = {
    getState: store.getState as () => T & BaseState,
    setState: store.setState as (
      partial:
        | (T & BaseState)
        | Partial<T & BaseState>
        | ((state: T & BaseState) => (T & BaseState) | Partial<T & BaseState>)
    ) => void,
    subscribe: store.subscribe as (
      listener: (state: T & BaseState, prevState: T & BaseState) => void
    ) => () => void,

    // Reset to initial state
    reset: () => {
      store.setState(enhancedInitialState);
    },

    // Clear persisted storage
    clearStorage: () => {
      if (config.persist?.key) {
        const storage =
          config.persist.storage === StorageType.SESSION_STORAGE ? sessionStorage : localStorage;
        storage.removeItem(config.persist.key);
      }
    },
  };

  return enhancedStore;
};

/**
 * Create a simple store with minimal configuration
 */
export const createSimpleStore = <T extends Record<string, unknown>>(
  name: string,
  initialState: T,
  enablePersist = false
): EnhancedStore<T & BaseState> => {
  return createStore({
    name,
    initialState,
    ...(enablePersist && {
      persist: {
        key: name,
        storage: StorageType.LOCAL_STORAGE,
      },
    }),
    devtools: process.env.NODE_ENV === Environment.DEVELOPMENT,
  });
};
