// Media Query Types
export interface mockMediaQueryInterface {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
  addListener: (callback: (event: MediaQueryListEvent) => void) => void;
  removeListener: (callback: (event: MediaQueryListEvent) => void) => void;
}

// Intersection Observer Types
export interface mockIntersectionObserverInterface {
  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
  disconnect: () => void;
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  takeRecords: () => IntersectionObserverEntry[];
}

export interface mockIntersectionObserverOptionsInterface {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// Storage Types
export interface mockStorageInterface {
  readonly length: number;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
}

// Location Types
export interface mockLocationInterface extends Location {
  assign: jest.Mock;
  replace: jest.Mock;
  reload: jest.Mock;
  ancestorOrigins: DOMStringList;
}

// Navigator Types
export interface mockNavigatorInterface {
  readonly clipboard: {
    writeText: jest.Mock;
    readText: jest.Mock;
  };
  readonly userAgent: string;
}

// Performance Types
export interface mockPerformanceInterface {
  now: jest.Mock;
  timing: {
    navigationStart: number;
    loadEventEnd: number;
  };
  getEntriesByType: jest.Mock;
}

// Navigation Timing Types
export interface mockNavigationTimingInterface {
  name: string;
  startTime: number;
  duration: number;
  loadEventEnd: number;
  loadEventStart: number;
  domContentLoadedEventEnd: number;
  domContentLoadedEventStart: number;
  responseEnd: number;
  responseStart: number;
  requestStart: number;
  connectEnd: number;
  connectStart: number;
  domainLookupEnd: number;
  domainLookupStart: number;
  navigationStart: number;
}
