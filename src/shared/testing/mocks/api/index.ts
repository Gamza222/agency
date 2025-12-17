/**
 * API Mocks
 *
 * Type: 📦 MANUAL
 *
 * This file exports all mocks for API/network clients that need to be manually imported
 * and configured in tests.
 *
 * These are MANUAL mocks - they use named exports for functions that need to be imported
 * and controlled in tests.
 */

// ============================================================================
// GRAPHQL MOCKS
// ============================================================================

export { mockGraphQLClient, mockGraphQLClientInstance } from './lib/graphql/graphQLClient.mock';

// ============================================================================
// WEBSOCKET MOCKS
// ============================================================================

export { WebSocketMock } from './lib/websocket/webSocket.mock';
export { createWebSocketMock as mockWebSocket } from './lib/websocket/webSocket.mock';

// ============================================================================
// TYPES
// ============================================================================

export type {
  mockGraphQLOperationInterface,
  mockGraphQLResponseInterface,
  mockWebSocketMessageInterface,
  mockWebSocketInstanceInterface,
  mockGraphQLCacheInterface,
} from './types/types';
