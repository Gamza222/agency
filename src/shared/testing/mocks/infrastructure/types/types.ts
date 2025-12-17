/**
 * Infrastructure Mock Types
 *
 * Type definitions for infrastructure-related mocks.
 */

import type { BaseState, EnhancedStore } from '@/infrastructure/state';

// ============================================================================
// STATE MANAGEMENT MOCK TYPES
// ============================================================================

/**
 * Mock store factory options
 */
export interface MockStoreOptions {
  name?: string;
  persistence?: boolean;
  devtools?: boolean;
}

/**
 * Mock store with additional testing utilities
 */
export interface MockStoreWithUtils<T> extends EnhancedStore<T & BaseState> {
  mockUtils: {
    reset: () => void;
    setLoading: (loading: boolean) => void;
    simulateError: (error: Error) => void;
    waitForState: (predicate: (state: T & BaseState) => boolean) => Promise<T & BaseState>;
  };
}

/**
 * State change tracker
 */
export interface StateChangeTracker<T> {
  changes: T[];
  unsubscribe: () => void;
  getChangeCount: () => number;
  getLastChange: () => T | undefined;
}

/**
 * Mock middleware logger
 */
export interface MockLogger {
  logs: Array<{ action: string; state: unknown; timestamp: number }>;
  middleware: (f: unknown) => unknown;
  clearLogs: () => void;
  getLastLog: () => unknown;
}

/**
 * Mock analytics tracker
 */
export interface MockAnalytics {
  events: Array<{ type: string; data: unknown; timestamp: number }>;
  track: (type: string, data: unknown) => void;
  clearEvents: () => void;
  getEventCount: () => number;
  getLastEvent: () => unknown;
}

// ============================================================================
// COMMON TEST PATTERNS
// ============================================================================

/**
 * Common loading state pattern
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Common async action state pattern
 */
export interface AsyncActionState<T> extends LoadingState {
  data: T | null;
  lastFetch: number | null;
}

/**
 * Common paginated data pattern
 */
export interface PaginatedState<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// ============================================================================
// SECURITY MOCK TYPES
// ============================================================================

/**
 * Mock user interface for testing
 */
export interface mockUserInterface {
  id: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mock login credentials interface for testing
 */
export interface mockLoginCredentialsInterface {
  email: string;
  password: string;
}

/**
 * Mock permission type for testing
 */
export type mockPermissionInterface = string;

/**
 * Mock auth service interface for testing
 */
export interface mockAuthServiceInterface {
  register: jest.Mock;
  login: jest.Mock;
  verifyToken: jest.Mock;
  getSecurityEvents: jest.Mock;
}

/**
 * Mock authorization service interface for testing
 */
export interface mockAuthorizationServiceInterface {
  hasPermission: jest.Mock;
  hasAnyPermission: jest.Mock;
  hasAllPermissions: jest.Mock;
  hasRole: jest.Mock;
  hasAnyRole: jest.Mock;
  canAccessResource: jest.Mock;
  getEffectivePermissions: jest.Mock;
  canPerformAction: jest.Mock;
  getRolePermissions: jest.Mock;
}

/**
 * Mock rate limit info interface for testing
 */
export interface mockRateLimitInfoInterface {
  count: number;
  resetTime: number;
  limit: number;
  remaining: number;
  windowMs: number;
}

/**
 * Mock rate limiter service interface for testing
 */
export interface mockRateLimiterServiceInterface {
  checkRateLimit: jest.Mock;
  getRateLimitInfo: jest.Mock;
  resetRateLimit: jest.Mock;
  generateKey: jest.Mock;
  getAllActiveRateLimits: jest.Mock;
  getStatistics: jest.Mock;
}

// ============================================================================
// EXPORTS
// ============================================================================

// All types are exported inline above
