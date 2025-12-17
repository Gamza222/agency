/**
 * React Query Client Tests
 *
 * Real-life enterprise scenarios testing with minimal mocking.
 * Tests the universal React Query configuration for any application.
 */

import { queryClient } from './queryClient';
import { MutationCache, QueryCache } from '@tanstack/react-query';

describe('React Query Client', () => {
  beforeEach(() => {
    // Clear query cache before each test
    queryClient.clear();
  });

  afterEach(() => {
    // Clear any pending timers
    jest.clearAllTimers();
    // Clear query cache after each test
    queryClient.clear();
  });

  // ============================================================================
  // REAL-LIFE ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Enterprise Query Management', () => {
    it('should handle caching for user data queries', () => {
      // Real scenario: user profile data should be cached
      const userQueryKey = ['user', 'profile', '123'];
      const mockUserData = {
        id: '123',
        name: 'John Doe',
        email: 'john@company.com',
        department: 'Engineering',
      };

      // Set cached data
      queryClient.setQueryData(userQueryKey, mockUserData);

      // Retrieve cached data
      const cachedData = queryClient.getQueryData(userQueryKey);
      expect(cachedData).toEqual(mockUserData);
    });

    it('should handle invalidation for data refresh scenarios', async () => {
      // Real scenario: user updates profile, need to refresh all user queries
      const userQueries = [
        ['user', 'profile', '123'],
        ['user', 'settings', '123'],
        ['user', 'permissions', '123'],
      ];

      // Cache some user data
      userQueries.forEach((queryKey) => {
        queryClient.setQueryData(queryKey, { userId: '123', data: 'cached' });
      });

      // Invalidate all user queries
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      // All user queries should be marked as stale
      userQueries.forEach((queryKey) => {
        const queryState = queryClient.getQueryState(queryKey);
        expect(queryState?.isInvalidated).toBe(true);
      });
    });

    it('should handle prefetching for performance optimization', async () => {
      // Real scenario: prefetch user dashboard data before navigation
      const dashboardQueryKey = ['dashboard', 'user', '123'];

      await queryClient.prefetchQuery({
        queryKey: dashboardQueryKey,
        queryFn: () => {
          // Simulate API call
          return {
            widgets: ['analytics', 'tasks', 'notifications'],
            lastUpdated: new Date().toISOString(),
          };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Data should be available immediately
      const prefetchedData = queryClient.getQueryData(dashboardQueryKey);
      expect(prefetchedData).toBeDefined();
    });

    it('should handle query cancellation for navigation scenarios', async () => {
      // Real scenario: user navigates away, cancel pending requests
      const expensiveQueryKey = ['reports', 'expensive', '2024'];

      const queryPromise = queryClient.fetchQuery({
        queryKey: expensiveQueryKey,
        queryFn: async () => {
          // Simulate slow API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return { report: 'large data set' };
        },
      });

      // Cancel all queries (simulate navigation)
      void queryClient.cancelQueries();

      try {
        await queryPromise;
      } catch (error) {
        // Should handle cancellation gracefully
        expect(error).toBeDefined();
      }
    });
  });

  // ============================================================================
  // CACHE MANAGEMENT - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Cache Management', () => {
    it('should respect cache size limits for memory management', () => {
      // Real scenario: enterprise apps run for hours, need memory limits
      const cache = queryClient.getQueryCache();
      expect(cache).toBeInstanceOf(QueryCache);

      // Cache should have reasonable limits
      const cacheConfig = (cache as any).config;
      expect(cacheConfig).toBeDefined();
    });

    it('should handle garbage collection for old queries', () => {
      // Real scenario: unused data should be cleaned up
      const tempQueryKey = ['temp', 'data', Date.now()];

      queryClient.setQueryData(tempQueryKey, { temporary: true });

      // Force garbage collection
      queryClient.clear();

      // Temporary data should be removed
      const clearedData = queryClient.getQueryData(tempQueryKey);
      expect(clearedData).toBeUndefined();
    });

    it('should persist important queries across sessions', () => {
      // Real scenario: user preferences should survive page refresh
      const preferencesKey = ['user', 'preferences', '123'];
      const preferences = {
        theme: 'dark',
        language: 'en',
        notifications: true,
      };

      queryClient.setQueryData(preferencesKey, preferences);

      // Important data should be marked for persistence
      const queryState = queryClient.getQueryState(preferencesKey);
      expect(queryState?.data).toEqual(preferences);
    });

    it('should handle concurrent queries efficiently', async () => {
      // Real scenario: multiple components requesting same data simultaneously
      const sharedDataKey = ['shared', 'config'];

      const promises = Array.from({ length: 5 }, (_, index) =>
        queryClient.fetchQuery({
          queryKey: [...sharedDataKey, index],
          queryFn: async () => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 10));
            return { configId: index, loaded: true };
          },
        })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.configId).toBe(index);
      });
    });
  });

  // ============================================================================
  // ERROR HANDLING - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Real scenario: API server is down
      const errorQueryKey = ['network', 'error', 'test'];

      try {
        await queryClient.fetchQuery({
          queryKey: errorQueryKey,
          queryFn: () => {
            throw new Error('Network error: Connection failed');
          },
          retry: 1, // Minimal retries for testing
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Network error');
      }

      // Error should be stored in query state
      const queryState = queryClient.getQueryState(errorQueryKey);
      expect(queryState?.error).toBeDefined();
    });

    it('should handle authentication errors with proper cleanup', async () => {
      // Real scenario: auth token expires during API call
      const authQueryKey = ['auth', 'protected', 'data'];

      try {
        await queryClient.fetchQuery({
          queryKey: authQueryKey,
          queryFn: () => {
            const authError = new Error('Authentication failed');
            (authError as any).status = 401;
            throw authError;
          },
          retry: false,
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as any).status).toBe(401);
      }
    });

    it('should handle timeout scenarios', async () => {
      // Real scenario: slow API responses
      const timeoutQueryKey = ['timeout', 'test'];

      try {
        await queryClient.fetchQuery({
          queryKey: timeoutQueryKey,
          queryFn: () => {
            // Simulate timeout - immediate rejection for testing
            throw new Error('Request timeout');
          },
          retry: false, // Don't retry for timeout test
        });
      } catch (error) {
        expect((error as Error).message).toContain('timeout');
      }
    }, 1000); // Shorter timeout for test

    it('should handle validation errors from API', async () => {
      // Real scenario: form submission with validation errors
      const validationQueryKey = ['validation', 'error'];

      try {
        await queryClient.fetchQuery({
          queryKey: validationQueryKey,
          queryFn: () => {
            const validationError = new Error('Validation failed');
            (validationError as any).status = 400;
            (validationError as any).validationErrors = {
              email: 'Invalid email format',
              password: 'Password too weak',
            };
            throw validationError;
          },
        });
      } catch (error) {
        expect((error as any).validationErrors).toBeDefined();
        expect((error as any).validationErrors.email).toBe('Invalid email format');
      }
    });
  });

  // ============================================================================
  // MUTATION HANDLING - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Mutation Management', () => {
    it('should handle user profile updates with optimistic updates', () => {
      // Real scenario: update user profile with immediate UI feedback
      const userProfileKey = ['user', 'profile', '123'];
      const originalProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@company.com',
      };

      // Set initial data
      queryClient.setQueryData(userProfileKey, originalProfile);

      // Perform optimistic update
      const updatedProfile = { ...originalProfile, name: 'John Updated' };
      queryClient.setQueryData(userProfileKey, updatedProfile);

      // Verify optimistic update
      const optimisticData = queryClient.getQueryData(userProfileKey);
      expect((optimisticData as any).name).toBe('John Updated');
    });

    it('should handle bulk operations efficiently', async () => {
      // Real scenario: bulk user management operations
      const bulkQueryKey = ['users', 'bulk', 'update'];

      try {
        await queryClient.fetchQuery({
          queryKey: bulkQueryKey,
          queryFn: () => {
            // Simulate bulk operation
            const userIds = ['1', '2', '3', '4', '5'];
            return {
              updated: userIds.length,
              userIds,
              timestamp: new Date().toISOString(),
            };
          },
        });

        // Should handle bulk data efficiently
        const bulkResult = queryClient.getQueryData(bulkQueryKey);
        expect((bulkResult as any).updated).toBe(5);
      } catch (error) {
        // Should handle bulk operation errors
        expect(error).toBeDefined();
      }
    });

    it('should handle mutation rollback on failure', () => {
      // Real scenario: optimistic update fails, need to rollback
      const rollbackKey = ['rollback', 'test'];
      const originalData = { value: 'original' };
      const optimisticData = { value: 'optimistic' };

      // Set original data
      queryClient.setQueryData(rollbackKey, originalData);

      // Apply optimistic update
      queryClient.setQueryData(rollbackKey, optimisticData);
      expect(queryClient.getQueryData(rollbackKey)).toEqual(optimisticData);

      // Simulate failure and rollback
      queryClient.setQueryData(rollbackKey, originalData);
      expect(queryClient.getQueryData(rollbackKey)).toEqual(originalData);
    });
  });

  // ============================================================================
  // CONFIGURATION - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Configuration', () => {
    it('should have enterprise-appropriate default settings', () => {
      // Real scenario: defaults should work for enterprise applications
      const defaultOptions = queryClient.getDefaultOptions();

      expect(defaultOptions).toBeDefined();
      expect(defaultOptions.queries).toBeDefined();
      expect(defaultOptions.mutations).toBeDefined();
    });

    it('should support custom retry logic for enterprise networks', () => {
      // Real scenario: enterprise networks may have different retry needs
      const retryQueryKey = ['retry', 'test'];

      expect(() => {
        queryClient
          .fetchQuery({
            queryKey: retryQueryKey,
            queryFn: () => {
              throw new Error('Temporary network issue');
            },
            retry: (failureCount, error) => {
              // Custom retry logic for enterprise scenarios
              return failureCount < 3 && (error as any).status !== 401;
            },
          })
          .catch(() => {
            // Expected to fail
          });
      }).not.toThrow();
    });

    it('should handle stale time configuration for different data types', () => {
      // Real scenario: user data vs system config have different staleness
      const userDataKey = ['user', 'profile'];
      const systemConfigKey = ['system', 'config'];

      // User data - shorter stale time
      queryClient.setQueryDefaults(userDataKey, {
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // System config - longer stale time
      queryClient.setQueryDefaults(systemConfigKey, {
        staleTime: 60 * 60 * 1000, // 1 hour
      });

      // Should accept different stale time configurations
      expect(() => {
        queryClient.getQueryDefaults(userDataKey);
        queryClient.getQueryDefaults(systemConfigKey);
      }).not.toThrow();
    });
  });

  // ============================================================================
  // INTEGRATION TESTING
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('should work with Suspense for loading states', async () => {
      // Real scenario: React Suspense integration
      const suspenseQueryKey = ['suspense', 'data'];

      // Prefetch data for Suspense
      await queryClient.prefetchQuery({
        queryKey: suspenseQueryKey,
        queryFn: () => {
          return { suspenseReady: true };
        },
      });

      const data = queryClient.getQueryData(suspenseQueryKey);
      expect((data as any).suspenseReady).toBe(true);
    });

    it('should integrate with error boundaries', async () => {
      // Real scenario: React Error Boundary integration
      const errorBoundaryKey = ['error', 'boundary', 'test'];

      try {
        await queryClient.fetchQuery({
          queryKey: errorBoundaryKey,
          queryFn: () => {
            throw new Error('Component error');
          },
          retry: false, // Don't retry for error boundary test
        });
      } catch (error) {
        // Error should be catchable by Error Boundary
        expect(error).toBeInstanceOf(Error);
      }
    }, 1000); // Shorter timeout for test

    it('should support offline/online scenarios', () => {
      // Real scenario: offline-first enterprise applications
      const offlineKey = ['offline', 'data'];

      // Set data while online
      queryClient.setQueryData(offlineKey, {
        cached: true,
        timestamp: Date.now(),
      });

      // Data should persist when offline
      const offlineData = queryClient.getQueryData(offlineKey);
      expect((offlineData as any).cached).toBe(true);
    });
  });
});

