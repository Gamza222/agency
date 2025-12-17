/**
 * State Management Mocks
 *
 * Mock implementations for Zustand stores and state management utilities.
 */

import { type BaseState, createStore, type EnhancedStore } from '@/infrastructure/state';

// ============================================================================
// STORE FACTORY MOCKS
// ============================================================================

/**
 * Creates a mock store for testing
 */
const createMockStore = <T extends Record<string, unknown>>(
  initialState: T,
  options: {
    name?: string;
    persistence?: boolean;
    devtools?: boolean;
  } = {}
): EnhancedStore<T & BaseState> => {
  return createStore({
    name: options.name || 'mock-store',
    initialState,
    ...(options.persistence && {
      persistence: {
        key: `mock-${options.name || 'store'}`,
        storage: 'localStorage' as const,
      },
    }),
    devtools: options.devtools || false,
  });
};

/**
 * Common test state interfaces
 */
interface MockCounterState extends Record<string, unknown> {
  count: number;
  step: number;
  isLoading: boolean;
}

interface MockTodoState extends Record<string, unknown> {
  todos: Array<{
    id: number;
    text: string;
    completed: boolean;
  }>;
  filter: 'all' | 'active' | 'completed';
}

interface MockUserState extends Record<string, unknown> {
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
}

/**
 * Pre-configured mock stores for common scenarios
 */
const mockStores = {
  /**
   * Simple counter store for basic testing
   */
  counter: () =>
    createMockStore<MockCounterState>(
      {
        count: 0,
        step: 1,
        isLoading: false,
      },
      { name: 'mock-counter' }
    ),

  /**
   * Todo list store for complex state testing
   */
  todos: () =>
    createMockStore<MockTodoState>(
      {
        todos: [
          { id: 1, text: 'Test todo', completed: false },
          { id: 2, text: 'Another test', completed: true },
        ],
        filter: 'all',
      },
      { name: 'mock-todos' }
    ),

  /**
   * User authentication store
   */
  user: () =>
    createMockStore<MockUserState>(
      {
        user: null,
        isAuthenticated: false,
      },
      { name: 'mock-user' }
    ),

  /**
   * Persistent store for testing persistence
   */
  persistent: <T extends Record<string, unknown>>(initialState: T) =>
    createMockStore(initialState, {
      name: 'mock-persistent',
      persistence: true,
    }),

  /**
   * Store with DevTools for debugging tests
   */
  withDevTools: <T extends Record<string, unknown>>(initialState: T) =>
    createMockStore(initialState, {
      name: 'mock-devtools',
      devtools: true,
    }),
};

// ============================================================================
// HOOK MOCKS
// ============================================================================

/**
 * Mock implementation of useStore hook for isolated testing
 */
const mockUseStore = <T, R>(
  store: EnhancedStore<T & BaseState>,
  selector: (state: T & BaseState) => R
): R => {
  return selector(store.getState());
};

/**
 * Mock selector functions for testing
 */
const mockSelectors = {
  identity: <T>(state: T) => state,
  count: (state: MockCounterState) => state.count,
  isLoading: (state: { isLoading: boolean }) => state.isLoading,
  todoCount: (state: MockTodoState) => state.todos.length,
  completedTodos: (state: MockTodoState) => state.todos.filter((todo) => todo.completed),
  isAuthenticated: (state: MockUserState) => state.isAuthenticated,
};

// ============================================================================
// STATE GENERATORS
// ============================================================================

/**
 * Generates realistic test data for different state types
 */
