/**
 * Next.js Server Mock Setup
 *
 * Provides Jest mock setup for Next.js server components.
 * This file should be imported in test files that need Next.js server mocks.
 */

import { MockNextRequest } from './nextRequest.mock';
import { MockNextResponse } from './nextResponse.mock';

// Jest mock for next/server module
jest.mock('next/server', () => ({
  NextRequest: MockNextRequest,
  NextResponse: MockNextResponse,
}));

// Export the mock classes for direct use in tests
export { MockNextRequest, MockNextResponse };
