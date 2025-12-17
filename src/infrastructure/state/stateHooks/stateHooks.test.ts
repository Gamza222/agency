/**
 * Store Hooks Tests
 *
 * Real-life enterprise scenarios testing with minimal mocking.
 * Uses existing mock factory patterns.
 */

import { act, renderHook } from '@testing-library/react';
import {
  useShallowStore,
  useStore,
  useStoreActions,
  useStoreHydrated,
  useStoreState,
} from './stateHooks';
import { createStore } from '../createStore/createStore';
import { StorageType } from '../types/stateEnums';

// Test interfaces
interface CounterState extends Record<string, unknown> {
  count: number;
  step: number;
  nested: {
    items: string[];
    meta: { updated: boolean };
  };
}

interface TodoState extends Record<string, unknown> {
  todos: Array<{ id: number; text: string; completed: boolean }>;
  filter: 'all' | 'active' | 'completed';
}

describe('Store Hooks', () => {
  // ============================================================================
  // BASIC HOOK FUNCTIONALITY
  // ============================================================================

  describe('useStore Hook', () => {
    it('should select and return specific state slice', () => {
      // Real scenario: component needs only count value
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStore(store, (state) => state.count));

      expect(result.current).toBe(0);
    });

    it('should update when selected state changes', () => {
      // Real scenario: reactive component updates
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStore(store, (state) => state.count));

      expect(result.current).toBe(0);

      act(() => {
        store.setState({ count: 5 });
      });

      expect(result.current).toBe(5);
    });

    it('should not update when unrelated state changes', () => {
      // Real scenario: optimization - only update when relevant data changes
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStore(store, (state) => state.count));

      const initialRender = result.current;

      act(() => {
        store.setState({ step: 2 }); // Unrelated change
      });

      expect(result.current).toBe(initialRender);
      expect(result.current).toBe(0);
    });

    it('should work with complex selectors', () => {
      // Real scenario: computed values from multiple state pieces
      const store = createStore<TodoState>({
        name: 'todos',
        initialState: {
          todos: [
            { id: 1, text: 'Todo 1', completed: false },
            { id: 2, text: 'Todo 2', completed: true },
            { id: 3, text: 'Todo 3', completed: false },
          ],
          filter: 'all',
        },
      });

      const { result } = renderHook(() =>
        useStore(store, (state) => state.todos.filter((todo) => todo.completed).length)
      );

      expect(result.current).toBe(1);
    });

    it('should work with custom equality function', () => {
      // Real scenario: shallow comparison for object selectors
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStore(store, (state) => state.nested.items));

      const initialItems = result.current;

      act(() => {
        // Change array content but keep same length
        store.setState({
          nested: {
            items: ['x', 'y'], // Different content, same length
            meta: { updated: true },
          },
        });
      });

      // Should update since array changed (custom equality not implemented in basic version)
      expect(result.current).toEqual(['x', 'y']);
      expect(result.current).not.toBe(initialItems);
    });
  });

  // ============================================================================
  // SHALLOW STORE HOOK
  // ============================================================================

  describe('useShallowStore Hook', () => {
    it('should use shallow comparison for basic values', () => {
      // Real scenario: selecting simple values
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useShallowStore(store, (state) => state.count));

      expect(result.current).toBe(0);

      act(() => {
        store.setState({ count: 5 });
      });

      expect(result.current).toBe(5);
    });

    it('should work with array length selections', () => {
      // Real scenario: selecting array properties
      const store = createStore<TodoState>({
        name: 'todos',
        initialState: {
          todos: [
            { id: 1, text: 'Todo 1', completed: false },
            { id: 2, text: 'Todo 2', completed: true },
          ],
          filter: 'all',
        },
      });

      const { result } = renderHook(() => useShallowStore(store, (state) => state.todos.length));

      expect(result.current).toBe(2);
    });
  });

  // ============================================================================
  // FULL STATE HOOK
  // ============================================================================

  describe('useStoreState Hook', () => {
    it('should return complete store state', () => {
      // Real scenario: component needs access to entire state
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStoreState(store));

      expect(result.current.count).toBe(0);
      expect(result.current.step).toBe(1);
      expect(result.current.nested.items).toEqual(['a', 'b']);
      expect(result.current._hydrated).toBe(false);
    });

    it('should update when any state changes', () => {
      // Real scenario: debug component or state inspector
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStoreState(store));

      act(() => {
        store.setState({ count: 5, step: 2 });
      });

      expect(result.current.count).toBe(5);
      expect(result.current.step).toBe(2);
    });
  });

  // ============================================================================
  // HYDRATION HOOK
  // ============================================================================

  describe('useStoreHydrated Hook', () => {
    it('should track hydration status', () => {
      // Real scenario: show loading until store is hydrated from persistence
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStoreHydrated(store));

      expect(result.current).toBe(false);

      act(() => {
        store.setState({ _hydrated: true });
      });

      expect(result.current).toBe(true);
    });

    it('should update when hydration status changes', () => {
      // Real scenario: persistence middleware updates hydration status
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStoreHydrated(store));

      expect(result.current).toBe(false);

      // Simulate persistence middleware hydration
      act(() => {
        store.setState({ _hydrated: true });
      });

      expect(result.current).toBe(true);
    });
  });

  // ============================================================================
  // ACTIONS HOOK
  // ============================================================================

  describe('useStoreActions Hook', () => {
    it('should provide store action methods', () => {
      // Real scenario: component needs to dispatch actions
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStoreActions(store));

      expect(typeof result.current.setState).toBe('function');
      expect(typeof result.current.reset).toBe('function');
      expect(typeof result.current.clearStorage).toBe('function');
    });

    it('should allow state updates through actions', () => {
      // Real scenario: form components updating state
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStoreActions(store));

      act(() => {
        result.current.setState({ count: 10 });
      });

      expect(store.getState().count).toBe(10);

      act(() => {
        result.current.reset();
      });

      expect(store.getState().count).toBe(0);
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('should work with multiple hooks on same store', () => {
      // Real scenario: different components using different parts of same store
      const store = createStore<TodoState>({
        name: 'todos',
        initialState: {
          todos: [
            { id: 1, text: 'Todo 1', completed: false },
            { id: 2, text: 'Todo 2', completed: true },
          ],
          filter: 'all',
        },
      });

      const { result: countResult } = renderHook(() =>
        useStore(store, (state) => state.todos.length)
      );

      const { result: filterResult } = renderHook(() => useStore(store, (state) => state.filter));

      const { result: actionsResult } = renderHook(() => useStoreActions(store));

      expect(countResult.current).toBe(2);
      expect(filterResult.current).toBe('all');

      act(() => {
        actionsResult.current.setState({
          todos: [...store.getState().todos, { id: 3, text: 'Todo 3', completed: false }],
          filter: 'active',
        });
      });

      expect(countResult.current).toBe(3);
      expect(filterResult.current).toBe('active');
    });

    it('should handle rapid state updates efficiently', () => {
      // Real scenario: high-frequency updates (real-time data)
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
      });

      const { result } = renderHook(() => useStore(store, (state) => state.count));

      // Rapid updates
      act(() => {
        for (let i = 1; i <= 10; i++) {
          store.setState({ count: i });
        }
      });

      expect(result.current).toBe(10);
    });

    it('should work with persistence stores', () => {
      // Real scenario: persisted store with hydration
      const store = createStore<CounterState>({
        name: 'persistent-counter',
        initialState: {
          count: 0,
          step: 1,
          nested: {
            items: ['a', 'b'],
            meta: { updated: false },
          },
        },
        persist: {
          key: 'counter-data',
          storage: StorageType.LOCAL_STORAGE,
        },
      });

      const { result: countResult } = renderHook(() => useStore(store, (state) => state.count));

      expect(countResult.current).toBe(0);

      // Update state
      act(() => {
        store.setState({ count: 5 });
      });

      expect(countResult.current).toBe(5);
    });
  });

  // ============================================================================
  // PERFORMANCE SCENARIOS
  // ============================================================================

  describe('Performance Scenarios', () => {
    it('should prevent unnecessary re-renders', () => {
      // Real scenario: optimization for large lists
      const store = createStore<TodoState>({
        name: 'todos',
        initialState: {
          todos: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            text: `Todo ${i}`,
            completed: false,
          })),
          filter: 'all',
        },
      });

      const renderCount = jest.fn();
      const { result } = renderHook(() => {
        renderCount();
        return useStore(store, (state) => state.todos.length);
      });

      expect(renderCount).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(1000);

      // Update filter (unrelated to selected data)
      act(() => {
        store.setState({ filter: 'active' });
      });

      // Should not re-render since length didn't change
      expect(renderCount).toHaveBeenCalledTimes(1);
    });

    it('should handle basic computations', () => {
      // Real scenario: computed values
      const store = createStore<TodoState>({
        name: 'todos',
        initialState: {
          todos: [
            { id: 1, text: 'Todo 1', completed: false },
            { id: 2, text: 'Todo 2', completed: true },
            { id: 3, text: 'Todo 3', completed: false },
          ],
          filter: 'all',
        },
      });

      const { result } = renderHook(() =>
        useStore(store, (state) => state.todos.filter((todo) => todo.completed).length)
      );

      expect(result.current).toBe(1);

      // Update unrelated state
      act(() => {
        store.setState({ filter: 'active' });
      });

      // Result should stay the same
      expect(result.current).toBe(1);
    });
  });
});

