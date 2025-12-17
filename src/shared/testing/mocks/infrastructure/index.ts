/**
 * Infrastructure Mocks
 *
 * Centralized exports for all infrastructure-related mocks.
 */

// ============================================================================
// STATE MANAGEMENT MOCKS
// ============================================================================

export {
  // Store factory mocks
  createMockStore,
  mockStores,

  // Hook mocks
  mockUseStore,
  mockSelectors,

  // Test utilities
  stateGenerators,
  testUtils,
  mockMiddleware,

  // Types
  type MockCounterState,
  type MockTodoState,
  type MockUserState,
} from './state/store.mock';

// ============================================================================
// SECURITY MOCKS
// ============================================================================

export {
  mockAuthService,
  mockUser,
  mockLoginCredentials,
  defaultAuthServiceMock,
  defaultUserMock,
  defaultCredentialsMock,
} from './lib/security/auth.mock';

export {
  mockAuthorizationService,
  mockUserWithPermissions,
  mockPermissions,
  defaultAuthorizationServiceMock,
  defaultUserWithPermissionsMock,
  defaultPermissionsMock,
} from './lib/security/authorization.mock';

export {
  mockRateLimiterService,
  mockRateLimitInfo,
  mockRateLimitResult,
  defaultRateLimiterServiceMock,
  defaultRateLimitInfoMock,
  defaultRateLimitResultMock,
} from './lib/security/rateLimiter.mock';

// ============================================================================
// MONITORING MOCKS
// ============================================================================

export {
  // Service mocks
  createMockMonitoringServiceInstance,
  createMockMonitoringServiceClass,
  defaultMonitoringServiceMock,
  mockMonitoringService,
  createUnhealthySystemMock,
  createDegradedSystemMock,
  createServiceErrorMock,
  resetMonitoringServiceMocks,
  setupMonitoringServiceMock,

  // Data mocks
  createServiceHealth,
  createMonitoringAlert,
  mockHealthySystemHealth,
  mockUnhealthySystemHealth,
  mockDegradedSystemHealth,
  mockDashboardData,
  mockDashboardDataWithAlerts,
  mockDashboardDataNoAlerts,
  mockAnalyticsSession,
  mockAnalyticsEvent,
  mockAlerts,
  mockMetrics,
  generateServiceHealthArray,
  generateAlertsArray,
  createCustomDashboardData,

  // Configuration mocks
  createMonitoringConfig,
  mockMonitoringConfig,
  mockHealthCheckConfig,
  mockAnalyticsConfig,
  mockAlertsConfig,
  mockDashboardConfig,
  mockDevelopmentConfig,
  mockProductionConfig,
  mockMinimalConfig,
  mockDisabledConfig,
  createConfigForScenario,
  mergeConfigs,
} from './lib/monitoring';

// ============================================================================
// PERFORMANCE MOCKS
// ============================================================================

export {
  // Performance Monitor Mocks
  mockPerformanceMonitor,
  MockPerformanceMonitor,
  mockMeasurePerformance,
  mockMeasureAsyncPerformance,
  mockGetPerformanceTiming,
  mockGetNavigationTiming,
  createMockPerformanceMonitorInstance,
  mockPerformanceMonitorWithMetrics,
  mockPerformanceMonitorWithError,

  // Web Vitals Mocks
  mockInitWebVitals,
  mockPerformanceBudgets,
  mockCheckPerformanceBudget,
  mockGetPerformanceRating,
  createMockWebVitals,
  mockWebVitalsWithError,

  // Performance Types Mocks
  mockPerformanceMetric,
  mockPerformanceMetrics,
  mockPerformanceReport,
  mockImageOptimizationConfig,
  mockResourcePreloadConfig,
  mockCriticalCSSConfig,
  mockHTTPCacheConfig,
  mockPerformanceProductionConfig,
  generateMockPerformanceMetrics,
  generateMockPerformanceReport,
} from './lib/performance';

// ============================================================================
// API MOCKS
// ============================================================================

export {
  createMockResponse,
  createMockRequest,
  createMockApiError,
  createMockFetch,
} from './lib/api/api.mock';

// ============================================================================
// STATE MANAGEMENT MOCKS
// ============================================================================

export {
  createMockStoreListener,
  createMockStoreListenerWithExpectations,
  createMockZustandStore,
  createMockStoreSelector,
  createMockStoreAction,
  createMockStoreMiddleware,
} from './lib/state/state.mock';

// ============================================================================
// FUTURE INFRASTRUCTURE MOCKS
// ============================================================================

// NOTE: Add other infrastructure mocks here as they are developed:
// - Database connection mocks
// - External service mocks
// - Configuration mocks
// etc.
