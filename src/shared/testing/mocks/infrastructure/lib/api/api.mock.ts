/**
 * API Mock Utilities
 *
 * Common API-related mocks for testing HTTP responses,
 * middleware, and API interactions.
 */

/**
 * Creates a mock HTTP response object
 */
export const createMockResponse = (overrides: Partial<Response> = {}) => ({
  headers: {
    set: jest.fn(),
    get: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    [Symbol.iterator]: jest.fn(),
  },
  status: 200,
  statusText: 'OK',
  ok: true,
  url: 'http://localhost:3000/api/test',
  redirected: false,
  type: 'basic' as ResponseType,
  body: null,
  bodyUsed: false,
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  formData: jest.fn(),
  json: jest.fn(),
  text: jest.fn(),
  clone: jest.fn(),
  ...overrides,
});

/**
 * Creates a mock Next.js response object
 */
export const createMockNextResponse = (overrides: Record<string, unknown> = {}) => ({
  headers: {
    set: jest.fn(),
    get: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    [Symbol.iterator]: jest.fn(),
  },
  status: 200,
  statusText: 'OK',
  ok: true,
  url: 'http://localhost:3000/api/test',
  redirected: false,
  type: 'basic',
  body: null,
  bodyUsed: false,
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  formData: jest.fn(),
  json: jest.fn(),
  text: jest.fn(),
  clone: jest.fn(),
  ...overrides,
});

/**
 * Creates a mock HTTP request object
 */
export const createMockRequest = (overrides: Partial<Request> = {}) => ({
  method: 'GET',
  url: 'http://localhost:3000/api/test',
  headers: new Headers(),
  body: null,
  bodyUsed: false,
  cache: 'default' as RequestCache,
  credentials: 'same-origin' as RequestCredentials,
  destination: '',
  integrity: '',
  keepalive: false,
  mode: 'cors' as RequestMode,
  redirect: 'follow' as RequestRedirect,
  referrer: '',
  referrerPolicy: 'no-referrer' as ReferrerPolicy,
  signal: new AbortSignal(),
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  formData: jest.fn(),
  json: jest.fn(),
  text: jest.fn(),
  clone: jest.fn(),
  ...overrides,
});

/**
 * Creates a mock API error response
 */
export const createMockApiError = (
  status: number = 500,
  message: string = 'Internal Server Error'
) => ({
  status,
  statusText: message,
  ok: false,
  headers: {
    set: jest.fn(),
    get: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    [Symbol.iterator]: jest.fn(),
  },
  url: 'http://localhost:3000/api/error',
  redirected: false,
  type: 'error' as ResponseType,
  body: null,
  bodyUsed: false,
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  formData: jest.fn(),
  json: jest.fn().mockResolvedValue({ error: message }),
  text: jest.fn().mockResolvedValue(message),
  clone: jest.fn(),
});

/**
 * Creates a mock fetch function
 */
export const createMockFetch = (responses: Response[] = []) => {
  let callCount = 0;
  const mockFetch = jest.fn();

  responses.forEach((response) => {
    mockFetch.mockResolvedValueOnce(response);
  });

  // Default response for any additional calls
  mockFetch.mockResolvedValue(createMockResponse());

  return {
    fetch: mockFetch,
    getCallCount: () => callCount++,
    getCalls: () => mockFetch.mock.calls as unknown[],
    getLastCall: () => mockFetch.mock.calls[mockFetch.mock.calls.length - 1] as unknown,
  };
};