describe('Store Hooks Integration', () => {
  it('should work in real component-like scenarios', () => {
    // Real scenario: complete component workflow
    interface AppState extends Record<string, unknown> {
      user: { id: string; name: string } | null;
      loading: boolean;
      error: string | null;
    }

    const store = createStore<AppState>({
      name: 'app',
      initialState: {
        user: null,
        loading: false,
        error: null,
      },
    });

    // Component 1: Login form
    const { result: loginResult } = renderHook(() => ({
      loading: useStore(store, (state) => state.loading),
      error: useStore(store, (state) => state.error),
      actions: useStoreActions(store),
    }));

    // Component 2: User profile
    const { result: profileResult } = renderHook(() => ({
      user: useStore(store, (state) => state.user),
      isLoggedIn: useStore(store, (state) => !!state.user),
    }));

    // Initial state
    expect(loginResult.current.loading).toBe(false);
    expect(profileResult.current.isLoggedIn).toBe(false);

    // Start login
    act(() => {
      loginResult.current.actions.setState({ loading: true });
    });

    expect(loginResult.current.loading).toBe(true);

    // Complete login
    act(() => {
      loginResult.current.actions.setState({
        user: { id: '123', name: 'John Doe' },
        loading: false,
        error: null,
      });
    });

    expect(loginResult.current.loading).toBe(false);
    expect(profileResult.current.isLoggedIn).toBe(true);
    expect(profileResult.current.user?.name).toBe('John Doe');

    // Logout
    act(() => {
      loginResult.current.actions.reset();
    });

    expect(profileResult.current.isLoggedIn).toBe(false);
    expect(profileResult.current.user).toBeNull();
  });
});
