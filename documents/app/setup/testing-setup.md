# 🧪 Testing Setup Guide

This guide covers how to set up and use our comprehensive testing infrastructure.

## 🎯 Testing Philosophy

Our testing approach follows these principles:

1. **Test Pyramid** - Unit tests (70%), Integration tests (20%), E2E tests (10%)
2. **Test-Driven Development** - Write tests first when possible
3. **Realistic Testing** - Test real user interactions, not implementation details
4. **Comprehensive Coverage** - Test happy paths, edge cases, and error states
5. **Maintainable Tests** - Keep tests simple, readable, and maintainable

### Current Test Coverage

- **Statements**: 66.72% (target: 92%+)
- **Branches**: 54.96% (target: 80%+)
- **Lines**: 67.65% (target: 80%+)
- **Functions**: 39.04% (target: 80%+)
- **Test Suites**: 52/52 passing
- **Tests**: 784/784 passing

## 🛠️ Testing Stack

### Core Testing Tools

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **Testing Library User Event** - User interaction simulation
- **MSW** - API mocking
- **Storybook** - Visual testing and component documentation

### Additional Tools

- **Jest DOM** - Custom matchers for DOM testing
- **Jest Environment** - JSDOM environment for React testing
- **Coverage Reports** - Code coverage analysis
- **Visual Regression** - Storybook visual testing

## 🚀 Setup and Configuration

### 1. Install Dependencies

```bash
# Core testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Additional testing tools
npm install --save-dev msw @storybook/test-runner

# TypeScript support
npm install --save-dev @types/jest @types/testing-library__jest-dom
```

### 2. Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### 3. Jest Setup File

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

### 4. MSW Setup

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }),

  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json({ id: 3, ...newUser }, { status: 201 });
  }),
];
```

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

## 🧪 Writing Tests

### Unit Tests

#### Component Testing

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Hook Testing

```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(1));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(0);
  });
});
```

#### Utility Function Testing

```typescript
// utils.test.ts
import { formatDate, parseDate } from './dateUtils';

describe('dateUtils', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('15/01/2024');
  });

  it('parses date string correctly', () => {
    const dateString = '15/01/2024';
    const parsed = parseDate(dateString);
    expect(parsed).toEqual(new Date('2024-01-15'));
  });
});
```

### Integration Tests

#### API Integration

```typescript
// UserService.test.ts
import { server } from '../mocks/server';
import { UserService } from './UserService';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserService', () => {
  it('fetches users successfully', async () => {
    const users = await UserService.getUsers();

    expect(users).toHaveLength(2);
    expect(users[0]).toHaveProperty('id', 1);
    expect(users[0]).toHaveProperty('name', 'John Doe');
  });

  it('creates user successfully', async () => {
    const newUser = { name: 'Test User', email: 'test@example.com' };
    const createdUser = await UserService.createUser(newUser);

    expect(createdUser).toHaveProperty('id', 3);
    expect(createdUser).toHaveProperty('name', 'Test User');
  });
});
```

#### Component Integration

```typescript
// UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from './UserList';

describe('UserList', () => {
  it('displays users after loading', async () => {
    render(<UserList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

#### Playwright Setup

```typescript
// tests/e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test';

test('user can create and view a new user', async ({ page }) => {
  await page.goto('/users');

  // Click add user button
  await page.click('[data-testid="add-user-button"]');

  // Fill form
  await page.fill('[data-testid="user-name-input"]', 'Test User');
  await page.fill('[data-testid="user-email-input"]', 'test@example.com');

  // Submit form
  await page.click('[data-testid="submit-button"]');

  // Verify user appears in list
  await expect(page.locator('[data-testid="user-list"]')).toContainText('Test User');
});
```

## 🎨 Visual Testing

### Storybook Visual Tests

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};
```

### Chromatic Configuration

```javascript
// .storybook/main.js
module.exports = {
  addons: ['@storybook/addon-essentials', '@chromatic-com/storybook'],
};
```

## 📊 Coverage Reports

### Running Coverage

```bash
# Run tests with coverage
npm run test:coverage

# Generate coverage report
npm run test:coverage -- --coverage --watchAll=false
```

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

## 🚀 Running Tests

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"

# Run tests in specific directory
npm test -- src/components/
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 🔧 Testing Utilities

### Custom Render Function

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mock Data Factories

```typescript
// factories/userFactory.ts
import { faker } from '@faker-js/faker';

export const createUser = (overrides = {}) => ({
  id: faker.datatype.number(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  ...overrides,
});

export const createUserList = (count = 5) => Array.from({ length: count }, () => createUser());
```

### Test Helpers

```typescript
// test-helpers.ts
import { screen } from '@testing-library/react';

export const getByTestId = (testId: string) => screen.getByTestId(testId);

export const waitForElementToBeRemoved = (element: HTMLElement) =>
  screen.waitForElementToBeRemoved(element);

export const mockConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};
```

## 📚 Best Practices

### Test Organization

1. **Group Related Tests** - Use `describe` blocks to group related tests
2. **Clear Test Names** - Use descriptive test names that explain what's being tested
3. **Arrange-Act-Assert** - Structure tests with clear setup, execution, and verification
4. **One Assertion Per Test** - Keep tests focused on a single behavior

### Test Data

1. **Use Factories** - Create test data using factory functions
2. **Avoid Magic Numbers** - Use named constants instead of magic numbers
3. **Realistic Data** - Use realistic test data that matches production
4. **Clean Up** - Clean up test data after each test

### Performance

1. **Mock Heavy Dependencies** - Mock API calls, file system operations, etc.
2. **Use Shallow Rendering** - Use shallow rendering for simple component tests
3. **Avoid Unnecessary Renders** - Only render what's needed for the test
4. **Parallel Execution** - Run tests in parallel when possible

## 🆘 Troubleshooting

### Common Issues

#### Tests Not Running

```bash
# Clear Jest cache
npx jest --clearCache

# Check Jest configuration
npx jest --showConfig
```

#### Import Errors

```bash
# Check module resolution
npx jest --showConfig | grep moduleNameMapping
```

#### Coverage Issues

```bash
# Check coverage thresholds
npm run test:coverage -- --coverage --watchAll=false
```

### Debugging Tests

```typescript
// Debug test output
import { screen } from '@testing-library/react';

test('debug test', () => {
  render(<MyComponent />);
  screen.debug(); // Prints the rendered HTML
});
```

---

**Last Updated:** December 2024  
**Version:** 2.0.0  
**Status:** ✅ Complete
