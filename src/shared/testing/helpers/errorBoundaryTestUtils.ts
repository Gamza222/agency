/**
 * Error Boundary Test Utilities
 *
 * Provides utilities for testing error boundaries while suppressing expected console errors.
 */

import { render, RenderOptions } from '@testing-library/react';
import React from 'react';

/**
 * Suppresses console errors during error boundary tests
 * This is necessary because error boundaries are supposed to throw errors
 */
export const suppressErrorBoundaryConsoleErrors = () => {
  const originalConsoleError = console.error;

  console.error = (...args: unknown[]) => {
    const message = args[0];

    // Suppress expected error boundary errors
    if (
      typeof message === 'string' &&
      (message.includes('The above error occurred in the') ||
        message.includes('React will try to recreate this component tree') ||
        message.includes('Error: Uncaught [Error:') ||
        message.includes('Error: Test error') ||
        message.includes('Error: Render error') ||
        message.includes('Error: Network request failed') ||
        message.includes('Error: Failed to fetch') ||
        message.includes('Error: Loading chunk') ||
        message.includes('Error: Regular component error') ||
        message.includes('Error: Synchronous error') ||
        message.includes('Error: Complex error') ||
        message.includes('Error: Effect error'))
    ) {
      return;
    }

    // Call original console.error for other messages
    originalConsoleError(...args);
  };

  return () => {
    console.error = originalConsoleError;
  };
};

/**
 * Renders a component with error boundary testing utilities
 */
export const renderWithErrorBoundary = (ui: React.ReactElement, options?: RenderOptions) => {
  const restoreConsole = suppressErrorBoundaryConsoleErrors();

  const result = render(ui, options);

  // Restore console after test
  const originalUnmount = result.unmount;
  result.unmount = () => {
    restoreConsole();
    originalUnmount();
  };

  return result;
};

/**
 * Test component that throws errors for error boundary testing
 */
export const ThrowError: React.FC<{
  error?: Error;
  shouldThrow?: boolean;
  errorMessage?: string;
}> = ({ shouldThrow = true, errorMessage = 'Test error' }) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return React.createElement('div', null, 'No error');
};

/**
 * Test component that throws errors in useEffect
 */
export const ThrowErrorInEffect: React.FC<{ errorMessage?: string }> = ({
  errorMessage = 'Effect error',
}) => {
  React.useEffect(() => {
    throw new Error(errorMessage);
  }, [errorMessage]);

  return React.createElement('div', null, 'Component with effect error');
};

/**
 * Test component that throws errors in render
 */
export const ThrowErrorInRender: React.FC<{ errorMessage?: string }> = ({
  errorMessage = 'Render error',
}) => {
  throw new Error(errorMessage);
};
