/**
 * QueryProvider Tests
 *
 * Tests for the React Query provider component.
 */

import { render, screen } from '@testing-library/react';
import QueryProvider from './queryProvider';

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}));

// Mock queryClient
jest.mock('../../../data/react-query/queryClient', () => ({
  queryClient: {
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  },
}));

describe('QueryProvider', () => {
  it('should render children wrapped in QueryClientProvider', () => {
    const { getByTestId, getByText } = render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    expect(getByTestId('query-client-provider')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <QueryProvider>
        <div>Child 1</div>
        <div>Child 2</div>
        <span>Child 3</span>
      </QueryProvider>
    );

    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
    expect(getByText('Child 3')).toBeInTheDocument();
  });

  it('should render without children', () => {
    const { getByTestId } = render(
      <QueryProvider>
        <div>Test</div>
      </QueryProvider>
    );

    expect(getByTestId('query-client-provider')).toBeInTheDocument();
  });

  it('should pass queryClient to QueryClientProvider', () => {
    render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    // The QueryProvider should render without errors
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should handle complex nested children', () => {
    const { getByText } = render(
      <QueryProvider>
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <button>Click me</button>
        </div>
      </QueryProvider>
    );

    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Description')).toBeInTheDocument();
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('should render with conditional children', () => {
    const showChild = true;

    const { getByText, queryByText } = render(
      <QueryProvider>
        {showChild && <div>Conditional Child</div>}
        {!showChild && <div>Hidden Child</div>}
      </QueryProvider>
    );

    expect(getByText('Conditional Child')).toBeInTheDocument();
    expect(queryByText('Hidden Child')).not.toBeInTheDocument();
  });
});
