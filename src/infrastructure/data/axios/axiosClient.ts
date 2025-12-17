/**
 * Axios REST Client Configuration
 *
 * Universal REST client foundation that can be used by any enterprise application.
 * Provides comprehensive error handling, authentication, retry logic, and monitoring.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AuthTokenKey } from '../types/types';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

// Import centralized environment configuration
import { envConfig } from '../../../../config/env';

const API_BASE_URL = envConfig.apiUrl;
const DEFAULT_TIMEOUT = 10000; // Will be updated to use envConfig when method is available
const MAX_RETRY_ATTEMPTS = 3; // Will be updated to use envConfig when method is available

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipRetry?: boolean;
  retryAttempts?: number;
}

interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  timestamp: string;
  requestId?: string;
}

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

/**
 * Universal retry logic with exponential backoff
 */
const shouldRetry = (error: AxiosError): boolean => {
  // Don't retry in test environments
  if (envConfig.isTest || process.env.JEST_WORKER_ID) {
    return false;
  }

  // Don't retry if explicitly disabled
  const config = error.config as RequestConfig | undefined;
  if (config?.skipRetry) {
    return false;
  }

  // Don't retry client errors (4xx), only server errors (5xx) and network errors
  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    return false;
  }

  // Retry on network errors or server errors
  return !error.response || error.response.status >= 500;
};

const calculateDelay = (attemptNumber: number): number => {
  // Exponential backoff with jitter
  const baseDelay = Math.min(1000 * 2 ** attemptNumber, 10000);
  const jitter = Math.random() * 0.1 * baseDelay;
  return baseDelay + jitter;
};

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

/**
 * Universal token retrieval that works with any auth system
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try multiple token storage locations
  return (
    localStorage.getItem(AuthTokenKey.AUTH_TOKEN) ||
    localStorage.getItem(AuthTokenKey.ACCESS_TOKEN) ||
    sessionStorage.getItem(AuthTokenKey.AUTH_TOKEN) ||
    sessionStorage.getItem(AuthTokenKey.ACCESS_TOKEN) ||
    null
  );
};

/**
 * Clear authentication tokens
 */
const clearAuthTokens = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AuthTokenKey.AUTH_TOKEN as string);
  localStorage.removeItem(AuthTokenKey.ACCESS_TOKEN as string);
  sessionStorage.removeItem(AuthTokenKey.AUTH_TOKEN as string);
  sessionStorage.removeItem(AuthTokenKey.ACCESS_TOKEN as string);
};

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Universal request interceptor for authentication and headers
 */
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const requestConfig = config as InternalAxiosRequestConfig & RequestConfig;

  // Add authentication header unless explicitly skipped
  if (!requestConfig.skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Add universal headers
  requestConfig.headers['Content-Type'] =
    requestConfig.headers['Content-Type'] || 'application/json';
  requestConfig.headers['X-Client-Name'] = 'axios-client';
  requestConfig.headers['X-Client-Version'] = '1.0.0';
  requestConfig.headers['X-Request-ID'] = generateRequestId();

  // Add timestamp for monitoring
  const configWithMetadata = requestConfig as AxiosRequestConfig & {
    metadata?: { startTime?: number };
  };
  configWithMetadata.metadata = {
    ...configWithMetadata.metadata,
    startTime: Date.now(),
  };

  return requestConfig;
};

// ============================================================================
// RESPONSE INTERCEPTORS
// ============================================================================

/**
 * Universal success response interceptor
 */
const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Calculate request duration
  const configWithMetadata = response.config as AxiosRequestConfig & {
    metadata?: { startTime?: number };
  };
  const startTime = configWithMetadata.metadata?.startTime;
  const duration = startTime ? Date.now() - startTime : 0;

  // Performance monitoring data
  const performanceData = {
    url: response.config.url,
    method: response.config.method?.toUpperCase(),
    status: response.status,
    duration,
    timestamp: new Date().toISOString(),
  };

  // Log performance data (only in non-test environments)
  if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
    // [REST Performance]: ${JSON.stringify(performanceData)}
  }

  // Custom performance tracking hook for consuming apps
  if (typeof window !== 'undefined') {
    const windowWithTracker = window as Window & {
      __REST_PERFORMANCE_TRACKER__?: (data: unknown) => void;
    };
    if (windowWithTracker.__REST_PERFORMANCE_TRACKER__) {
      windowWithTracker.__REST_PERFORMANCE_TRACKER__(performanceData);
    }
  }

  return response;
};

/**
 * Universal error response interceptor with retry logic
 */
