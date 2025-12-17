import { apiConfig, ApiConfig, ApiError, ApiMethod, ERROR_MESSAGES } from '../../config/api';

interface RequestOptions {
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * HTTP client for making API requests
 * Handles errors, retries, and timeout logic
 */
class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Makes an HTTP request with automatic retry logic
   */
  async request<T>(
    endpoint: string,
    options: {
      method?: ApiMethod;
      data?: unknown;
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const { method = ApiMethod.GET, data, headers = {}, timeout = this.config.timeout } = options;

    const url = `${this.config.baseUrl}${endpoint}`;
    const requestOptions: RequestOptions = {
      method,
      headers: {
        ...this.config.headers,
        ...headers,
      },
    };

    if (data && method !== ApiMethod.GET) {
      requestOptions.body = JSON.stringify(data);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, requestOptions, timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: T = (await response.json()) as T;
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.config.retryAttempts) {
          await this.delay(1000 * (attempt + 1)); // Exponential backoff
        }
      }
    }

    // If we get here, all retries failed
    if (lastError) {
      throw this.createApiError(lastError);
    }

    // This should never happen, but TypeScript requires it
    throw this.createApiError(new Error(ERROR_MESSAGES.UNKNOWN_ERROR));
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestOptions,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Creates a standardized API error
   */
  private createApiError(error: Error): ApiError {
    if (error.name === 'AbortError') {
      return {
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        code: 'TIMEOUT',
        statusCode: 408,
      };
    }

    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
        statusCode: 0,
      };
    }

    return {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  /**
   * Delay utility for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<T> {
    return this.request<T>(endpoint, { method: ApiMethod.GET, ...options });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    return this.request<T>(endpoint, { method: ApiMethod.POST, data, ...options });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    return this.request<T>(endpoint, { method: ApiMethod.PUT, data, ...options });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    return this.request<T>(endpoint, { method: ApiMethod.PATCH, data, ...options });
  }

  async delete<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<T> {
    return this.request<T>(endpoint, { method: ApiMethod.DELETE, ...options });
  }
}

// Create and export default instance
export const apiClient = new ApiClient(apiConfig);
export { ApiClient };
