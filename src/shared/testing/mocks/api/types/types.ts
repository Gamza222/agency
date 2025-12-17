// GraphQL Request Types
export type GraphQLRequest = {
  query: string;
  variables?: Record<string, unknown> | undefined;
};

export type GraphQLMutationRequest = {
  mutation: string;
  variables?: Record<string, unknown> | undefined;
};

export type GraphQLCacheRequest<T> = {
  query: string;
  variables?: Record<string, unknown> | undefined;
  data?: T;
};

// GraphQL Operation Types
export interface mockGraphQLOperationInterface {
  request: {
    query: string;
    variables?: Record<string, unknown>;
  };
  result?: mockGraphQLResponseInterface;
  error?: Error; // Network errors
  delay?: number; // Simulate network delay
}

// Response Types
export interface mockGraphQLResponseInterface<T = unknown> {
  data?: T;
  errors?: mockGraphQLErrorInterface[];
  loading?: boolean;
  networkStatus?: number;
}

// Error Types
export interface mockGraphQLErrorInterface {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

// WebSocket Types
export interface mockWebSocketMessageInterface {
  type: 'subscription' | 'next' | 'error' | 'complete';
  payload?: unknown;
  id?: string;
}

export interface mockWebSocketInstanceInterface {
  addEventListener(type: string, handler: (event: MessageEvent) => void): void;
  removeEventListener(type: string, handler: (event: MessageEvent) => void): void;
  send(data: string): void;
  close(): void;
  mockMessage(message: mockWebSocketMessageInterface): void;
}

// Cache Types
export interface mockGraphQLCacheInterface {
  readQuery: <T>(options: GraphQLRequest) => T | null;
  writeQuery: <T>(options: GraphQLCacheRequest<T> & { data: T }) => void;
}
