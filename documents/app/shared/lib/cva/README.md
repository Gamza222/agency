# CVA (Component Variant Architecture) Utility

A utility for creating type-safe component variants using a declarative API. CVA provides a clean way to define component styles with variants, compound variants, and default classes.

## 🎯 Overview

CVA (Component Variant Architecture) is a utility that helps create consistent, type-safe component variants. It's particularly useful for building design systems and component libraries.

### **Key Features**

- ✅ **Type-Safe Variants** - Full TypeScript support
- ✅ **Compound Variants** - Complex variant combinations
- ✅ **Default Classes** - Base styles for all variants
- ✅ **Conditional Logic** - Smart variant resolution
- ✅ **Performance** - Optimized for production use

## 🚀 Quick Start

```tsx
import { cva } from '@/shared/lib/cva';

// Define button variants
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Use in component
function Button({ variant, size, className, ...props }) {
  return <button className={buttonVariants({ variant, size, className })} {...props} />;
}
```

## 📋 API Reference

### **Function Signature**

```tsx
function cva(
  base: string,
  config: {
    variants?: Record<string, Record<string, string>>;
    compoundVariants?: Array<{
      class: string;
      [key: string]: any;
    }>;
    defaultVariants?: Record<string, string>;
  }
): (props?: Record<string, any>) => string;
```

### **Parameters**

| Parameter                 | Type                                           | Description                              |
| ------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `base`                    | `string`                                       | Base CSS classes applied to all variants |
| `config.variants`         | `Record<string, Record<string, string>>`       | Variant definitions                      |
| `config.compoundVariants` | `Array<{ class: string; [key: string]: any }>` | Compound variant rules                   |
| `config.defaultVariants`  | `Record<string, string>`                       | Default variant values                   |

### **Return Value**

| Type                                      | Description                                |
| ----------------------------------------- | ------------------------------------------ |
| `(props?: Record<string, any>) => string` | Function that returns combined class names |

## 🎨 Usage Examples

### **Basic Variants**

```tsx
import { cva } from '@/shared/lib/cva';

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      danger: 'button--danger',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
  },
});

// Usage
const primaryButton = buttonVariants({ variant: 'primary', size: 'md' });
// Result: "button button--primary button--md"
```

### **With Default Variants**

```tsx
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Usage with defaults
const button = buttonVariants();
// Result: "button button--primary button--md"

// Override defaults
const largeButton = buttonVariants({ size: 'lg' });
// Result: "button button--primary button--lg"
```

### **Compound Variants**

```tsx
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
    state: {
      default: '',
      loading: 'button--loading',
      disabled: 'button--disabled',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'lg',
      class: 'button--primary-lg',
    },
    {
      variant: 'secondary',
      state: 'loading',
      class: 'button--secondary-loading',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    state: 'default',
  },
});

// Usage
const primaryLargeButton = buttonVariants({ variant: 'primary', size: 'lg' });
// Result: "button button--primary button--lg button--primary-lg"

const secondaryLoadingButton = buttonVariants({ variant: 'secondary', state: 'loading' });
// Result: "button button--secondary button--loading button--secondary-loading"
```

## 🎯 Real-World Examples

### **Button Component**

```tsx
import { cva } from '@/shared/lib/cva';
import { classNames } from '@/shared/lib/classNames';

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      danger: 'button--danger',
      ghost: 'button--ghost',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
    fullWidth: {
      true: 'button--full-width',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'lg',
      class: 'button--primary-lg',
    },
    {
      variant: 'danger',
      fullWidth: true,
      class: 'button--danger-full',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

function Button({ variant, size, fullWidth, className, ...props }) {
  return <button className={buttonVariants({ variant, size, fullWidth, className })} {...props} />;
}
```

### **Card Component**

```tsx
import { cva } from '@/shared/lib/cva';

const cardVariants = cva('card', {
  variants: {
    variant: {
      default: 'card--default',
      elevated: 'card--elevated',
      outlined: 'card--outlined',
    },
    padding: {
      none: 'card--padding-none',
      sm: 'card--padding-sm',
      md: 'card--padding-md',
      lg: 'card--padding-lg',
    },
    interactive: {
      true: 'card--interactive',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'elevated',
      interactive: true,
      class: 'card--elevated-interactive',
    },
    {
      variant: 'outlined',
      padding: 'lg',
      class: 'card--outlined-lg',
    },
  ],
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    interactive: false,
  },
});

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

function Card({ variant, padding, interactive, className, ...props }) {
  return <div className={cardVariants({ variant, padding, interactive, className })} {...props} />;
}
```

### **Input Component**

```tsx
import { cva } from '@/shared/lib/cva';

const inputVariants = cva('input', {
  variants: {
    variant: {
      default: 'input--default',
      filled: 'input--filled',
      outlined: 'input--outlined',
    },
    size: {
      sm: 'input--sm',
      md: 'input--md',
      lg: 'input--lg',
    },
    state: {
      default: '',
      error: 'input--error',
      success: 'input--success',
      disabled: 'input--disabled',
    },
  },
  compoundVariants: [
    {
      variant: 'outlined',
      state: 'error',
      class: 'input--outlined-error',
    },
    {
      variant: 'filled',
      state: 'success',
      class: 'input--filled-success',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
    state: 'default',
  },
});

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success' | 'disabled';
}

function Input({ variant, size, state, className, ...props }) {
  return <input className={inputVariants({ variant, size, state, className })} {...props} />;
}
```

