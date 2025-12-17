# Error Handling Infrastructure

Comprehensive error handling system with React Error Boundaries and Sentry integration.

## 🛡️ Components

### ErrorBoundary

React Error Boundary component that catches JavaScript errors anywhere in the component tree.

```tsx
import { ErrorBoundary } from '@/infrastructure/error-handling';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>;
```

### PageError Widget

Reusable error UI component for displaying user-friendly error messages.

```tsx
import { PageError } from '@/widgets/PageError';

<PageError title="Something went wrong" description="Please try again later" />;
```

## 🔧 Features

- **Automatic Error Catching**: Catches all unhandled errors in React components
- **Sentry Integration**: Automatically reports errors to Sentry in production
- **Development Logging**: Console logging for development debugging
- **Suspense Integration**: Wraps error UI in Suspense for lazy loading
- **Type Safety**: Full TypeScript support with proper error types

## 📁 Structure

```
error-handling/
├── ui/
│   ├── ErrorBoundary.tsx      # Main error boundary component
│   └── ErrorBoundary.test.tsx # Tests
├── lib/
│   └── lib.ts                 # Error logging utilities
├── types/
│   └── types.ts               # TypeScript definitions
└── index.ts                   # Exports
```

## 🚀 Usage

### Basic Error Boundary

```tsx
import { ErrorBoundary } from '@/infrastructure/error-handling';

function App() {
  return (
    <ErrorBoundary>
      <MyApp />
    </ErrorBoundary>
  );
}
```

### Custom Error Handling

```tsx
import { logError } from '@/infrastructure/error-handling';

try {
  // Risky operation
} catch (error) {
  logError(error as Error, { componentStack: 'MyComponent' });
}
```

## ⚙️ Configuration

Error handling is automatically configured with:

- **Development**: Console logging
- **Production**: Sentry reporting
- **Testing**: Mocked for clean test runs

## 🧪 Testing

```tsx
import { ErrorBoundary } from '@/infrastructure/error-handling';

// Error boundary is tested with simulated errors
// Tests verify proper error catching and UI rendering
```

## 📝 Best Practices

1. **Wrap Critical Sections**: Use ErrorBoundary around important component trees
2. **Provide Fallback UI**: Always have a meaningful error message for users
3. **Don't Overwrap**: Don't wrap every component, use strategically
4. **Test Error States**: Write tests for error scenarios
5. **Monitor Production**: Use Sentry to track real-world errors