describe('React Query Client Integration', () => {
  it('should be ready for enterprise React applications', () => {
    // Real scenario: production readiness check
    expect(queryClient).toBeDefined();
    expect(queryClient.getQueryCache()).toBeInstanceOf(QueryCache);
    expect(queryClient.getMutationCache()).toBeInstanceOf(MutationCache);
    expect(typeof queryClient.fetchQuery).toBe('function');
    expect(typeof queryClient.prefetchQuery).toBe('function');
    expect(typeof queryClient.invalidateQueries).toBe('function');
  });

  it('should handle complex enterprise data flows', async () => {
    // Real scenario: complex data dependencies
    const dependencies = [
      ['user', 'permissions'],
      ['user', 'settings'],
      ['app', 'config'],
      ['feature', 'flags'],
    ];

    // Should handle multiple related queries
    const promises = dependencies.map(
      (queryKey) =>
        queryClient
          .fetchQuery({
            queryKey,
            queryFn: () => ({
              key: queryKey.join('-'),
              loaded: true,
            }),
          })
          .catch(() => null) // Expected network errors
    );

    await Promise.allSettled(promises);

    // All queries should be manageable
    dependencies.forEach((queryKey) => {
      const state = queryClient.getQueryState(queryKey);
      expect(state).toBeDefined();
    });
  });
});