## 🎨 Advanced Patterns

### **Theme-based Variants**

```tsx
const themeVariants = cva('component', {
  variants: {
    theme: {
      light: 'component--light',
      dark: 'component--dark',
    },
    color: {
      primary: 'component--primary',
      secondary: 'component--secondary',
    },
  },
  compoundVariants: [
    {
      theme: 'dark',
      color: 'primary',
      class: 'component--dark-primary',
    },
  ],
});
```

### **Responsive Variants**

```tsx
const responsiveVariants = cva('grid', {
  variants: {
    columns: {
      1: 'grid--cols-1',
      2: 'grid--cols-2',
      3: 'grid--cols-3',
      4: 'grid--cols-4',
    },
    gap: {
      sm: 'grid--gap-sm',
      md: 'grid--gap-md',
      lg: 'grid--gap-lg',
    },
  },
  compoundVariants: [
    {
      columns: 4,
      gap: 'lg',
      class: 'grid--cols-4-gap-lg',
    },
  ],
});
```

### **State-based Variants**

```tsx
const modalVariants = cva('modal', {
  variants: {
    open: {
      true: 'modal--open',
      false: 'modal--closed',
    },
    size: {
      sm: 'modal--sm',
      md: 'modal--md',
      lg: 'modal--lg',
      xl: 'modal--xl',
    },
    position: {
      center: 'modal--center',
      top: 'modal--top',
      bottom: 'modal--bottom',
    },
  },
  compoundVariants: [
    {
      open: true,
      size: 'xl',
      class: 'modal--open-xl',
    },
  ],
});
```

## 🧪 Testing

### **Unit Tests**

```tsx
import { cva } from '@/shared/lib/cva';

describe('cva', () => {
  const buttonVariants = cva('button', {
    variants: {
      variant: {
        primary: 'button--primary',
        secondary: 'button--secondary',
      },
      size: {
        sm: 'button--sm',
        md: 'button--md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  });

  test('applies base class', () => {
    expect(buttonVariants()).toBe('button button--primary button--md');
  });

  test('applies variant classes', () => {
    expect(buttonVariants({ variant: 'secondary' })).toBe('button button--secondary button--md');
  });

  test('applies size classes', () => {
    expect(buttonVariants({ size: 'sm' })).toBe('button button--primary button--sm');
  });

  test('overrides default variants', () => {
    expect(buttonVariants({ variant: 'secondary', size: 'sm' })).toBe(
      'button button--secondary button--sm'
    );
  });
});
```

### **Integration Tests**

```tsx
import { render } from '@testing-library/react';
import { cva } from '@/shared/lib/cva';

test('works with React components', () => {
  const buttonVariants = cva('button', {
    variants: {
      variant: {
        primary: 'button--primary',
      },
    },
  });

  const { container } = render(
    <button className={buttonVariants({ variant: 'primary' })}>Click me</button>
  );

  expect(container.firstChild).toHaveClass('button', 'button--primary');
});
```

## 🎨 Styling Integration

### **CSS Modules**

```tsx
import styles from './Button.module.scss';
import { cva } from '@/shared/lib/cva';

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
  },
});
```

### **Tailwind CSS**

```tsx
import { cva } from '@/shared/lib/cva';

const buttonVariants = cva('px-4 py-2 rounded font-medium transition-colors', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
});
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't use CVA for simple cases
const simpleClass = cva('button', {
  variants: {
    active: {
      true: 'button--active',
      false: '',
    },
  },
});
// Use classNames instead for simple boolean conditions

// Don't forget to handle undefined values
const className = buttonVariants({ variant: undefined });
// This will use default variant, which is correct

// Don't overcomplicate with too many variants
const overcomplicated = cva('button', {
  variants: {
    variant: {
      /* 20+ variants */
    },
    size: {
      /* 10+ sizes */
    },
    color: {
      /* 15+ colors */
    },
    // ... too many variants
  },
});
```

### **✅ Do**

```tsx
// Use CVA for complex variant systems
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Use for design system components
const cardVariants = cva('card', {
  variants: {
    variant: {
      default: 'card--default',
      elevated: 'card--elevated',
    },
    padding: {
      sm: 'card--padding-sm',
      md: 'card--padding-md',
    },
  },
});
```

## 🔄 Migration Guide

### **From Manual Class Concatenation**

```tsx
// Before
function getButtonClass(variant, size) {
  let className = 'button';
  if (variant === 'primary') className += ' button--primary';
  if (variant === 'secondary') className += ' button--secondary';
  if (size === 'sm') className += ' button--sm';
  if (size === 'md') className += ' button--md';
  return className;
}

// After
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
    },
  },
});
```

### **From Object-based Classes**

```tsx
// Before
function getButtonClass(variant, size) {
  return classNames('button', {
    'button--primary': variant === 'primary',
    'button--secondary': variant === 'secondary',
    'button--sm': size === 'sm',
    'button--md': size === 'md',
  });
}

// After
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
    },
  },
});
```

## 📚 Related Utilities

- [classNames Utility](../classNames/README.md) - CSS class concatenation
- [CSS Utilities](../../lib/css/README.md) - CSS helper utilities
- [Style Utilities](../../lib/styles/README.md) - Style-related utilities

---

**Last Updated**: December 2024  
**Version**: 1.0.0
