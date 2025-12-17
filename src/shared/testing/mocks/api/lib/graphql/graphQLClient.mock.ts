import { mockGraphQLOperationInterface, mockGraphQLResponseInterface } from '../../types/types';

/**
 * Mock GraphQL client for testing
 */
export class mockGraphQLClient {
  private cache = new Map<string, mockGraphQLResponseInterface>();

  constructor(private baseURL: string = 'https://api.example.com/graphql') {
    // BaseURL stored for potential future use in logging or debugging
  }

  async query<T = unknown>(
    operation: mockGraphQLOperationInterface
  ): Promise<mockGraphQLResponseInterface<T>> {
    const cacheKey = this.generateCacheKey(operation);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)! as mockGraphQLResponseInterface<T>;
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 10));

    const mockResponse: mockGraphQLResponseInterface<T> = {
      data: {} as T,
      errors: [],
    };

    this.cache.set(cacheKey, mockResponse);
    return mockResponse;
  }

  async mutation<T = unknown>(
    _operation: mockGraphQLOperationInterface
  ): Promise<mockGraphQLResponseInterface<T>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 10));

    return {
      data: {} as T,
      errors: [],
    };
  }

  private generateCacheKey(operation: mockGraphQLOperationInterface): string {
    return `${operation.request.query}:${JSON.stringify(operation.request.variables || {})}`;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Default instance for testing
export const mockGraphQLClientInstance = new mockGraphQLClient();
