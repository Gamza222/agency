// Local type definition (moved from error types that was cleaned up)
type mockWindowReloadType = () => jest.Mock;

/**
 * WindowLocationReload.mock.ts
 *
 * This provides mock implementation for window.location.reload to prevent actual page reloads in tests.
 *
 * @usage
 * - Use mockWindowLocationReload when you need to test reload behavior without triggering a real page reload.
 * - Returns a Jest mock function that can be spied on to verify reload calls.
 *
 * @safety
 * This mock prevents accidental page reloads during testing that would interrupt the test suite.
 *
 * @example
 * ```typescript
 * import { mockWindowLocationReload } from '@jestmocks/browser';
 *
 * const mockReload = mockWindowLocationReload();
 * // ... trigger action that should reload
 * expect(mockReload).toHaveBeenCalled();
 * ```
 */

/**
 * Creates a mock for window.location.reload
 *
 * @returns Mock function that replaces window.location.reload
 */
export const mockWindowLocationReload: mockWindowReloadType = () => {
  const mockReload = jest.fn();

  // Replace the actual reload method with our mock
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
      reload: mockReload,
    },
    writable: true,
  });

  return mockReload;
};
