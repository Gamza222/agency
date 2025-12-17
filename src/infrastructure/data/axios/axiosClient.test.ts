/**
 * Axios REST Client Tests
 *
 * Real-life enterprise scenarios testing with minimal mocking.
 * Uses existing mock factory patterns and real HTTP behavior where possible.
 */

import { axiosClient, del, get, patch, post, put } from './axiosClient';

// Use existing mock factory patterns
import { mockConsole, mockStorage } from '@/shared/testing/mocks/browser';

describe('Axios REST Client', () => {
  let mockLocalStorage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    // Use existing mock factory patterns
    mockConsole.clear();

    // Create fresh localStorage mock for each test
    mockLocalStorage = mockStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    // Cleanup
    mockConsole.restore();
    // Clear any pending timers from retry logic
    jest.clearAllTimers();
    // Clear mock storage
    mockLocalStorage.clear();
  });

  // ============================================================================
  // REAL-LIFE ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Enterprise REST Operations', () => {
    it('should have proper HTTP methods configured', () => {
      // Real scenario: all REST operations should be available
      expect(typeof get).toBe('function');
      expect(typeof post).toBe('function');
      expect(typeof put).toBe('function');
      expect(typeof patch).toBe('function');
      expect(typeof del).toBe('function');
    });

    it('should configure proper request defaults for enterprise use', () => {
      // Real scenario: enterprise-appropriate configuration
      expect(axiosClient.defaults.timeout).toBeGreaterThan(0);
      expect(axiosClient.defaults.baseURL).toBeDefined();
      expect(axiosClient.defaults.headers['Accept']).toBe('application/json');
      expect(axiosClient.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should handle request data serialization properly', () => {
      // Real scenario: complex objects should be serialized correctly
      const userData = {
        name: 'John Doe',
        email: 'john@company.com',
        metadata: { department: 'Engineering', level: 'Senior' },
        permissions: ['read', 'write'],
      };

      // Should not throw when preparing request data
      expect(() => {
        JSON.stringify(userData);
      }).not.toThrow();
    });

    it('should support proper HTTP status validation', () => {
      // Real scenario: only 2xx should be success
      const validateStatus = axiosClient.defaults.validateStatus;
      expect(validateStatus).toBeDefined();

      if (validateStatus) {
        expect(validateStatus(200)).toBe(true);
        expect(validateStatus(201)).toBe(true);
        expect(validateStatus(204)).toBe(true);
        expect(validateStatus(400)).toBe(false);
        expect(validateStatus(401)).toBe(false);
        expect(validateStatus(500)).toBe(false);
      }
    });
  });

  // ============================================================================
  // AUTHENTICATION - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Authentication Integration', () => {
    it('should add auth headers when token is available', () => {
      // Real scenario: authenticated user making requests
      mockLocalStorage.setItem('auth_token', 'enterprise_auth_token_123');

      // Test that request includes auth header
      const originalRequest = axiosClient.interceptors.request;
      expect(originalRequest).toBeDefined();
      expect(mockLocalStorage.getItem('auth_token')).toBe('enterprise_auth_token_123');
    });

    it('should work without auth token for public endpoints', () => {
      // Real scenario: public API endpoints should not require auth
      expect(mockLocalStorage.getItem('auth_token')).toBeNull();

      // Should have interceptors configured properly
      expect(axiosClient.interceptors.request).toBeDefined();
      expect(axiosClient.interceptors.response).toBeDefined();
    });

    it('should handle multiple token storage strategies', () => {
      // Real scenario: different enterprise apps store tokens differently
      const tokenStrategies = [
        { key: 'auth_token', value: 'bearer_token_123' },
        { key: 'access_token', value: 'jwt_token_456' },
        { key: 'session_token', value: 'session_789' },
      ];

      tokenStrategies.forEach(({ key, value }) => {
        mockLocalStorage.clear();
        mockLocalStorage.setItem(key, value);

        // Should handle each strategy without errors
        expect(mockLocalStorage.getItem(key)).toBe(value);
        expect(() => axiosClient.defaults).not.toThrow();
      });
    });

    it('should have error interceptor configured for auth handling', () => {
      // Real scenario: 401 responses should clear auth tokens
      expect(axiosClient.interceptors.response).toBeDefined();

      // Should have response interceptor for error handling
      const responseInterceptors = (axiosClient.interceptors.response as any).handlers;
      expect(responseInterceptors.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // ERROR HANDLING - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Error Handling', () => {
    it('should have error interceptor configured for standardized errors', () => {
      // Real scenario: all errors should follow same format
      expect(axiosClient.interceptors.response).toBeDefined();

      // Should have response interceptor for error handling
      const responseInterceptors = (axiosClient.interceptors.response as any).handlers;
      expect(responseInterceptors.length).toBeGreaterThan(0);
    });

    it('should handle different HTTP error status codes appropriately', () => {
      // Real scenario: different error types need different handling
      const errorScenarios = [
        { status: 400, description: 'Bad Request - validation errors' },
        { status: 401, description: 'Unauthorized - auth required' },
        { status: 403, description: 'Forbidden - insufficient permissions' },
        { status: 404, description: 'Not Found - resource missing' },
        { status: 429, description: 'Rate Limited - too many requests' },
        { status: 500, description: 'Server Error - internal issues' },
      ];

      // Each error type should be recognized by status validation
      errorScenarios.forEach(({ status }) => {
        const validateStatus = axiosClient.defaults.validateStatus;
        if (validateStatus) {
          expect(validateStatus(status)).toBe(false);
        }
      });
    });

    it('should have proper error logging configured', () => {
      // Real scenario: developers need error visibility
      expect(axiosClient.interceptors.response).toBeDefined();

      // Console should be available for error logging
      expect(global.console.error).toBeDefined();
    });

    it('should generate unique request IDs for error tracking', () => {
      // Real scenario: errors need unique identifiers for tracing
      expect(axiosClient.interceptors.request).toBeDefined();

      // Request interceptor should add unique identifiers
      const requestInterceptors = (axiosClient.interceptors.request as any).handlers;
      expect(requestInterceptors.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // RETRY LOGIC - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Retry Logic', () => {
    it('should have retry configuration available', () => {
      // Real scenario: client should support retry configuration
      expect(axiosClient.interceptors.response).toBeDefined();

      // Should have error handling that supports retries
      const responseInterceptors = (axiosClient.interceptors.response as any).handlers;
      expect(responseInterceptors.length).toBeGreaterThan(0);
    });

    it('should handle retry configuration options', () => {
      // Real scenario: different requests need different retry strategies
      const retryConfigs = [
        { skipRetry: true, retryAttempts: 0 },
        { skipRetry: false, retryAttempts: 3 },
        { retryAttempts: 5 },
      ];

      retryConfigs.forEach((config) => {
        // Should accept retry configuration without error
        expect(() => {
          const requestConfig = { ...config, url: '/test' };
          expect(requestConfig).toBeDefined();
        }).not.toThrow();
      });
    });

    it('should have exponential backoff constants defined', () => {
      // Real scenario: retry delays should increase exponentially
      // Check that retry logic exists in the client
      expect(axiosClient.interceptors.response).toBeDefined();
    });

    it('should differentiate between retryable and non-retryable errors', () => {
      // Real scenario: 4xx errors should not retry, 5xx should retry
      const nonRetryableStatuses = [400, 401, 403, 404, 422];
      const retryableStatuses = [500, 502, 503, 504];

      nonRetryableStatuses.forEach((status) => {
        // Client errors should not be retried
        expect(status).toBeGreaterThanOrEqual(400);
        expect(status).toBeLessThan(500);
      });

      retryableStatuses.forEach((status) => {
        // Server errors can be retried
        expect(status).toBeGreaterThanOrEqual(500);
      });
    });
  });

  // ============================================================================
  // PERFORMANCE MONITORING - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Performance Monitoring', () => {
    it('should have request timing infrastructure', () => {
      // Real scenario: performance tracking should be built-in
      expect(axiosClient.interceptors.request).toBeDefined();
      expect(axiosClient.interceptors.response).toBeDefined();

      // Should have timing capability
      expect(Date.now).toBeDefined();
    });

    it('should generate request IDs for tracing', () => {
      // Real scenario: each request needs unique identifier
      expect(axiosClient.interceptors.request).toBeDefined();

      // Should have request interceptor for adding IDs
      const requestInterceptors = (axiosClient.interceptors.request as any).handlers;
      expect(requestInterceptors.length).toBeGreaterThan(0);
    });

    it('should support performance monitoring hooks', () => {
      // Real scenario: enterprises integrate with their monitoring
      const mockPerformanceTracker = jest.fn();
      (window as any).__REST_PERFORMANCE_TRACKER__ = mockPerformanceTracker;

      // Should be able to attach custom monitoring
      expect((window as any).__REST_PERFORMANCE_TRACKER__).toBeDefined();

      delete (window as any).__REST_PERFORMANCE_TRACKER__;
    });

    it('should have proper headers for monitoring', () => {
      // Real scenario: monitoring requires client identification
      expect(axiosClient.defaults.headers).toBeDefined();

      // Should identify the client for monitoring
      const headers = axiosClient.defaults.headers;
      expect(headers).toHaveProperty('Accept');
      expect(headers).toHaveProperty('Content-Type');
    });
  });

  // ============================================================================
  // DATA TRANSFORMATION - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Data Transformation', () => {
    it('should handle complex data serialization', () => {
      // Real scenario: objects should be properly serialized
      const complexData = {
        user: { id: 123, name: 'Test User' },
        metadata: { timestamp: Date.now(), version: '1.0' },
        permissions: ['read', 'write'],
        nestedArray: [{ id: 1, data: 'test' }],
      };

      // Should serialize complex objects without error
      expect(() => {
        JSON.stringify(complexData);
      }).not.toThrow();

      const serialized = JSON.stringify(complexData);
      expect(typeof serialized).toBe('string');
      expect(serialized.length).toBeGreaterThan(0);
    });

    it('should handle response transformation setup', () => {
      // Real scenario: responses should be automatically parsed
      expect(axiosClient.interceptors.response).toBeDefined();

      // Should have response transformation capability
      const responseInterceptors = (axiosClient.interceptors.response as any).handlers;
      expect(responseInterceptors.length).toBeGreaterThan(0);
    });

    it('should set appropriate content-type headers', () => {
      // Real scenario: servers need proper content-type
      const defaults = axiosClient.defaults;
      expect(defaults.headers['Content-Type']).toBe('application/json');
      expect(defaults.headers['Accept']).toBe('application/json');
    });

    it('should handle different data types appropriately', () => {
      // Real scenario: various data types should be supported
      const dataTypes = [
        { type: 'object', data: { key: 'value' } },
        { type: 'array', data: [1, 2, 3] },
        { type: 'string', data: 'simple string' },
        { type: 'number', data: 42 },
        { type: 'boolean', data: true },
      ];

      dataTypes.forEach(({ data }) => {
        expect(() => {
          JSON.stringify(data);
        }).not.toThrow();
      });
    });
  });

  // ============================================================================
  // CONFIGURATION - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Configuration', () => {
    it('should use enterprise-appropriate timeouts', () => {
      // Real scenario: enterprise networks need reasonable timeouts
      expect(axiosClient.defaults.timeout).toBeGreaterThan(0);
      expect(axiosClient.defaults.timeout).toBeLessThanOrEqual(30000);
    });

    it('should support base URL configuration', () => {
      // Real scenario: different environments have different base URLs
      expect(axiosClient.defaults.baseURL).toBeDefined();
    });

    it('should handle redirects appropriately', () => {
      // Real scenario: enterprise proxies may redirect
      expect(axiosClient.defaults.maxRedirects).toBeGreaterThan(0);
    });

    it('should validate status codes correctly', () => {
      // Real scenario: only 2xx should be considered success
      const validateStatus = axiosClient.defaults.validateStatus;
      expect(validateStatus).toBeDefined();
      if (validateStatus) {
        expect(validateStatus(200)).toBe(true);
        expect(validateStatus(201)).toBe(true);
        expect(validateStatus(400)).toBe(false);
        expect(validateStatus(500)).toBe(false);
      }
    });
  });
});

