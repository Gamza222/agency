/**
 * React Testing Mock Utilities
 *
 * Common React-related mocks for testing hooks,
 * components, and rendering patterns.
 */

/**
 * Creates a mock render counter for testing re-renders
 */
export const createMockRenderCounter = () => {
  const renderCount = jest.fn();
  return {
    renderCount,
    getRenderCount: () => renderCount.mock.calls.length,
    reset: () => renderCount.mockClear(),
  };
};

/**
 * Creates a mock render counter with expectations
 */
export const createMockRenderCounterWithExpectations = (expectedRenders: number) => {
  const renderCount = jest.fn();
  renderCount.mockImplementation(() => {
    expect(renderCount).toHaveBeenCalledTimes(expectedRenders);
  });
  return {
    renderCount,
    getRenderCount: () => renderCount.mock.calls.length,
    reset: () => renderCount.mockClear(),
  };
};

/**
 * Mock React component props
 */
export const createMockComponentProps = <T extends Record<string, unknown>>(
  overrides: Partial<T> = {}
): T =>
  ({
    ...overrides,
  }) as T;

/**
 * Mock React ref
 */
export const createMockRef = <T = unknown>(initialValue?: T) => {
  const ref = { current: initialValue as T };
  return {
    ref,
    setValue: (value: T) => {
      ref.current = value;
    },
    getValue: () => ref.current,
  };
};

/**
 * Mock React callback ref
 */
export const createMockCallbackRef = () => {
  const callback = jest.fn();
  return {
    callback,
    getLastValue: () => (callback.mock.calls[callback.mock.calls.length - 1] as unknown[])?.[0],
    getCallCount: () => callback.mock.calls.length,
  };
};

/**
 * Mock React state setter
 */
export const createMockStateSetter = <T = unknown>(initialValue?: T) => {
  const setState = jest.fn();
  let currentValue = initialValue;

  setState.mockImplementation((newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === 'function') {
      currentValue = (newValue as (prev: T) => T)(currentValue as T);
    } else {
      currentValue = newValue;
    }
  });

  return {
    setState,
    getCurrentValue: () => currentValue,
    getCallCount: () => setState.mock.calls.length,
    getLastCall: () => setState.mock.calls[setState.mock.calls.length - 1] as unknown,
  };
};

/**
 * Mock React effect cleanup function
 */
export const createMockEffectCleanup = () => {
  const cleanup = jest.fn();
  return {
    cleanup,
    wasCalled: () => cleanup.mock.calls.length > 0,
    getCallCount: () => cleanup.mock.calls.length,
  };
};
