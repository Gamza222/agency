/**
 * Sentry Decorator for Storybook
 *
 * Simple decorator for Storybook stories.
 * Foundation-level only - no overengineering.
 */

import React from 'react';

/**
 * Sentry decorator for Storybook stories
 * Just renders the story - Sentry is mocked globally if needed
 */
export const withSentry = (Story: React.ComponentType) => {
  return <Story />;
};
