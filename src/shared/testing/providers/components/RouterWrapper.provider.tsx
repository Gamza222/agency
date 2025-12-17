import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { NextRouter } from 'next/router';
import type { RouterWrapperPropsInterface } from '../types/types';

// A mock router instance that can be customized for each test
const createMockRouter = (overrides?: Partial<NextRouter>): NextRouter => ({
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
  ...overrides,
});

/**
 * Router Test Provider
 *
 * Provides Next.js router context for testing components that use router hooks.
 * Use this when testing components that call useRouter(), usePathname(), etc.
 *
 * @usage
 * ```typescript
 * import { RouterWrapper } from '@/config/jest/providers';
 *
 * const wrapper = ({ children }) => (
 *   <RouterWrapper router={{ pathname: '/dashboard', query: { id: '123' } }}>
 *     {children}
 *   </RouterWrapper>
 * );
 *
 * render(<MyComponent />, { wrapper });
 * ```
 */
export const RouterWrapper = ({ children, router }: RouterWrapperPropsInterface): JSX.Element => {
  const mockRouter = createMockRouter(router);
  return <RouterContext.Provider value={mockRouter}>{children}</RouterContext.Provider>;
};
