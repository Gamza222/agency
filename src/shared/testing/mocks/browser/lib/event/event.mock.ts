/**
 * Event Mock Utilities
 *
 * Common event-related mocks for testing event listeners,
 * event emission, and event handling patterns.
 */

/**
 * Creates a mock event listener function
 */
export const createMockEventListener = () => jest.fn();

/**
 * Creates a mock event listener with specific call expectations
 */
export const createMockEventListenerWithExpectations = (expectedCalls: number = 1) => {
  const mockListener = jest.fn();
  mockListener.mockImplementation(() => {
    expect(mockListener).toHaveBeenCalledTimes(expectedCalls);
  });
  return mockListener;
};

/**
 * Creates a mock event listener that tracks call arguments
 */
export const createMockEventListenerWithTracking = () => {
  const mockListener = jest.fn();
  const calls: unknown[][] = [];

  mockListener.mockImplementation((...args: unknown[]) => {
    calls.push(args);
  });

  return {
    listener: mockListener,
    getCalls: () => calls as unknown[],
    getLastCall: () => calls[calls.length - 1] as unknown,
    getCallCount: () => calls.length,
  };
};

/**
 * Mock event object factory
 */
export const createMockEvent = (type: string, data?: unknown) => ({
  type,
  data,
  timestamp: Date.now(),
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
});

/**
 * Mock event emitter for testing
 */
export const createMockEventEmitter = () => {
  const listeners = new Map<string, jest.Mock[]>();

  return {
    addEventListener: jest.fn((event: string, listener: jest.Mock) => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        eventListeners.push(listener);
      }
    }),

    removeEventListener: jest.fn((event: string, listener: jest.Mock) => {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    }),

    emit: jest.fn((event: string, data?: unknown) => {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        eventListeners.forEach((listener) => (listener as (data: unknown) => void)(data));
      }
    }),

    getListeners: (event: string) => (listeners.get(event) || []) as unknown[],
    hasListeners: (event: string) => (listeners.get(event)?.length || 0) > 0,
  };
};
