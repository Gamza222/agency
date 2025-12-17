/**
 * Next.js Mocks
 *
 * Type: 📦 MANUAL
 *
 * This file exports all mocks for Next.js server components that need to be manually imported
 * and configured in tests.
 *
 * These are MANUAL mocks - they use named exports for functions that need to be imported
 * and controlled in tests.
 */

// ============================================================================
// SERVER MOCKS
// ============================================================================

export { MockNextRequest, createMockNextRequest } from './lib/server/nextRequest.mock';
export { MockNextResponse, createMockNextResponse } from './lib/server/nextResponse.mock';
export {
  MockNextRequest as MockNextServerRequest,
  MockNextResponse as MockNextServerResponse,
} from './lib/server/nextServer.mock';

// ============================================================================
// TYPES
// ============================================================================

export type {
  mockNextRequestInterface,
  mockNextRequestOptionsInterface,
  mockNextResponseInterface,
  mockNextResponseOptionsInterface,
  mockNextServerInterface,
} from './types/types';
