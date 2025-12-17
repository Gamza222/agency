# Mock Factory Documentation

## Overview

The Mock Factory provides centralized, reusable mock utilities for testing across the application. It follows the Feature-Sliced Design (FSD) architecture and provides mocks organized by domain.

## Structure

```
src/shared/testing/mocks/
├── browser/           # Browser API mocks
├── infrastructure/    # Infrastructure service mocks
├── entities/          # Entity mocks
├── api/              # API mocks
├── assets/           # Asset mocks
├── errors/           # Error mocks
├── external/         # External service mocks
├── nextjs/           # Next.js specific mocks
├── node/             # Node.js mocks
└── index.ts          # Central exports
```

## Usage Patterns

### 1. Event Listeners

**Before (inline):**

```typescript
const eventListener = jest.fn();
TestEntity.addEventListener(EntityEvent.CREATED, eventListener);
```

**After (mock factory):**

```typescript
import { createMockEventListener } from '@/shared/testing/mocks';

const eventListener = createMockEventListener();
TestEntity.addEventListener(EntityEvent.CREATED, eventListener);
```

### 2. React Render Counters

**Before (inline):**

```typescript
const renderCount = jest.fn();
const { result } = renderHook(() => {
  renderCount();
  return useStore(store, (state) => state.todos.length);
});
```

**After (mock factory):**

```typescript
import { createMockRenderCounter } from '@/shared/testing/mocks';

const { renderCount } = createMockRenderCounter();
const { result } = renderHook(() => {
  renderCount();
  return useStore(store, (state) => state.todos.length);
});
```

### 3. API Responses

**Before (inline):**

```typescript
const mockResponse = {
  headers: {
    set: jest.fn(),
  },
  status: 200,
  // ... more properties
};
```

**After (mock factory):**

```typescript
import { createMockResponse } from '@/shared/testing/mocks';

const mockResponse = createMockResponse({
  status: 200,
  // ... overrides
});
```

### 4. Store Listeners

**Before (inline):**

```typescript
const listener = jest.fn();
const unsubscribe = store.subscribe(listener);
```

**After (mock factory):**

```typescript
import { createMockStoreListener } from '@/shared/testing/mocks';

const { listener } = createMockStoreListener();
const unsubscribe = store.subscribe(listener);
```

## Available Mock Utilities

### Browser Mocks (`@/shared/testing/mocks/browser`)

#### Event Mocks

- `createMockEventListener()` - Basic event listener mock
- `createMockEventListenerWithExpectations(expectedCalls)` - Event listener with call expectations
- `createMockEventListenerWithTracking()` - Event listener with call tracking
- `createMockEvent(type, data)` - Mock event object
- `createMockEventEmitter()` - Mock event emitter

#### React Mocks

- `createMockRenderCounter()` - Render counter for testing re-renders
- `createMockRenderCounterWithExpectations(expectedRenders)` - Render counter with expectations
- `createMockComponentProps<T>(overrides)` - Mock component props
- `createMockRef<T>(initialValue)` - Mock React ref
- `createMockCallbackRef<T>()` - Mock callback ref
- `createMockStateSetter<T>(initialValue)` - Mock state setter
- `createMockEffectCleanup()` - Mock effect cleanup function

### Infrastructure Mocks (`@/shared/testing/mocks/infrastructure`)

#### API Mocks

- `createMockResponse(overrides)` - Mock HTTP response
- `createMockNextResponse(overrides)` - Mock Next.js response
- `createMockRequest(overrides)` - Mock HTTP request
- `createMockApiError(status, message)` - Mock API error
- `createMockFetch(responses)` - Mock fetch function

#### State Management Mocks

- `createMockStoreListener()` - Mock store listener
- `createMockStoreListenerWithExpectations(expectedCalls)` - Store listener with expectations
- `createMockZustandStore<T>(initialState)` - Mock Zustand store
- `createMockStoreSelector<T, R>(selector)` - Mock store selector
- `createMockStoreAction<T, R>(action)` - Mock store action
- `createMockStoreMiddleware()` - Mock store middleware

## Migration Guide

### Step 1: Identify Inline Mocks

Look for patterns like:

- `jest.fn()` calls
- `mockImplementation` usage
- `mockReturnValue` usage
- Object literals with mock functions

### Step 2: Replace with Factory Mocks

1. Import the appropriate mock utility
2. Replace inline mock creation with factory function
3. Update test assertions if needed

### Step 3: Verify Tests

Ensure all tests still pass after migration.

## Best Practices

### 1. Use Descriptive Names

```typescript
// Good
const { listener: userCreatedListener } = createMockEventListener();

// Avoid
const listener = createMockEventListener();
```

### 2. Leverage Type Safety

```typescript
// Good - typed mock
const mockProps = createMockComponentProps<ButtonProps>({
  variant: 'primary',
  size: 'large',
});

// Avoid - untyped mock
const mockProps = { variant: 'primary', size: 'large' };
```

### 3. Use Expectations When Appropriate

```typescript
// Good - when you need to verify call count
const { listener } = createMockStoreListenerWithExpectations(2);

// Good - when you just need a basic mock
const { listener } = createMockStoreListener();
```

### 4. Group Related Mocks

```typescript
// Good - related mocks together
const { listener: createListener } = createMockEventListener();
const { listener: updateListener } = createMockEventListener();
const { listener: deleteListener } = createMockEventListener();
```

## Examples

### Testing Event Emission

```typescript
import { createMockEventListenerWithTracking } from '@/shared/testing/mocks';

describe('EventEmitter', () => {
  it('should emit events to listeners', () => {
    const { listener, getCalls } = createMockEventListenerWithTracking();
    emitter.addEventListener('test', listener);

    emitter.emit('test', { data: 'test' });

    expect(getCalls()).toHaveLength(1);
    expect(getLastCall()).toEqual([{ data: 'test' }]);
  });
});
```

### Testing React Hook Re-renders

```typescript
import { createMockRenderCounter } from '@/shared/testing/mocks';

describe('useCounter', () => {
  it('should re-render when count changes', () => {
    const { renderCount, getRenderCount } = createMockRenderCounter();

    const { result } = renderHook(() => {
      renderCount();
      return useCounter();
    });

    act(() => {
      result.current.increment();
    });

    expect(getRenderCount()).toBe(2);
  });
});
```

### Testing API Middleware

```typescript
import { createMockResponse, createMockRequest } from '@/shared/testing/mocks';

describe('SecurityHeadersMiddleware', () => {
  it('should apply security headers', () => {
    const mockResponse = createMockResponse();
    const mockRequest = createMockRequest();

    applySecurityHeaders(mockResponse);

    expect(mockResponse.headers.set).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
  });
});
```

## Contributing

When adding new mocks to the factory:

1. **Follow the existing patterns** - Use similar naming and structure
2. **Add TypeScript types** - Ensure proper type safety
3. **Include JSDoc comments** - Document parameters and return values
4. **Add to appropriate index file** - Export from the correct domain
5. **Update this documentation** - Add examples and usage patterns
6. **Write tests** - Ensure the mock utilities work correctly

## Common Patterns to Migrate

### Event Listeners

- `const listener = jest.fn();` → `const { listener } = createMockEventListener();`

### Render Counters

- `const renderCount = jest.fn();` → `const { renderCount } = createMockRenderCounter();`

### API Responses

- Manual response objects → `createMockResponse(overrides)`

### Store Listeners

- `const listener = jest.fn();` → `const { listener } = createMockStoreListener();`

### Component Props

- Manual prop objects → `createMockComponentProps<PropsType>(overrides)`

This mock factory provides a consistent, type-safe, and maintainable approach to testing across the application.
