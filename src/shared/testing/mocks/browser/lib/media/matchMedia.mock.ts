import { mockMediaQueryInterface } from '../../types/types';

/**
 * Creates a mock matchMedia function for testing media queries
 *
 * @param matches - Whether the media query should match
 * @returns A mock MediaQueryList object
 */
export const mockMatchMedia = (matches: boolean = false): mockMediaQueryInterface => {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];

  const mediaQueryMock: mockMediaQueryInterface = {
    matches,
    media: '(max-width: 768px)',
    onchange: null,

    addListener(callback: (event: MediaQueryListEvent) => void): void {
      listeners.push(callback);
    },

    removeListener(callback: (event: MediaQueryListEvent) => void): void {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    },
  };

  return mediaQueryMock;
};

// Mock the global matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((_query: string) => mockMatchMedia(false)),
});
