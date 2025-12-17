# Providers Infrastructure

React context providers for cross-cutting concerns like theming, data fetching, and error tracking.

## 🎯 Available Providers

### Theme Provider

Manages application theme state (light/dark mode) with persistence.

```tsx
import { ThemeProvider, useTheme } from '@/infrastructure/providers/theme';

function App() {
  return (
    <ThemeProvider initialTheme="light">
      <MyApp />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();

  return <button onClick={toggleTheme}>Switch to {isDark ? 'light' : 'dark'} mode</button>;
}
```

### Query Provider

React Query provider for server state management.

```tsx
import { QueryProvider } from '@/infrastructure/providers/query';

function App() {
  return (
    <QueryProvider>
      <MyApp />
    </QueryProvider>
  );
}
```

### Sentry Provider

Error tracking and monitoring with Sentry integration.

```tsx
import { SentryProvider } from '@/infrastructure/providers/sentry';

function App() {
  return (
    <SentryProvider dsn="your-sentry-dsn">
      <MyApp />
    </SentryProvider>
  );
}
```

## 🏗️ Architecture

Each provider follows a consistent structure:

```
providers/
├── theme/
│   ├── lib/
│   │   ├── themeContext.ts    # React context
│   │   └── useTheme.ts        # Custom hook
│   ├── ui/
│   │   └── themeProvider.tsx  # Provider component
│   └── index.ts               # Exports
├── query/
│   ├── ui/
│   │   └── queryProvider.tsx  # QueryClient wrapper
│   └── index.ts
└── sentry/
    ├── ui/
    │   └── sentryProvider.tsx # Sentry initialization
    └── index.ts
```

## 🎨 Theme System

### Features

- **Light/Dark Mode**: Automatic theme switching
- **System Preference**: Respects user's OS theme preference
- **Persistence**: Saves theme choice in localStorage
- **Type Safety**: Full TypeScript support
- **CSS Variables**: Uses CSS custom properties for theming

### Usage

```tsx
// Provider setup
<ThemeProvider initialTheme="light">

// Hook usage
const { theme, toggleTheme, isDark } = useTheme();

// CSS classes automatically applied to document.body
// Use CSS custom properties in your styles
```

### CSS Integration

```scss
.my-component {
  background-color: var(--color-background);
  color: var(--color-text);
}
```

## 🔄 Query System

### Features

- **Server State**: Manages server-side data fetching
- **Caching**: Automatic request deduplication and caching
- **Background Updates**: Automatic refetching and synchronization
- **Error Handling**: Built-in error states and retry logic
- **DevTools**: React Query DevTools integration

### Usage

```tsx
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.map((user) => user.name)}</div>;
}
```

## 🛡️ Sentry Integration

### Features

- **Error Tracking**: Automatic error capture and reporting
- **Performance Monitoring**: Tracks performance metrics
- **Release Tracking**: Monitors application releases
- **User Context**: Associates errors with user sessions
- **Environment Aware**: Different configs for dev/prod

### Configuration

```tsx
<SentryProvider dsn="your-sentry-dsn" environment="production" tracesSampleRate={0.1} debug={false}>
  <App />
</SentryProvider>
```

## 🧪 Testing

All providers include comprehensive tests:

```tsx
// Theme provider tests
import { ThemeProvider, useTheme } from '@/infrastructure/providers/theme';

// Query provider tests
import { QueryProvider } from '@/infrastructure/providers/query';

// Sentry provider tests
import { SentryProvider } from '@/infrastructure/providers/sentry';
```

## 📝 Best Practices

1. **Provider Order**: Wrap providers in the correct order (outermost to innermost)
2. **Error Boundaries**: Always wrap providers with error boundaries
3. **Performance**: Use React.memo for provider components when needed
4. **Testing**: Mock providers in tests to isolate component behavior
5. **Configuration**: Use environment variables for provider configuration

## 🔧 Provider Composition

```tsx
function App() {
  return (
    <SentryProvider>
      <QueryProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <MyApp />
          </ErrorBoundary>
        </ThemeProvider>
      </QueryProvider>
    </SentryProvider>
  );
}
```