const stateGenerators = {
  /**
   * Generate counter state with random values
   */
  counter: (overrides: Partial<MockCounterState> = {}): MockCounterState => ({
    count: Math.floor(Math.random() * 100),
    step: Math.floor(Math.random() * 5) + 1,
    isLoading: Math.random() > 0.5,
    ...overrides,
  }),

  /**
   * Generate todo list with random todos
   */
  todos: (todoCount: number = 3, overrides: Partial<MockTodoState> = {}): MockTodoState => ({
    todos: Array.from({ length: todoCount }, (_, i) => ({
      id: i + 1,
      text: `Test todo ${i + 1}`,
      completed: Math.random() > 0.5,
    })),
    filter: 'all',
    ...overrides,
  }),

  /**
   * Generate user state
   */
  user: (
    authenticated: boolean = false,
    overrides: Partial<MockUserState> = {}
  ): MockUserState => ({
    user: authenticated
      ? {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        }
      : null,
    isAuthenticated: authenticated,
    ...overrides,
  }),
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Utilities for testing state management
 */
const testUtils = {
  /**
   * Wait for store to reach a specific state
   */
  waitForState: async <T>(
    store: EnhancedStore<T>,
    predicate: (state: T) => boolean,
    timeout: number = 1000
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout waiting for state condition after ${timeout}ms`));
      }, timeout);

      const unsubscribe = store.subscribe((state) => {
        if (predicate(state)) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(state);
        }
      });

      // Check current state immediately
      const currentState = store.getState();
      if (predicate(currentState)) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(currentState);
      }
    });
  },

  /**
   * Create a store with pre-defined actions for testing
   */
  createTestStore: <T extends Record<string, unknown>>(
    initialState: T,
    actions: Record<string, (state: T) => Partial<T>>
  ) => {
    const store = createMockStore(initialState);

    const boundActions = Object.entries(actions).reduce(
      (acc, [key, action]) => {
        acc[key] = () => {
          const currentState = store.getState();
          const updates = action(currentState);
          store.setState(updates as Partial<T & BaseState>);
        };
        return acc;
      },
      {} as Record<string, () => void>
    );

    return { store, actions: boundActions };
  },

  /**
   * Assert store state matches expected values
   */
  assertStoreState: <T>(store: EnhancedStore<T>, expected: Partial<T>): void => {
    const actual = store.getState();
    Object.entries(expected).forEach(([key, value]) => {
      expect(actual[key as keyof T]).toEqual(value);
    });
  },

  /**
   * Track state changes for testing
   */
  trackStateChanges: <T>(store: EnhancedStore<T>) => {
    const changes: T[] = [];
    const unsubscribe = store.subscribe((state) => {
      changes.push(state);
    });

    return {
      changes,
      unsubscribe,
      getChangeCount: () => changes.length,
      getLastChange: () => changes[changes.length - 1],
    };
  },
};

// ============================================================================
// MOCK MIDDLEWARE
// ============================================================================

/**
 * Mock middleware for testing middleware interactions
 */
const mockMiddleware = {
  /**
   * Logger middleware that captures logs for testing
   */
  createMockLogger: () => {
    const logs: Array<{ action: string; state: unknown; timestamp: number }> = [];

    return {
      logs,
      middleware: (f: unknown) => (set: unknown, get: unknown, api: unknown) => {
        return (f as (set: unknown, get: unknown, api: unknown) => unknown)(
          (...args: unknown[]) => {
            logs.push({
              action: 'setState',
              state: (get as () => unknown)(),
              timestamp: Date.now(),
            });
            return (set as (...args: unknown[]) => unknown)(...args);
          },
          get,
          api
        );
      },
      clearLogs: () => logs.splice(0, logs.length),
      getLastLog: () => logs[logs.length - 1],
    };
  },

  /**
   * Analytics middleware that captures events for testing
   */
  createMockAnalytics: () => {
    const events: Array<{ type: string; data: unknown; timestamp: number }> = [];

    return {
      events,
      track: (type: string, data: unknown) => {
        events.push({ type, data, timestamp: Date.now() });
      },
      clearEvents: () => events.splice(0, events.length),
      getEventCount: () => events.length,
      getLastEvent: () => events[events.length - 1],
    };
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export type { MockCounterState, MockTodoState, MockUserState };

export {
  createMockStore,
  mockStores,
  mockUseStore,
  mockSelectors,
  stateGenerators,
  testUtils,
  mockMiddleware,
};
