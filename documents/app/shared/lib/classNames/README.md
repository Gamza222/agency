# classNames Utility

A utility function for conditionally joining CSS class names together. Provides a clean and efficient way to handle dynamic styling in React components.

## 🎯 Overview

The `classNames` utility is a lightweight helper that combines multiple class names into a single string, with support for conditional classes and various input types.

### **Key Features**

- ✅ **Conditional Classes** - Support for boolean conditions
- ✅ **Multiple Input Types** - Strings, objects, arrays
- ✅ **TypeScript Support** - Full type safety
- ✅ **Performance** - Optimized for production use
- ✅ **Zero Dependencies** - No external dependencies

## 🚀 Quick Start

```tsx
import { classNames } from '@/shared/lib/classNames';

// Basic usage
const className = classNames('button', 'button--primary');

// Conditional classes
const className = classNames('button', {
  'button--primary': isPrimary,
  'button--disabled': isDisabled,
});

// Multiple conditions
const className = classNames('button', 'button--large', {
  'button--primary': variant === 'primary',
  'button--secondary': variant === 'secondary',
  'button--disabled': disabled,
});
```

## 📋 API Reference

### **Function Signature**

```tsx
function classNames(...args: (string | object | undefined | null | false)[]): string;
```

### **Parameters**

| Parameter | Type                                                 | Description                        |
| --------- | ---------------------------------------------------- | ---------------------------------- |
| `...args` | `(string \| object \| undefined \| null \| false)[]` | Class names or conditional objects |

### **Return Value**

| Type     | Description                 |
| -------- | --------------------------- |
| `string` | Combined class names string |

## 🎨 Usage Examples

### **Basic String Concatenation**

```tsx
// Simple string concatenation
const className = classNames('button', 'button--primary');
// Result: "button button--primary"

// With additional classes
const className = classNames('button', 'button--primary', 'button--large');
// Result: "button button--primary button--large"
```

### **Conditional Classes**

```tsx
// Boolean conditions
const className = classNames('button', {
  'button--primary': isPrimary,
  'button--disabled': isDisabled,
});

// Example usage
const isPrimary = true;
const isDisabled = false;
// Result: "button button--primary"
```

### **Object Syntax**

```tsx
// Object with boolean values
const className = classNames('button', {
  'button--primary': variant === 'primary',
  'button--secondary': variant === 'secondary',
  'button--disabled': disabled,
  'button--loading': loading,
});

// Example usage
const variant = 'primary';
const disabled = false;
const loading = true;
// Result: "button button--primary button--loading"
```

### **Array Syntax**

```tsx
// Array of class names
const className = classNames([
  'button',
  'button--primary',
  isDisabled && 'button--disabled',
  isLoading && 'button--loading',
]);

// Example usage
const isDisabled = true;
const isLoading = false;
// Result: "button button--primary button--disabled"
```

### **Mixed Syntax**

```tsx
// Combining different input types
const className = classNames(
  'button',
  'button--base',
  {
    'button--primary': variant === 'primary',
    'button--secondary': variant === 'secondary',
  },
  isDisabled && 'button--disabled',
  isLoading && 'button--loading'
);

// Example usage
const variant = 'secondary';
const isDisabled = false;
const isLoading = true;
// Result: "button button--base button--secondary button--loading"
```

## 🎯 Real-World Examples

### **Button Component**

```tsx
import { classNames } from '@/shared/lib/classNames';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

function Button({ variant, size, disabled, loading, className, ...props }) {
  const buttonClass = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    {
      'button--disabled': disabled,
      'button--loading': loading,
    },
    className
  );

  return <button className={buttonClass} {...props} />;
}
```

### **Card Component**

```tsx
import { classNames } from '@/shared/lib/classNames';

interface CardProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

function Card({ variant, padding, hover, className, children, ...props }) {
  const cardClass = classNames(
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    {
      'card--hover': hover,
    },
    className
  );

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
}
```

### **Form Field Component**

```tsx
import { classNames } from '@/shared/lib/classNames';

interface FormFieldProps {
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function FormField({ error, required, disabled, className, children, ...props }) {
  const fieldClass = classNames(
    'form-field',
    {
      'form-field--error': !!error,
      'form-field--required': required,
      'form-field--disabled': disabled,
    },
    className
  );

  return (
    <div className={fieldClass} {...props}>
      {children}
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
```

### **Navigation Component**

```tsx
import { classNames } from '@/shared/lib/classNames';

interface NavItemProps {
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

function NavItem({ active, disabled, className, children, ...props }) {
  const itemClass = classNames(
    'nav-item',
    {
      'nav-item--active': active,
      'nav-item--disabled': disabled,
    },
    className
  );

  return (
    <li className={itemClass} {...props}>
      {children}
    </li>
  );
}
```

## 🎨 Advanced Patterns

