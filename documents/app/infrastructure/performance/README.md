# Performance Infrastructure

Real-time performance monitoring infrastructure with Web Vitals tracking, custom metrics, and comprehensive performance analytics.

## 🎯 Overview

The performance infrastructure provides comprehensive monitoring capabilities for React applications, including Core Web Vitals tracking, custom performance metrics, and real-time performance analytics.

### **Key Features**

- ✅ **Web Vitals Tracking** - LCP, FCP, CLS, INP, TTFB
- ✅ **Custom Metrics** - Application-specific performance data
- ✅ **Real-time Monitoring** - Live performance insights
- ✅ **Performance Hooks** - React hooks for performance data
- ✅ **Performance Dashboard** - Visual performance monitoring
- ✅ **Production Ready** - Optimized for production use

## 🚀 Quick Start

```tsx
import { usePerformance } from '@/infrastructure/performance';
import { PerformanceProvider } from '@/infrastructure/performance';

// Wrap your app with the provider
function App() {
  return (
    <PerformanceProvider>
      <YourApp />
    </PerformanceProvider>
  );
}

// Use performance data in components
function PerformanceWidget() {
  const { metrics, loading, error } = usePerformance();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {metrics.map((metric) => (
        <div key={metric.name}>
          {metric.name}: {metric.value}
        </div>
      ))}
    </div>
  );
}
```

## 📋 API Reference

### **Performance Hooks**

#### `usePerformance()`

```tsx
const { metrics, loading, error, refresh } = usePerformance();
```

**Returns:**

- `metrics`: Array of performance metrics
- `loading`: Boolean indicating if metrics are loading
- `error`: Error object if metrics failed to load
- `refresh`: Function to refresh metrics

#### `useWebVitals()`

```tsx
const { lcp, fcp, cls, inp, ttfb } = useWebVitals();
```

**Returns:**

- `lcp`: Largest Contentful Paint value
- `fcp`: First Contentful Paint value
- `cls`: Cumulative Layout Shift value
- `inp`: Interaction to Next Paint value
- `ttfb`: Time to First Byte value

### **Performance Services**

#### `performanceMonitor`

```tsx
import { performanceMonitor } from '@/infrastructure/performance';

// Start monitoring
performanceMonitor.start();

// Stop monitoring
performanceMonitor.stop();

// Get current metrics
const metrics = performanceMonitor.getMetrics();

// Add custom metric
performanceMonitor.addMetric('custom-metric', 123);
```

## 🎨 Usage Examples

### **Basic Performance Monitoring**

```tsx
import { PerformanceProvider, usePerformance } from '@/infrastructure/performance';

function App() {
  return (
    <PerformanceProvider>
      <PerformanceWidget />
    </PerformanceProvider>
  );
}

function PerformanceWidget() {
  const { metrics, loading } = usePerformance();

  return (
    <div>
      <h3>Performance Metrics</h3>
      {loading ? (
        <p>Loading metrics...</p>
      ) : (
        <ul>
          {metrics.map((metric) => (
            <li key={metric.name}>
              {metric.name}: {metric.value}ms
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### **Web Vitals Monitoring**

```tsx
import { useWebVitals } from '@/infrastructure/performance';

function WebVitalsWidget() {
  const { lcp, fcp, cls, inp, ttfb } = useWebVitals();

  return (
    <div>
      <h3>Core Web Vitals</h3>
      <div>LCP: {lcp}ms</div>
      <div>FCP: {fcp}ms</div>
      <div>CLS: {cls}</div>
      <div>INP: {inp}ms</div>
      <div>TTFB: {ttfb}ms</div>
    </div>
  );
}
```

### **Custom Metrics**

```tsx
import { performanceMonitor } from '@/infrastructure/performance';

function CustomMetrics() {
  useEffect(() => {
    // Track custom metrics
    const startTime = performance.now();

    // Simulate some work
    setTimeout(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      performanceMonitor.addMetric('custom-operation', duration);
    }, 1000);
  }, []);

  return <div>Custom metrics tracking...</div>;
}
```

### **Performance Dashboard Integration**

```tsx
import { PerformanceDashboard } from '@/widgets/PerformanceDashboard';
import { PerformanceProvider } from '@/infrastructure/performance';