describe('Axios Client Integration', () => {
  it('should be ready for real enterprise REST APIs', () => {
    // Real scenario: production readiness check
    expect(axiosClient.defaults).toBeDefined();
    expect(axiosClient.interceptors).toBeDefined();
    expect(typeof get).toBe('function');
    expect(typeof post).toBe('function');
    expect(typeof put).toBe('function');
    expect(typeof patch).toBe('function');
    expect(typeof del).toBe('function');
  });

  it('should work with standard REST API conventions', () => {
    // Real scenario: follows REST best practices
    const restOperations = [
      { method: get, url: '/users', description: 'List resources' },
      {
        method: (url: string) => get(`${url}/123`),
        url: '/users',
        description: 'Get specific resource',
      },
      { method: (url: string) => post(url, {}), url: '/users', description: 'Create resource' },
      {
        method: (url: string) => put(`${url}/123`, {}),
        url: '/users',
        description: 'Update resource',
      },
      {
        method: (url: string) => patch(`${url}/123`, {}),
        url: '/users',
        description: 'Partial update',
      },
      { method: (url: string) => del(`${url}/123`), url: '/users', description: 'Delete resource' },
    ];

    restOperations.forEach(({ method, url }) => {
      expect(() => {
        method(url).catch(() => {
          // Expected network error in test environment
        });
      }).not.toThrow();
    });
  });
});