### **Theme-based Classes**

```tsx
// Theme-based conditional classes
const className = classNames('component', {
  'component--dark': theme === 'dark',
  'component--light': theme === 'light',
  'component--high-contrast': highContrast,
});
```

### **Responsive Classes**

```tsx
// Responsive design classes
const className = classNames('grid', {
  'grid--mobile': screenSize === 'mobile',
  'grid--tablet': screenSize === 'tablet',
  'grid--desktop': screenSize === 'desktop',
});
```

### **State-based Classes**

```tsx
// Component state classes
const className = classNames('modal', {
  'modal--open': isOpen,
  'modal--closing': isClosing,
  'modal--backdrop': showBackdrop,
  'modal--fullscreen': fullscreen,
});
```

### **Animation Classes**

```tsx
// Animation state classes
const className = classNames('element', {
  'element--entering': isEntering,
  'element--entered': isEntered,
  'element--exiting': isExiting,
  'element--exited': isExited,
});
```

## 🧪 Testing

### **Unit Tests**

```tsx
import { classNames } from '@/shared/lib/classNames';

describe('classNames', () => {
  test('combines string arguments', () => {
    expect(classNames('a', 'b', 'c')).toBe('a b c');
  });

  test('handles conditional objects', () => {
    expect(classNames('a', { b: true, c: false })).toBe('a b');
  });

  test('filters out falsy values', () => {
    expect(classNames('a', null, undefined, false, 'b')).toBe('a b');
  });

  test('handles empty arguments', () => {
    expect(classNames()).toBe('');
  });

  test('handles mixed arguments', () => {
    expect(classNames('a', { b: true }, 'c', { d: false })).toBe('a b c');
  });
});
```

### **Integration Tests**

```tsx
import { render } from '@testing-library/react';
import { classNames } from '@/shared/lib/classNames';

test('works with React components', () => {
  const className = classNames('button', { 'button--primary': true });
  const { container } = render(<button className={className}>Click me</button>);

  expect(container.firstChild).toHaveClass('button', 'button--primary');
});
```

## 🎨 Styling Integration

### **CSS Modules**

```tsx
import styles from './Button.module.scss';
import { classNames } from '@/shared/lib/classNames';

function Button({ variant, disabled, className }) {
  const buttonClass = classNames(
    styles.button,
    styles[`button--${variant}`],
    {
      [styles['button--disabled']]: disabled,
    },
    className
  );

  return <button className={buttonClass} />;
}
```

### **Tailwind CSS**

```tsx
import { classNames } from '@/shared/lib/classNames';

function Button({ variant, size, disabled, className }) {
  const buttonClass = classNames(
    'px-4 py-2 rounded font-medium transition-colors',
    {
      'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
      'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
      'opacity-50 cursor-not-allowed': disabled,
    },
    {
      'text-sm px-3 py-1': size === 'sm',
      'text-base px-4 py-2': size === 'md',
      'text-lg px-6 py-3': size === 'lg',
    },
    className
  );

  return <button className={buttonClass} />;
}
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't use string concatenation
const className = 'button' + (isPrimary ? ' button--primary' : '');

// Don't use template literals for simple cases
const className = `button ${isPrimary ? 'button--primary' : ''}`;

// Don't forget to handle falsy values
const className = classNames(
  'button',
  isPrimary && 'button--primary',
  isDisabled && 'button--disabled'
);
// This will include 'false' in the string if isDisabled is false
```

### **✅ Do**

```tsx
// Use classNames utility
const className = classNames('button', {
  'button--primary': isPrimary,
  'button--disabled': isDisabled,
});

// Handle falsy values properly
const className = classNames('button', {
  'button--primary': isPrimary,
  'button--disabled': isDisabled,
});

// Use for complex conditions
const className = classNames('button', {
  'button--primary': variant === 'primary',
  'button--secondary': variant === 'secondary',
  'button--disabled': disabled || loading,
});
```

## 🔄 Migration Guide

### **From String Concatenation**

```tsx
// Before
const className =
  'button' + (isPrimary ? ' button--primary' : '') + (isDisabled ? ' button--disabled' : '');

// After
const className = classNames('button', {
  'button--primary': isPrimary,
  'button--disabled': isDisabled,
});
```

### **From Template Literals**

```tsx
// Before
const className = `button ${isPrimary ? 'button--primary' : ''} ${isDisabled ? 'button--disabled' : ''}`;

// After
const className = classNames('button', {
  'button--primary': isPrimary,
  'button--disabled': isDisabled,
});
```

## 📚 Related Utilities

- [CVA Utility](../cva/README.md) - Component Variant Architecture
- [CSS Utilities](../../lib/css/README.md) - CSS helper utilities
- [Style Utilities](../../lib/styles/README.md) - Style-related utilities

---

**Last Updated**: December 2024  
**Version**: 1.0.0
