/**
 * Store Factory Tests
 *
 * Real-life enterprise scenarios testing with minimal mocking.
 * Uses existing mock factory patterns.
 */

import { createSimpleStore, createStore } from './createStore';
import { mockStorage } from '@/shared/testing/mocks/browser';
import { StorageType } from '../types/stateEnums';

// Test interfaces
interface CounterState extends Record<string, unknown> {
  count: number;
  step: number;
  isLoading: boolean;
}

interface TodoState extends Record<string, unknown> {
  todos: Array<{ id: number; text: string; completed: boolean }>;
  filter: 'all' | 'active' | 'completed';
}

describe('Store Factory', () => {
  let mockLocalStorage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    // Create fresh localStorage mock for each test
    mockLocalStorage = mockStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    // Clear any pending timers
    jest.clearAllTimers();
    // Clear mock storage
    mockLocalStorage.clear();
  });

  // ============================================================================
  // BASIC STORE CREATION
  // ============================================================================

  describe('Basic Store Creation', () => {
    it('should create a basic store with initial state', () => {
      // Real scenario: simple counter for any app
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: {
          count: 0,
          step: 1,
          isLoading: false,
        },
      });

      expect(store).toBeDefined();
      expect(typeof store.getState).toBe('function');
      expect(typeof store.setState).toBe('function');
      expect(typeof store.subscribe).toBe('function');
      expect(typeof store.reset).toBe('function');
      expect(typeof store.clearStorage).toBe('function');
    });

    it('should include base state properties', () => {
      // Real scenario: all stores need hydration tracking
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: { count: 0, step: 1, isLoading: false },
      });

      const state = store.getState();
      expect(state).toHaveProperty('_hydrated');
      expect(state._hydrated).toBe(false);
    });

    it('should initialize with correct values', () => {
      // Real scenario: initial state should be preserved
      const initialTodos = [
        { id: 1, text: 'Test todo', completed: false },
        { id: 2, text: 'Another todo', completed: true },
      ];

      const store = createStore<TodoState>({
        name: 'todos',
        initialState: {
          todos: initialTodos,
          filter: 'all',
        },
      });

      const state = store.getState();
      expect(state.todos).toEqual(initialTodos);
      expect(state.filter).toBe('all');
    });
  });

  // ============================================================================
  // STATE UPDATES
  // ============================================================================

  describe('State Updates', () => {
    it('should update state correctly', () => {
      // Real scenario: incrementing counter
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: { count: 0, step: 1, isLoading: false },
      });

      store.setState({ count: 5 });
      expect(store.getState().count).toBe(5);
      expect(store.getState().step).toBe(1); // Other properties preserved
    });

    it('should support functional updates', () => {
      // Real scenario: conditional state updates
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: { count: 0, step: 1, isLoading: false },
      });

      store.setState((state) => ({
        count: state.count + state.step,
      }));

      expect(store.getState().count).toBe(1);
    });

    it('should reset to initial state', () => {
      // Real scenario: reset form or clear data
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: { count: 0, step: 1, isLoading: false },
      });

      store.setState({ count: 10, isLoading: true });
      store.reset();

      const state = store.getState();
      expect(state.count).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state._hydrated).toBe(false); // Base state also reset
    });
  });

  // ============================================================================
  // SUBSCRIPTIONS
  // ============================================================================

  describe('Subscriptions', () => {
    it('should notify subscribers on state change', () => {
      // Real scenario: UI components reacting to state changes
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: { count: 0, step: 1, isLoading: false },
      });

      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);

      store.setState({ count: 1 });

      expect(listener).toHaveBeenCalledTimes(1);
      // Zustand subscribe calls with (newState, prevState)
      expect(listener.mock.calls[0][0]).toEqual(expect.objectContaining({ count: 1 }));

      unsubscribe();
    });

    it('should stop notifications after unsubscribe', () => {
      // Real scenario: component unmounting
      const store = createStore<CounterState>({
        name: 'counter',
        initialState: { count: 0, step: 1, isLoading: false },
      });

      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.setState({ count: 1 });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  describe('Persistence', () => {
    it('should work without persistence', () => {
      // Real scenario: temporary state that doesn't need persistence
      const store = createStore<CounterState>({
        name: 'temp-counter',
        initialState: { count: 0, step: 1, isLoading: false },
      });

      store.setState({ count: 5 });
      expect(mockLocalStorage.getItem('temp-counter')).toBeNull();
    });

    it('should enable persistence when configured', () => {
      // Real scenario: user preferences that should persist
      const store = createStore<CounterState>({
        name: 'persistent-counter',
        initialState: { count: 0, step: 1, isLoading: false },
        persist: {
          key: 'counter-state',
          storage: StorageType.LOCAL_STORAGE,
        },
      });

      expect(store).toBeDefined();
      expect(typeof store.clearStorage).toBe('function');
    });

    it('should clear storage when requested', () => {
      // Real scenario: user logout, clear stored data
      const store = createStore<CounterState>({
        name: 'user-counter',
        initialState: { count: 0, step: 1, isLoading: false },
        persist: {
          key: 'user-counter-data',
          storage: StorageType.LOCAL_STORAGE,
        },
      });

      // Simulate stored data
      mockLocalStorage.setItem('user-counter-data', JSON.stringify({ count: 10 }));

      store.clearStorage();
      expect(mockLocalStorage.getItem('user-counter-data')).toBeNull();
    });

    it('should support sessionStorage', () => {
      // Real scenario: temporary data that should clear on tab close
      const mockSessionStorage = mockStorage();
      Object.defineProperty(window, 'sessionStorage', {
        value: mockSessionStorage,
        writable: true,
      });

      const store = createStore<CounterState>({
        name: 'session-counter',
        initialState: { count: 0, step: 1, isLoading: false },
        persist: {
          key: 'session-data',
          storage: StorageType.SESSION_STORAGE,
        },
      });

      expect(store).toBeDefined();
    });
  });

  // ============================================================================
  // DEVTOOLS
  // ============================================================================

  describe('DevTools Integration', () => {
    it('should work without devtools in production', () => {
      // Real scenario: production build without devtools
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true,
      });

      const store = createStore<CounterState>({
        name: 'prod-counter',
        initialState: { count: 0, step: 1, isLoading: false },
        devtools: true,
      });

      expect(store).toBeDefined();
      expect(store.getState().count).toBe(0);

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    });

    it('should enable devtools in development', () => {
      // Real scenario: development with devtools enabled
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true,
      });

      const store = createStore<CounterState>({
        name: 'dev-counter',
        initialState: { count: 0, step: 1, isLoading: false },
        devtools: true,
      });

      expect(store).toBeDefined();
      expect(store.getState().count).toBe(0);

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    });
  });

  // ============================================================================
  // SIMPLE STORE FACTORY
  // ============================================================================

  describe('Simple Store Factory', () => {
    it('should create simple store with minimal config', () => {
      // Real scenario: quick store for prototyping
      const store = createSimpleStore('simple-counter', { count: 0, step: 1, isLoading: false });

      expect(store).toBeDefined();
      expect(store.getState().count).toBe(0);
      expect(typeof store.setState).toBe('function');
    });

    it('should create simple store with persistence', () => {
      // Real scenario: simple persistent store
      const store = createSimpleStore(
        'persistent-simple',
        { count: 0, step: 1, isLoading: false },
        true
      );

      expect(store).toBeDefined();
      expect(typeof store.clearStorage).toBe('function');
    });

    it('should work without persistence', () => {
      // Real scenario: temporary simple store
      const store = createSimpleStore(
        'temp-simple',
        { count: 0, step: 1, isLoading: false },
        false
      );

      expect(store).toBeDefined();
      expect(store.getState().count).toBe(0);
    });
  });

  // ============================================================================
  // COMPLEX STATE SCENARIOS
  // ============================================================================

  describe('Complex State Scenarios', () => {
    it('should handle complex nested state', () => {
      // Real scenario: complex application state
      interface AppState extends Record<string, unknown> {
        user: {
          id: string;
          name: string;
          preferences: {
            theme: 'light' | 'dark';
            language: string;
          };
        } | null;
        ui: {
          sidebarOpen: boolean;
          currentRoute: string;
        };
        data: {
          loading: boolean;
          error: string | null;
        };
      }

      const store = createStore<AppState>({
        name: 'app-state',
        initialState: {
          user: null,
          ui: {
            sidebarOpen: false,
            currentRoute: '/',
          },
          data: {
            loading: false,
            error: null,
          },
        },
      });

      // Update nested state
      store.setState((state) => ({
        user: {
          id: '123',
          name: 'John Doe',
          preferences: {
            theme: 'dark',
            language: 'en',
          },
        },
        ui: {
          ...state.ui,
          sidebarOpen: true,
        },
      }));

      const state = store.getState();
      expect(state.user?.name).toBe('John Doe');
      expect(state.ui.sidebarOpen).toBe(true);
      expect(state.data.loading).toBe(false); // Preserved
    });

    it('should handle array operations', () => {
      // Real scenario: managing lists of items
      const store = createStore<TodoState>({
        name: 'todos',
        initialState: {
          todos: [],
          filter: 'all',
        },
      });

      // Add todo
      store.setState((state) => ({
        todos: [...state.todos, { id: 1, text: 'New todo', completed: false }],
      }));

      // Toggle todo
      store.setState((state) => ({
        todos: state.todos.map((todo) => (todo.id === 1 ? { ...todo, completed: true } : todo)),
      }));

      // Remove todo
      store.setState((state) => ({
        todos: state.todos.filter((todo) => todo.id !== 1),
      }));

      expect(store.getState().todos).toHaveLength(0);
    });
  });
});

describe('Store Factory Integration', () => {
  it('should work with real-world usage patterns', () => {
    // Real scenario: user authentication store
    interface AuthState extends Record<string, unknown> {
      user: { id: string; email: string } | null;
      token: string | null;
      isAuthenticated: boolean;
      loading: boolean;
    }

    const authStore = createStore<AuthState>({
      name: 'auth',
      initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      },
      persist: {
        key: 'auth-data',
        storage: StorageType.LOCAL_STORAGE,
      },
      devtools: true,
    });

    // Login flow
    authStore.setState({ loading: true });
    authStore.setState({
      user: { id: '123', email: 'user@example.com' },
      token: 'abc123',
      isAuthenticated: true,
      loading: false,
    });

    // Logout flow
    authStore.reset();

    const state = authStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
