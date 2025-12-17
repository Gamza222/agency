/**
 * Next.js Mock Types
 *
 * Type definitions for Next.js server-side mocks used in testing.
 */

// NextRequest Mock Types
export interface mockNextRequestInterface {
  url: string;
  method: string;
  headers: Map<string, string>;
  get(name: string): string | null;
}

export interface mockNextRequestOptionsInterface {
  method?: string;
  headers?: Record<string, string>;
}

// NextResponse Mock Types
export interface mockNextResponseInterface {
  status: number;
  headers: {
    set: jest.Mock;
    get: jest.Mock;
  };
}

export interface mockNextResponseOptionsInterface {
  status?: number;
}

// Next.js Server Mock Types
export interface mockNextServerInterface {
  NextRequest: unknown; // MockNextRequest type
  NextResponse: unknown; // MockNextResponse type
}
