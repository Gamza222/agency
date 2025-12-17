# Shared Layer

The shared layer contains reusable components, utilities, and libraries that can be used across the entire application.

## 🎯 Overview

The shared layer follows Feature-Sliced Design principles and provides:

- **UI Components** - Reusable React components
- **Utilities** - Helper functions and utilities
- **Development Tools** - Debug and development utilities
- **Types** - Shared TypeScript types and interfaces

## 📁 Structure

```
shared/
├── ui/                    # UI components
│   ├── Button/           # Button component
│   └── Text/             # Text component
├── lib/                  # Utilities and libraries
│   ├── classNames/       # Class name utility
│   ├── cva/              # Component Variant Architecture
│   └── dev-tools/        # Development tools
└── model/                # Types and models
    └── types/            # Shared types
```

## 🎨 UI Components

### **Button Component**

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/shared/ui/Button';

<Button variant="primary" size="large">
  Click me
</Button>;
```

**Features:**

- Multiple variants (primary, secondary, outline, ghost)
- Different sizes (small, medium, large)
- Loading state support
- Icon support
- Full accessibility compliance

### **Text Component**

Typography component for consistent text styling.

```tsx
import { Text } from '@/shared/ui/Text';

<Text variant="heading" size="xl">
  Main Heading
</Text>;
```

**Features:**

- Semantic variants (heading, body, caption, label)
- Responsive sizing
- Color theming
- Accessibility features

## 🛠️ Utilities

### **ClassNames Utility**

Utility for conditional class name handling.

```tsx
import { classNames } from '@/shared/lib/classNames';

const className = classNames(
  'base-class',
  {
    active: isActive,
    disabled: isDisabled,
  },
  ['additional-class']
);
```

### **CVA (Component Variant Architecture)**

Type-safe component variant system.

```tsx
import { cva } from '@/shared/lib/cva';

const buttonVariants = cva('base-button', {
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-600 text-white',
    },
  },
});
```

## 🛠️ Development Tools

### **Debug Panel**

Real-time debugging interface for development mode.

```tsx
import { DebugPanel } from '@/shared/lib/dev-tools';

<DebugPanel />;
```

**Features:**

- App state inspection
- Performance metrics
- Error monitoring
- Memory usage tracking

### **Performance Monitor**

Live performance metrics dashboard.

```tsx
import { PerformanceMonitor } from '@/shared/lib/dev-tools';

<PerformanceMonitor position="top-right" />;
```

**Features:**

- Bundle size tracking
- Render time monitoring
- Web Vitals display
- Memory usage metrics

### **Component Generator**

CLI tool for generating new components.

```bash
# Generate a Button component
npm run generate:component Button shared ui "Button component"

# Generate a utility
npm run generate:component classNames shared lib "Class name utility"
```

### **FSD Validator**

Architecture compliance checker.

```bash
npm run validate:fsd
```

**Features:**

- Import validation
- Layer boundary checking
- Architecture rule enforcement
- Warning system

## 🧪 Testing

### **Unit Tests**

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/shared/ui/Button';

test('button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### **Component Testing**

```tsx
import { render, screen } from '@testing-library/react';
import { Text } from '@/shared/ui/Text';

test('text applies correct variant classes', () => {
  render(
    <Text variant="heading" size="xl">
      Test
    </Text>
  );
  const element = screen.getByText('Test');
  expect(element).toHaveClass('text-3xl', 'font-bold');
});
```

## 📚 Usage Examples

### **Basic Component Usage**

```tsx
import { Button, Text } from '@/shared/ui';

function MyComponent() {
  return (
    <div>
      <Text variant="heading" size="lg">
        Welcome
      </Text>
      <Button variant="primary" size="medium">
        Get Started
      </Button>
    </div>
  );
}
```

### **Advanced Styling**

```tsx
import { Button } from '@/shared/ui/Button';
import { classNames } from '@/shared/lib/classNames';

function CustomButton({ isActive, className }) {
  return (
    <Button
      className={classNames(
        'custom-button',
        {
          active: isActive,
        },
        [className]
      )}
    >
      Custom Button
    </Button>
  );
}
```

### **Development Tools Integration**

```tsx
import { DebugPanel, PerformanceMonitor } from '@/shared/lib/dev-tools';

function App() {
  return (
    <div>
      <main>Your app content</main>

      {/* Development tools - only visible in development */}
      <DebugPanel />
      <PerformanceMonitor />
    </div>
  );
}
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Development mode (enables dev tools)
NODE_ENV=development
```

### **TypeScript Configuration**

```json
{
  "compilerOptions": {
    "paths": {
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't import from specific files
import { Button } from '@/shared/ui/Button/Button';

// Don't use dev tools in production
<DebugPanel />; // Will render in production if not properly configured
```

### **✅ Do**

```tsx
// Import from the layer root
import { Button } from '@/shared/ui';

// Check development mode
if (process.env.NODE_ENV === 'development') {
  return <DebugPanel />;
}
```

## 📚 Related Documentation

- [UI Components](./ui/README.md) - UI component documentation
- [Utilities](./lib/README.md) - Utility functions documentation
- [Development Tools](./lib/dev-tools/README.md) - Dev tools documentation
- [FSD Architecture](../../architecture/fsd-architecture.md) - Architecture principles

---

**Last Updated**: December 2024  
**Version**: 1.0.0
