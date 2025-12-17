/**
 * NextRequest Mock for Testing
 *
 * Provides a mock implementation of Next.js NextRequest for testing environments.
 * Simulates request objects with headers, method, and URL properties.
 */

import { mockNextRequestInterface, mockNextRequestOptionsInterface } from '../../types/types';

export class MockNextRequest implements mockNextRequestInterface {
  url: string;
  method: string;
  headers: Map<string, string>;

  constructor(url: string, options: mockNextRequestOptionsInterface = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Map();

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        this.headers.set(key, value);
      });
    }
  }

  get(name: string): string | null {
    return this.headers.get(name) || null;
  }
}

// Factory function for creating mock requests
export const createMockNextRequest = (
  url: string,
  options: mockNextRequestOptionsInterface = {}
): mockNextRequestInterface => new MockNextRequest(url, options);