function App() {
  return (
    <PerformanceProvider>
      <main>Your app content</main>
      <PerformanceDashboard />
    </PerformanceProvider>
  );
}
```

## 🎯 Performance Metrics

### **Core Web Vitals**

| Metric   | Description               | Good Threshold | Poor Threshold |
| -------- | ------------------------- | -------------- | -------------- |
| **LCP**  | Largest Contentful Paint  | ≤ 2.5s         | > 4.0s         |
| **FCP**  | First Contentful Paint    | ≤ 1.8s         | > 3.0s         |
| **CLS**  | Cumulative Layout Shift   | ≤ 0.1          | > 0.25         |
| **INP**  | Interaction to Next Paint | ≤ 200ms        | > 500ms        |
| **TTFB** | Time to First Byte        | ≤ 800ms        | > 1.8s         |

### **Custom Metrics**

| Metric              | Description                    | Unit |
| ------------------- | ------------------------------ | ---- |
| **JS Load Time**    | JavaScript bundle loading time | ms   |
| **CSS Load Time**   | Stylesheet loading time        | ms   |
| **Image Load Time** | Image resource loading time    | ms   |
| **Font Load Time**  | Font resource loading time     | ms   |
| **Bundle Size**     | JavaScript bundle size         | KB   |
| **Memory Usage**    | Browser memory consumption     | MB   |

## 🧪 Testing

### **Unit Tests**

```tsx
import { renderHook } from '@testing-library/react';
import { usePerformance } from '@/infrastructure/performance';

test('usePerformance hook', () => {
  const { result } = renderHook(() => usePerformance());

  expect(result.current.metrics).toBeDefined();
  expect(result.current.loading).toBe(false);
});
```

### **Integration Tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { PerformanceProvider } from '@/infrastructure/performance';

test('integrates with performance monitoring', async () => {
  render(
    <PerformanceProvider>
      <PerformanceWidget />
    </PerformanceProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
  });
});
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Enable performance monitoring
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# Debug mode
NEXT_PUBLIC_DEBUG_PERFORMANCE=true

# Performance thresholds
NEXT_PUBLIC_PERFORMANCE_THRESHOLD_LCP=2500
NEXT_PUBLIC_PERFORMANCE_THRESHOLD_FCP=1800
NEXT_PUBLIC_PERFORMANCE_THRESHOLD_CLS=0.1
```

### **Performance Provider Configuration**

```tsx
import { PerformanceProvider } from '@/infrastructure/performance';

function App() {
  return (
    <PerformanceProvider
      config={{
        enableWebVitals: true,
        enableCustomMetrics: true,
        enableRealTimeMonitoring: true,
        thresholds: {
          lcp: 2500,
          fcp: 1800,
          cls: 0.1,
        },
      }}
    >
      <YourApp />
    </PerformanceProvider>
  );
}
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't use performance monitoring without provider
function Component() {
  const { metrics } = usePerformance(); // Will throw error
  return <div>{metrics.length}</div>;
}

// Don't forget to handle loading states
function Component() {
  const { metrics } = usePerformance();
  return <div>{metrics.map((m) => m.name)}</div>; // Will crash if loading
}

// Don't use in production without proper configuration
<PerformanceProvider>
  <App />
</PerformanceProvider>; // May impact performance
```

### **✅ Do**

```tsx
// Always wrap with provider
function App() {
  return (
    <PerformanceProvider>
      <YourApp />
    </PerformanceProvider>
  );
}

// Handle loading and error states
function Component() {
  const { metrics, loading, error } = usePerformance();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{metrics.map((m) => m.name)}</div>;
}

// Configure for production
<PerformanceProvider
  config={{
    enableWebVitals: true,
    enableCustomMetrics: false, // Disable in production
  }}
>
  <App />
</PerformanceProvider>;
```

## 🔄 Migration Guide

### **From Custom Performance Monitoring**

```tsx
// Before
const performanceData = useCustomPerformance();

// After
const { metrics, loading, error } = usePerformance();
```

### **From Third-party Solutions**

```tsx
// Before
import { useWebVitals } from 'react-web-vitals';

// After
import { useWebVitals } from '@/infrastructure/performance';
```

## 📚 Related Components

- [PerformanceDashboard Widget](../../widgets/PerformanceDashboard/README.md) - Visual performance monitoring
- [Performance Hooks](./hooks/README.md) - React hooks for performance
- [Web Vitals](./lib/web-vitals/README.md) - Web Vitals implementation
- [Performance Monitor](./lib/performance-monitor/README.md) - Core monitoring logic

---

**Last Updated**: December 2024  
**Version**: 1.0.0
