import { mockLocationInterface } from '../../types/types';

const mockLocation = (initialUrl: string = 'http://localhost/'): mockLocationInterface => {
  const url = new URL(initialUrl);

  const locationMock: mockLocationInterface = {
    ...url,
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    ancestorOrigins: {
      length: 0,
      contains: () => false,
      item: () => null,
      [Symbol.iterator]: jest.fn(),
    },
    toString: () => url.toString(),
    // Ensure pathname is explicitly set
    pathname: url.pathname,
    href: url.href,
    origin: url.origin,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    search: url.search,
    hash: url.hash,
  };

  // Allows properties to be modified in tests
  Object.defineProperty(window, 'location', {
    value: locationMock,
    writable: true,
  });

  return locationMock;
};

// Initialize the global mock
mockLocation();

export { mockLocation };