const errorInterceptor = async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
  const config = error.config as InternalAxiosRequestConfig & RequestConfig;

  if (!config) {
    return Promise.reject(error);
  }

  // Initialize retry attempt counter
  config.retryAttempts = config.retryAttempts || 0;

  // Handle specific error cases
  if (error.response) {
    const { status, data } = error.response;

    // Handle authentication errors
    if (status === 401) {
      clearAuthTokens();

      // Custom auth error handler for consuming apps
      if (typeof window !== 'undefined') {
        const windowWithAuthHandler = window as Window & {
          __AUTH_ERROR_HANDLER__?: (error: unknown) => void;
        };
        if (windowWithAuthHandler.__AUTH_ERROR_HANDLER__) {
          windowWithAuthHandler.__AUTH_ERROR_HANDLER__(error);
        }
      }
    }

    // Handle authorization errors
    if (status === 403) {
      if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
        console.warn('[REST] Access forbidden:', {
          url: config.url,
          method: config.method,
          data,
        });
      }
    }

    // Handle rate limiting
    if (status === 429) {
      if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
        console.warn('[REST] Rate limited:', {
          url: config.url,
          method: config.method,
          retryAfter: error.response.headers['retry-after'] as string | undefined,
        });
      }
    }
  }

  // Retry logic
  if (shouldRetry(error) && config.retryAttempts < MAX_RETRY_ATTEMPTS) {
    config.retryAttempts++;

    const delay = calculateDelay(config.retryAttempts);

    // Only log in non-test environments
    if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
      // [REST] Retrying request (attempt ${config.retryAttempts}) after ${delay}ms: ${JSON.stringify({url: config.url, method: config.method})}
    }

    await new Promise((resolve) => setTimeout(resolve, delay));

    return axiosClient(config);
  }

  // Create standardized error object
  const apiError: ApiError = {
    message: error.message,
    timestamp: new Date().toISOString(),
  };

  // Add optional properties if they exist
  if (error.code) apiError.code = error.code;
  if (error.response?.status) apiError.statusCode = error.response.status;
  if (error.response?.data) apiError.details = error.response.data;
  if (config.headers['X-Request-ID']) apiError.requestId = config.headers['X-Request-ID'] as string;

  // Log error for debugging (only in non-test environments)
  if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
    console.error('[REST Error]:', {
      ...apiError,
      url: config.url,
      method: config.method,
    });
  }

  // Custom error handler for consuming apps
  if (typeof window !== 'undefined') {
    const windowWithErrorHandler = window as Window & {
      __REST_ERROR_HANDLER__?: (error: unknown) => void;
    };
    if (windowWithErrorHandler.__REST_ERROR_HANDLER__) {
      windowWithErrorHandler.__REST_ERROR_HANDLER__(apiError);
    }
  }

  return Promise.reject(apiError);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique request ID for tracking
 */
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// AXIOS CLIENT CONFIGURATION
// ============================================================================

/**
 * Universal Axios client configuration suitable for any enterprise application
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // Universal configurations
  validateStatus: (status) => status >= 200 && status < 300,
  maxRedirects: 5,
  // Enable request/response transformation
  transformRequest: [
    (data, headers) => {
      // Universal request transformation
      if (typeof data === 'object' && data !== null) {
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
      }
      return data as string;
    },
  ],
  transformResponse: [
    (data) => {
      // Universal response transformation
      try {
        return typeof data === 'string' ? (JSON.parse(data) as unknown) : (data as unknown);
      } catch {
        return data as unknown;
      }
    },
  ],
});

// ============================================================================
// INTERCEPTOR SETUP
// ============================================================================

// Request interceptor
axiosClient.interceptors.request.use(requestInterceptor, (error) => {
  console.error('[REST] Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptors
axiosClient.interceptors.response.use(successInterceptor, errorInterceptor);

// ============================================================================
// CONVENIENCE METHODS
// ============================================================================

/**
 * GET request with optional configuration
 */
export const get = <T = unknown>(
  url: string,
  config?: RequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosClient.get<T>(url, config);
};

/**
 * POST request with optional configuration
 */
export const post = <T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosClient.post<T>(url, data, config);
};

/**
 * PUT request with optional configuration
 */
export const put = <T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosClient.put<T>(url, data, config);
};

/**
 * PATCH request with optional configuration
 */
export const patch = <T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosClient.patch<T>(url, data, config);
};

/**
 * DELETE request with optional configuration
 */
export const del = <T = unknown>(
  url: string,
  config?: RequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosClient.delete<T>(url, config);
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { AxiosInstance, AxiosResponse, RequestConfig, ApiError };
export { axiosClient as default };
