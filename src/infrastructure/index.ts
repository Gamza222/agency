/**
 * Infrastructure Layer
 *
 * Cross-cutting concerns and framework integrations for enterprise applications.
 * This layer provides foundational services that support the entire application.
 *
 * FSD Compliance: Infrastructure layer handles cross-cutting concerns like:
 * - Error handling and reporting
 * - State management
 * - Data fetching and caching
 * - Suspense and loading management
 * - Application-wide providers
 *
 * Structure:
 * - lib/ - Core functionality with tests co-located
 * - types/ - Universal type definitions
 * - data/ - API clients and data layer (separate structure)
 */

// ============================================================================
// CORE INFRASTRUCTURE COMPONENTS
// ============================================================================

// Export specific components to avoid conflicts
export * from './error-handling';
export * from './suspense';
// Providers are exported individually from their respective folders

// Export state management with specific names to avoid conflicts
export {
  createStore,
  createSimpleStore,
  useStore,
  useShallowStore,
  useStoreState,
  useStoreHydrated,
  useStoreActions,
} from './state';
export type {
  BaseState,
  StoreConfig,
  EnhancedStore,
  AsyncState,
  PaginationState,
  FilterState,
  UIState,
  StoreState,
  Selector,
} from './state';

// Note: Types are now co-located within each component

// ============================================================================
// DATA LAYER
// ============================================================================

export * from './data';

// ============================================================================
// SECURITY & PERFORMANCE INFRASTRUCTURE
// ============================================================================

export * from './security';
export * from './performance';

// ============================================================================
// FUTURE INFRASTRUCTURE EXPORTS
// ============================================================================

// NOTE: Will be added as infrastructure grows:
// export * from './routing';          // Routing infrastructure
// export * from './monitoring';       // Additional monitoring and analytics
// export * from './i18n';             // Internationalization
// export * from './testing';          // Test infrastructure
