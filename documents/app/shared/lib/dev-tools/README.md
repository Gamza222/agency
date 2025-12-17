# Development Tools

Comprehensive development tools for enhanced developer experience and productivity.

## 🎯 Overview

The development tools provide debugging, performance monitoring, code generation, and architecture validation capabilities to streamline development workflow.

### **Key Features**

- ✅ **Debug Panel** - Real-time app state inspection
- ✅ **Performance Monitor** - Live performance metrics
- ✅ **Component Generator** - Automated component creation
- ✅ **FSD Validator** - Architecture compliance checking
- ✅ **Development Only** - Tools only available in development mode

## 🚀 Quick Start

```tsx
import { DebugPanel, PerformanceMonitor } from '@/shared/lib/dev-tools';

function App() {
  return (
    <div>
      <YourApp />

      {/* Development tools - only visible in development */}
      <DebugPanel />
      <PerformanceMonitor />
    </div>
  );
}
```

## 📋 Available Tools

### **🐛 Debug Panel**

Real-time debugging interface for inspecting app state and performance.

**Features:**

- App state inspection
- Performance metrics display
- Error monitoring
- Memory usage tracking

**Usage:**

```tsx
import { DebugPanel } from '@/shared/lib/dev-tools';

<DebugPanel />;
```

### **📊 Performance Monitor**

Live performance dashboard with Web Vitals and resource monitoring.

**Features:**

- Bundle size tracking
- Render time monitoring
- Memory usage display
- Web Vitals (LCP, FCP, CLS)

**Usage:**

```tsx
import { PerformanceMonitor } from '@/shared/lib/dev-tools';

<PerformanceMonitor position="top-right" />;
```

### **⚡ Component Generator**

CLI tool for generating new components with proper FSD structure.

**Features:**

- FSD-compliant file structure
- TypeScript support
- Test files generation
- Storybook stories creation

**Usage:**

```bash
# Generate a Button component
npm run generate:component Button

# Generate a UserCard widget
npm run generate:component UserCard widgets ui

# Generate an AuthService
npm run generate:component AuthService infrastructure lib
```

### **🔧 FSD Validator**

Architecture compliance checker for Feature-Sliced Design rules.

**Features:**

- Import validation
- Layer boundary checking
- Architecture rule enforcement
- Warning system

**Usage:**

```bash
# Validate FSD architecture
npm run validate:fsd
```

## 🎨 Usage Examples

### **Basic Setup**

```tsx
import { DebugPanel, PerformanceMonitor } from '@/shared/lib/dev-tools';

function App() {
  return (
    <div>
      <main>Your application content</main>

      {/* Development tools */}
      <DebugPanel />
      <PerformanceMonitor />
    </div>
  );
}
```

### **Custom Positioning**

```tsx
import { PerformanceMonitor } from '@/shared/lib/dev-tools';

function App() {
  return (
    <div>
      <main>Your application content</main>

      {/* Custom position */}
      <PerformanceMonitor position="bottom-left" />
    </div>
  );
}
```

### **Component Generation Workflow**

```bash
# 1. Generate a new component
npm run generate:component UserProfile shared ui "User profile component"

# 2. Validate architecture
npm run validate:fsd

# 3. Run tests
npm test -- --testPathPattern=UserProfile

# 4. Start Storybook to see the component
npm run storybook
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Development mode (enables dev tools)
NODE_ENV=development
```

### **Debug Panel Configuration**

```tsx
import { DebugPanel } from '@/shared/lib/dev-tools';

<DebugPanel
  className="custom-debug-panel"
  // Additional props can be added as needed
/>;
```

### **Performance Monitor Configuration**

```tsx
import { PerformanceMonitor } from '@/shared/lib/dev-tools';

<PerformanceMonitor
  position="top-right" // top-left, top-right, bottom-left, bottom-right
  className="custom-perf-monitor"
/>;
```

## 🧪 Testing

### **Unit Tests**

```tsx
import { render, screen } from '@testing-library/react';
import { DebugPanel } from '@/shared/lib/dev-tools';

test('debug panel renders in development', () => {
  // Mock development environment
  process.env.NODE_ENV = 'development';

  render(<DebugPanel />);
  expect(screen.getByText('Debug')).toBeInTheDocument();
});

test('debug panel does not render in production', () => {
  // Mock production environment
  process.env.NODE_ENV = 'production';

  const { container } = render(<DebugPanel />);
  expect(container.firstChild).toBeNull();
});
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't use dev tools in production
<DebugPanel />; // Will render in production if not properly configured

// Don't forget to handle development mode
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  // Dev tools logic
}
```

### **✅ Do**

```tsx
// Always check development mode
import { isDevelopment } from '@/shared/lib/dev-tools';

if (isDevelopment) {
  return <DebugPanel />;
}

// Use proper positioning
<PerformanceMonitor position="top-right" />;
```

## 📚 Related Components

- [Debug Panel](./debug-panel/README.md) - Debug panel documentation
- [Performance Monitor](./performance-monitor/README.md) - Performance monitor documentation
- [Component Generator](./component-generator/README.md) - Component generator documentation
- [FSD Validator](./fsd-validator/README.md) - FSD validator documentation

---

**Last Updated**: December 2024  
**Version**: 1.0.0
