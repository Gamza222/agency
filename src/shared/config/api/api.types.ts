/**
 * API-specific types for HTTP client and request/response handling
 */

/** Supported HTTP methods */
export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/** API request configuration */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  headers?: Record<string, string>;
}

/** Base API error structure */
export interface ApiError {
  message: string;
  code: string;
  statusCode?: number;
  details?: unknown;
}

/** API response wrapper */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

/** Base API request options */
export interface ApiRequestOptions {
  method: ApiMethod;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}
