/**
 * Universal API Types
 *
 * Common interfaces and types that any enterprise application needs.
 * Foundation-level types only - no app-specific interfaces.
 */

// ============================================================================
// COMMON REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper used by most enterprise APIs
 */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

/**
 * Standard error response format
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  timestamp: string;
  requestId?: string;
}

/**
 * Standard pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Standard filter parameters
 */
export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: unknown;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

/**
 * Standard token structure used by most auth systems
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  expiresAt?: string;
}

/**
 * Standard user session info
 */
export interface SessionInfo {
  userId: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

/**
 * Standard file upload response
 */
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

/**
 * File upload progress info
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  timeRemaining?: number;
}

// ============================================================================
// WEBSOCKET MESSAGE TYPES
// ============================================================================

/**
 * Standard WebSocket message structure
 */
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload?: T;
  id?: string;
  timestamp?: string;
  userId?: string;
  requestId?: string;
}

/**
 * WebSocket connection state
 */
export enum ConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTING = 'disconnecting',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * WebSocket configuration
 */
export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  timeout?: number;
  heartbeatInterval?: number;
  enableHeartbeat?: boolean;
}

/**
 * WebSocket subscription
 */
export interface WebSocketSubscription {
  id: string;
  event: string;
  callback: (message: WebSocketMessage) => void;
}

/**
 * WebSocket state enum
 */
export enum WebSocketState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTING = 'disconnecting',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

// ============================================================================
// HTTP CONFIGURATION TYPES
// ============================================================================

/**
 * Standard HTTP client configuration
 */
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  skipAuth?: boolean;
}

/**
 * Request configuration override
 */
export interface RequestConfig extends HttpClientConfig {
  skipRetry?: boolean;
  retryAttempts?: number;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// CACHE TYPES
// ============================================================================

/**
 * Cache configuration options
 */
export interface CacheConfig {
  ttl?: number;
  maxSize?: number;
  strategy?: 'lru' | 'lfu' | 'fifo';
  persistToStorage?: boolean;
  storageKey?: string;
}

/**
 * Cache entry metadata
 */
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl?: number;
  hits: number;
  size?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Standard ID types used across applications
 */
export type ID = string | number;

/**
 * Standard timestamp formats
 */
export type Timestamp = string | number | Date;

/**
 * Standard sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Standard status types
 */
export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

/**
 * Standard loading state
 */
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: ApiError | null;
  isSuccess: boolean;
}

/**
 * Async operation state
 */
export interface AsyncState<T = unknown> extends LoadingState {
  data?: T | null;
  lastUpdated?: Timestamp;
}

// ============================================================================
// AUTH TOKEN CONSTANTS
// ============================================================================

export { AuthTokenKey, getAllAuthTokenKeys, getPrimaryAuthTokenKey } from './authTokens';

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

// Types are already exported as interfaces above
