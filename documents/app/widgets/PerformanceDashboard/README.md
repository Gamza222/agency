# PerformanceDashboard Widget

A real-time performance monitoring dashboard that displays Web Vitals and custom performance metrics. Built for development and production monitoring.

## 🎯 Overview

The PerformanceDashboard provides real-time insights into application performance, displaying key metrics like LCP, FCP, CLS, and custom performance data.

### **Key Features**

- ✅ **Real-time Monitoring** - Live performance metrics
- ✅ **Web Vitals Integration** - Core Web Vitals tracking
- ✅ **Custom Metrics** - Application-specific performance data
- ✅ **Keyboard Shortcut** - Toggle with Ctrl+Shift+P
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Production Ready** - Optimized for production use

## 🚀 Quick Start

```tsx
import { PerformanceDashboard } from '@/widgets/PerformanceDashboard';

// Basic usage
<PerformanceDashboard />;

// The dashboard is automatically initialized and can be toggled with Ctrl+Shift+P
```

## 📋 API Reference

### **Props**

| Prop | Type | Default | Description                     |
| ---- | ---- | ------- | ------------------------------- |
| None | -    | -       | The component is self-contained |

### **Keyboard Shortcuts**

| Shortcut       | Action           | Description                         |
| -------------- | ---------------- | ----------------------------------- |
| `Ctrl+Shift+P` | Toggle Dashboard | Show/hide the performance dashboard |

## 🎨 Usage Examples

### **Basic Implementation**

```tsx
// In your main layout or app component
import { PerformanceDashboard } from '@/widgets/PerformanceDashboard';

function App() {
  return (
    <div>
      {/* Your app content */}
      <main>...</main>

      {/* Performance dashboard */}
      <PerformanceDashboard />
    </div>
  );
}
```

### **Conditional Rendering**

```tsx
// Only show in development
import { PerformanceDashboard } from '@/widgets/PerformanceDashboard';

function App() {
  return (
    <div>
      <main>...</main>
      {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
    </div>
  );
}
```

### **With Custom Styling**

```tsx
// Custom dashboard positioning
<div className="relative">
  <main>...</main>
  <div className="fixed top-4 right-4 z-50">
    <PerformanceDashboard />
  </div>
</div>
```

## 🎯 Design Patterns

### **Development Environment**

```tsx
// Development-only dashboard
function App() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div>
      <main>...</main>
      {isDevelopment && <PerformanceDashboard />}
    </div>
  );
}
```

### **Production Monitoring**

```tsx
// Production monitoring with feature flag
function App() {
  const showPerformanceDashboard = useFeatureFlag('performance-dashboard');

  return (
    <div>
      <main>...</main>
      {showPerformanceDashboard && <PerformanceDashboard />}
    </div>
  );
}
```

### **Debug Mode**

```tsx
// Debug mode toggle
function App() {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div>
      <main>...</main>
      {debugMode && <PerformanceDashboard />}
      <button onClick={() => setDebugMode(!debugMode)}>Toggle Debug</button>
    </div>
  );
}
```

## 📊 Metrics Displayed

### **Summary Metrics**

- **Total Metrics**: Number of metrics collected
- **Good**: Metrics within acceptable range
- **Needs Improvement**: Metrics requiring attention
- **Poor**: Metrics below acceptable thresholds

### **Web Vitals**

- **LCP (Largest Contentful Paint)**: Loading performance
- **FCP (First Contentful Paint)**: First paint performance
- **CLS (Cumulative Layout Shift)**: Visual stability
- **INP (Interaction to Next Paint)**: Interactivity
- **TTFB (Time to First Byte)**: Server response time

### **Custom Metrics**

- **JS Load Time**: JavaScript bundle loading
- **CSS Load Time**: Stylesheet loading
- **Image Load Time**: Image resource loading
- **Font Load Time**: Font resource loading
- **Bundle Size**: JavaScript bundle size
- **Memory Usage**: Browser memory consumption

## 🎨 Styling

### **CSS Classes**

```css
.performance-dashboard {
  /* Main dashboard container */
}

.performance-dashboard__header {
  /* Dashboard header with title and close button */
}

.performance-dashboard__summary {
  /* Summary metrics display */
}

.performance-dashboard__metrics {
  /* Individual metrics list */
}

.performance-dashboard__metric-item {
  /* Individual metric row */
}

.performance-dashboard__actions {
  /* Action buttons container */
}
```

### **Custom Styling**

```tsx
// Custom dashboard styles
<div className="performance-dashboard custom-dashboard">
  <PerformanceDashboard />
</div>
```

```css
.custom-dashboard {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

## ♿ Accessibility

### **Keyboard Navigation**

- **Tab**: Navigate through dashboard elements
- **Enter**: Activate buttons
- **Escape**: Close dashboard (if implemented)

### **Screen Reader Support**

```tsx
// Dashboard includes proper ARIA labels
<div
  className="performance-dashboard"
  role="dialog"
  aria-labelledby="dashboard-title"
  aria-describedby="dashboard-description"
>
  <h3 id="dashboard-title">Performance Dashboard</h3>
  <p id="dashboard-description">Real-time performance metrics and Web Vitals data</p>
</div>
```

### **Focus Management**

- Proper focus order
- Focus trap when dashboard is open
- Clear focus indicators

## 🧪 Testing

### **Unit Tests**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PerformanceDashboard } from '@/widgets/PerformanceDashboard';

test('renders performance dashboard', () => {
  render(<PerformanceDashboard />);
  expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
});

test('displays metrics when available', () => {
  // Mock performance data
  render(<PerformanceDashboard />);
  expect(screen.getByText('Total Metrics:')).toBeInTheDocument();
});
```

### **Integration Tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { PerformanceDashboard } from '@/widgets/PerformanceDashboard';

test('updates metrics in real-time', async () => {
  render(<PerformanceDashboard />);

  // Wait for metrics to load
  await waitFor(() => {
    expect(screen.getByText('Total Metrics:')).toBeInTheDocument();
  });
});
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't render in production without feature flag
<PerformanceDashboard /> // Always visible

// Don't forget to handle performance monitor errors
<PerformanceDashboard /> // No error handling

// Don't use for user-facing features
<PerformanceDashboard /> // Not for end users
```

### **✅ Do**

```tsx
// Use feature flags for production
{
  isDevelopment && <PerformanceDashboard />;
}

// Handle errors gracefully
<ErrorBoundary>
  <PerformanceDashboard />
</ErrorBoundary>;

// Use for development and debugging
{
  debugMode && <PerformanceDashboard />;
}
```

## 🔄 Migration Guide

### **From Custom Performance Components**

```tsx
// Before
<CustomPerformanceWidget />

// After
<PerformanceDashboard />
```

### **From Third-party Solutions**

```tsx
// Before
<ReactPerfMonitor />

// After
<PerformanceDashboard />
```

## 📚 Related Components

- [Performance Hooks](../../infrastructure/performance/hooks/README.md) - Performance monitoring hooks
- [Web Vitals](../../infrastructure/performance/lib/web-vitals/README.md) - Web Vitals implementation
- [Performance Monitor](../../infrastructure/performance/lib/performance-monitor/README.md) - Core monitoring logic

## 🔧 Configuration

### **Environment Variables**

```bash
# Enable performance monitoring
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# Debug mode
NEXT_PUBLIC_DEBUG_PERFORMANCE=true
```

### **Feature Flags**

```tsx
// Enable/disable dashboard
const showDashboard = useFeatureFlag('performance-dashboard');
```

---

**Last Updated**: December 2024  
**Version**: 1.0.0
