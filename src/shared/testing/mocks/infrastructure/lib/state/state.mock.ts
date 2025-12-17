/**
 * State Management Mock Utilities
 *
 * Common state-related mocks for testing Zustand stores,
 * subscriptions, and state management patterns.
 */

/**
 * Creates a mock store listener
 */
export const createMockStoreListener = () => {
  const listener = jest.fn();
  return {
    listener,
    getCallCount: () => listener.mock.calls.length,
    getLastCall: () => listener.mock.calls[listener.mock.calls.length - 1] as unknown,
    getCalls: () => listener.mock.calls as unknown[],
    reset: () => listener.mockClear(),
  };
};

/**
 * Creates a mock store listener with expectations
 */
export const createMockStoreListenerWithExpectations = (expectedCalls: number = 1) => {
  const listener = jest.fn();
  listener.mockImplementation(() => {
    expect(listener).toHaveBeenCalledTimes(expectedCalls);
  });
  return {
    listener,
    getCallCount: () => listener.mock.calls.length,
    getLastCall: () => listener.mock.calls[listener.mock.calls.length - 1] as unknown,
    getCalls: () => listener.mock.calls as unknown[],
    reset: () => listener.mockClear(),
  };
};

/**
 * Creates a mock Zustand store
 */
export const createMockZustandStore = <T = unknown>(initialState: T) => {
  let state = initialState;
  const listeners = new Set<() => void>();

  const store = {
    getState: jest.fn(() => state),
    setState: jest.fn((newState: T | ((prev: T) => T)) => {
      if (typeof newState === 'function') {
        state = (newState as (prev: T) => T)(state);
      } else {
        state = newState;
      }
      listeners.forEach((listener) => listener());
    }),
    subscribe: jest.fn((listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }),
    destroy: jest.fn(() => {
      listeners.clear();
    }),
  };

  return {
    store,
    getCurrentState: () => state,
    getListenerCount: () => listeners.size,
    hasListener: (listener: () => void) => listeners.has(listener),
  };
};

/**
 * Creates a mock store selector
 */
export const createMockStoreSelector = <T = unknown, R = unknown>(selector: (state: T) => R) => {
  const mockSelector = jest.fn(selector);
  return {
    selector: mockSelector,
    getCallCount: () => mockSelector.mock.calls.length,
    getLastCall: () => mockSelector.mock.calls[mockSelector.mock.calls.length - 1],
    getCalls: () => mockSelector.mock.calls,
    reset: () => mockSelector.mockClear(),
  };
};

/**
 * Creates a mock store action
 */
export const createMockStoreAction = <T = unknown, R = unknown>(action: (state: T) => R) => {
  const mockAction = jest.fn(action);
  return {
    action: mockAction,
    getCallCount: () => mockAction.mock.calls.length,
    getLastCall: () => mockAction.mock.calls[mockAction.mock.calls.length - 1],
    getCalls: () => mockAction.mock.calls,
    reset: () => mockAction.mockClear(),
  };
};

/**
 * Creates a mock store middleware
 */
export const createMockStoreMiddleware = () => {
  const middleware = jest.fn(
    (config: (set: (args: unknown) => void, get: () => unknown, api: unknown) => unknown) =>
      (set: (args: unknown) => void, get: () => unknown, api: unknown) => {
        return config((args: unknown) => set(args), get, api);
      }
  );

  return {
    middleware,
    getCallCount: () => middleware.mock.calls.length,
    getLastCall: () => middleware.mock.calls[middleware.mock.calls.length - 1],
    getCalls: () => middleware.mock.calls,
    reset: () => middleware.mockClear(),
  };
};
