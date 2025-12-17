/**
 * Query Decorator for Storybook
 *
 * Simple decorator to provide React Query context in Storybook stories.
 * Foundation-level only - no overengineering.
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a simple query client for Storybook
const storybookQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

/**
 * Query decorator for Storybook stories
 */
export const withQuery = (Story: React.ComponentType) => (
  <QueryClientProvider client={storybookQueryClient}>
    <Story />
  </QueryClientProvider>
);
