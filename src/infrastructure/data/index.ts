/**
 * Data Layer
 *
 * Enterprise-grade API clients and data management for any application.
 */

// Apollo GraphQL client
export { apolloClient } from './apollo/apolloClient';

// Axios REST client
export { axiosClient } from './axios/axiosClient';

// React Query client
export { queryClient } from './react-query/queryClient';

// WebSocket client
export { WebSocketClient, createWebSocketClient } from './websocket/websocketClient';

// Types
export type {
  ApiResponse,
  ApiError,
  RequestConfig,
  HttpClientConfig,
  WebSocketMessage,
  ConnectionState,
  LoadingState as DataLoadingState,
  AsyncState,
} from './types/types';
