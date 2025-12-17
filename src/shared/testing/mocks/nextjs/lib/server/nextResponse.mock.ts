/**
 * NextResponse Mock for Testing
 *
 * Provides a mock implementation of Next.js NextResponse for testing environments.
 * Simulates response objects with status, headers, and static methods.
 */

import { mockNextResponseInterface, mockNextResponseOptionsInterface } from '../../types/types';

export class MockNextResponse implements mockNextResponseInterface {
  status: number;
  headers: {
    set: jest.Mock;
    get: jest.Mock;
  };

  constructor(_body?: unknown, options: mockNextResponseOptionsInterface = {}) {
    this.status = options.status || 200;
    this.headers = {
      set: jest.fn(),
      get: jest.fn(),
    };
  }

  static next(): mockNextResponseInterface {
    return new MockNextResponse();
  }
}

// Factory function for creating mock responses
export const createMockNextResponse = (
  body?: unknown,
  options: mockNextResponseOptionsInterface = {}
): mockNextResponseInterface => new MockNextResponse(body, options);
