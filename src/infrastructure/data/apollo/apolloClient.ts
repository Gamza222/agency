/**
 * Apollo GraphQL Client Configuration
 *
 * Universal GraphQL client foundation that can be used by any enterprise application.
 * Simplified version for initial foundation - can be enhanced later.
 */

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

// Import centralized environment configuration
import { envConfig } from '../../../../config/env';

const GRAPHQL_ENDPOINT = envConfig.graphqlUrl;

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

/**
 * Universal cache configuration suitable for any GraphQL application
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Generic pagination support for any paginated field
        __typename: {
          read(existing: string | undefined): string {
            return existing || 'Query';
          },
        },
      },
    },
  },
});

// ============================================================================
// HTTP LINK
// ============================================================================

/**
 * Universal HTTP link configuration
 */
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
});

// ============================================================================
// APOLLO CLIENT CONFIGURATION
// ============================================================================

/**
 * Universal Apollo Client configuration suitable for any enterprise application
 */
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear Apollo cache - useful for logout or data refresh scenarios
 */
export const clearApolloCache = async (): Promise<void> => {
  await apolloClient.clearStore();
};

/**
 * Refetch all active queries - useful for data refresh scenarios
 */
export const refetchActiveQueries = async (): Promise<void> => {
  await apolloClient.refetchQueries({
    include: 'active',
  });
};

/**
 * Reset Apollo store completely - useful for user switching scenarios
 */
export const resetApolloStore = async (): Promise<void> => {
  await apolloClient.resetStore();
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { ApolloClient } from '@apollo/client';
export { apolloClient as default };
