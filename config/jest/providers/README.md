# 🧩 Test Providers Guide

This directory contains test providers that wrap components with necessary context for testing.

## 📋 **Available Providers**

### 1. **RouterWrapper**

- **Purpose**: Provides Next.js router context for testing
- **Use when**: Components use `useRouter()`, `usePathname()`, `router.push()`, etc.

### 2. **ErrorBoundaryWrapper**

- **Purpose**: Provides consistent error boundary testing context
- **Use when**: Testing error handling scenarios or components that might throw errors

## 🚀 **Quick Start**

```typescript
import { RouterWrapper, ErrorBoundaryWrapper } from '@/config/jest/providers';
import { render, screen } from '@testing-library/react';

// Basic router testing
const wrapper = ({ children }) => (
  <RouterWrapper router={{ pathname: '/dashboard' }}>
    {children}
  </RouterWrapper>
);

render(<MyComponent />, { wrapper });
```

## 📖 **Detailed Examples**

### **RouterWrapper Examples**

```typescript
import { RouterWrapper } from '@/config/jest/providers';
import { render, screen } from '@testing-library/react';

// 1. Component that uses useRouter()
const NavigationComponent = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.push('/profile')}>
      Go to Profile
    </button>
  );
};

test('navigation works', () => {
  const mockPush = jest.fn();
  const wrapper = ({ children }) => (
    <RouterWrapper router={{ push: mockPush }}>
      {children}
    </RouterWrapper>
  );

  render(<NavigationComponent />, { wrapper });

  fireEvent.click(screen.getByText('Go to Profile'));
  expect(mockPush).toHaveBeenCalledWith('/profile');
});

// 2. Component that reads route parameters
const ProfileComponent = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>Profile ID: {id}</div>;
};

test('displays route parameters', () => {
  const wrapper = ({ children }) => (
    <RouterWrapper router={{ query: { id: '123' } }}>
      {children}
    </RouterWrapper>
  );

  render(<ProfileComponent />, { wrapper });
  expect(screen.getByText('Profile ID: 123')).toBeInTheDocument();
});
```

### **ErrorBoundaryWrapper Examples**

```typescript
import { ErrorBoundaryWrapper } from '@/config/jest/providers';
import { render, screen } from '@testing-library/react';

// 1. Testing error scenarios
const ThrowingComponent = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Component error');
  }
  return <div>No error</div>;
};

test('error boundary catches errors', () => {
  const wrapper = ({ children }) => (
    <ErrorBoundaryWrapper>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ErrorBoundaryWrapper>
  );

  render(<ThrowingComponent />, { wrapper });

  expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  expect(screen.getByTestId('error-boundary-wrapper')).toBeInTheDocument();
});
```

### **Combined Provider Usage**

```typescript
import { RouterWrapper, ErrorBoundaryWrapper } from '@/config/jest/providers';

// Component that needs both router and error boundary context
const ComplexComponent = () => {
  const router = useRouter();
  const [error, setError] = useState(false);

  if (error) throw new Error('Something went wrong');

  return (
    <div>
      <p>Current path: {router.pathname}</p>
      <button onClick={() => setError(true)}>Trigger Error</button>
    </div>
  );
};

test('complex component with both contexts', () => {
  const wrapper = ({ children }) => (
    <RouterWrapper router={{ pathname: '/dashboard' }}>
      <ErrorBoundaryWrapper>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ErrorBoundaryWrapper>
    </RouterWrapper>
  );

  render(<ComplexComponent />, { wrapper });

  expect(screen.getByText('Current path: /dashboard')).toBeInTheDocument();

  // Test error scenario
  fireEvent.click(screen.getByText('Trigger Error'));
  expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
});
```

## 🔧 **Why These Providers Exist**

### **Problem They Solve**

- **Context Dependencies**: Components often need router context or error boundary context
- **Test Isolation**: Tests should be isolated and not depend on actual routing or error handling
- **Consistency**: Provides consistent mocking patterns across tests

### **When NOT to Use Them**

- **Simple components**: Components that don't use router hooks or throw errors
- **Unit tests**: Testing individual functions or hooks in isolation
- **Integration tests**: When you want to test with real routing behavior

## 📋 **Migration Guide**

### **From Manual Setup to Providers**

**Before (Manual Setup)**:

```typescript
// Old way - manual router mocking
const mockRouter = {
  push: jest.fn(),
  pathname: '/dashboard',
  query: {},
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));
```

**After (Using RouterWrapper)**:

```typescript
// New way - using RouterWrapper
import { RouterWrapper } from '@/config/jest/providers';

const wrapper = ({ children }) => (
  <RouterWrapper router={{ push: jest.fn(), pathname: '/dashboard' }}>
    {children}
  </RouterWrapper>
);

render(<MyComponent />, { wrapper });
```

### **Benefits of Migration**

1. **Cleaner tests**: No more global mocks
2. **Better isolation**: Each test can have different router state
3. **Type safety**: Full TypeScript support
4. **Reusability**: Consistent patterns across tests

## 🎯 **Best Practices**

### **✅ DO**

- Use RouterWrapper for any component that uses Next.js router hooks
- Use ErrorBoundaryWrapper when testing error scenarios
- Combine providers when components need multiple contexts
- Keep provider configuration close to the test that uses it

### **❌ DON'T**

- Use providers for components that don't need them
- Create global provider setups that affect all tests
- Mock router globally when you can use RouterWrapper
- Forget to clean up mock functions between tests

## 🔍 **Troubleshooting**

### **Common Issues**

1. **"useRouter hook not found"**

   - Solution: Wrap your component with RouterWrapper

2. **"Cannot read properties of undefined (reading 'push')"**

   - Solution: Provide router methods in RouterWrapper config

3. **"Error boundary not catching errors"**

   - Solution: Make sure ErrorBoundary is inside ErrorBoundaryWrapper

4. **"Tests are interfering with each other"**
   - Solution: Use beforeEach to reset mocks and provide fresh provider instances

### **Debug Tips**

```typescript
// Debug router state
const wrapper = ({ children }) => (
  <RouterWrapper router={{
    pathname: '/test',
    push: jest.fn().mockImplementation(console.log) // See what's being called
  }}>
    {children}
  </RouterWrapper>
);

// Debug error boundary
const wrapper = ({ children }) => (
  <ErrorBoundaryWrapper>
    <ErrorBoundary onError={console.error}> {/* Log errors */}
      {children}
    </ErrorBoundary>
  </ErrorBoundaryWrapper>
);
```

---

**Remember**: Providers are tools to make testing easier. Use them when they add value, not just because they exist!
