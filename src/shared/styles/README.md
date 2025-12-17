# 🎨 Styling System - Tailwind + SCSS Modules

Our styling system combines **Tailwind CSS utilities** with **SCSS modules** to get the best of both worlds.

## 🎯 **When to Use What**

### **✅ Use Tailwind For:**

- **Common utilities**: `flex`, `items-center`, `p-4`, `text-lg`
- **Layout**: `grid`, `grid-cols-2`, `gap-4`, `container`
- **Spacing**: `m-4`, `p-2`, `space-x-2`
- **Basic colors**: `bg-blue-500`, `text-gray-700`
- **Responsive design**: `sm:hidden`, `lg:flex`

### **✅ Use SCSS Modules For:**

- **Complex animations**: Custom keyframes, multi-step animations
- **Component-specific styling**: Hover effects, focus states
- **Design system tokens**: Using our design tokens consistently
- **Interactive states**: Ripple effects, complex transitions
- **Dark mode**: Component-specific dark mode styling

## 🏗️ **Architecture**

```
src/shared/styles/
├── design-tokens.scss    # Core design system variables
├── mixins.scss          # Reusable SCSS mixins
└── README.md           # This documentation

src/shared/ui/ComponentName/
├── ComponentName.tsx         # React component
├── ComponentName.module.scss # Component-specific SCSS
└── ComponentName.test.tsx    # Tests
```

## 📋 **Usage Examples**

### **Component Implementation**

```tsx
// Button.tsx
import React from 'react';
import { classNames } from '@/shared/lib/hooks/classNames/classNames';
import styles from './Button.module.scss';

export const Button = ({ variant, size, loading, children, ...props }) => {
  // Combine SCSS module classes
  const scssClasses = [
    styles.button,
    loading && styles.loading,
    variant === 'primary' && styles.primary,
  ]
    .filter(Boolean)
    .join(' ');

  // Combine with Tailwind utilities
  const classes = classNames(
    // Tailwind base utilities
    'inline-flex items-center justify-center border rounded-md font-medium',
    {
      // Tailwind conditional utilities
      'w-full': fullWidth,
      'opacity-50': disabled,
    },
    [
      // SCSS module classes
      scssClasses,
      // Tailwind variant classes
      'bg-blue-600 text-white', // or from variants object
      className,
    ]
  );

  return <button className={classes}>{children}</button>;
};
```

### **SCSS Module Example**

```scss
// Button.module.scss
@import '../../styles/mixins';

.button {
  @include button-base;

  // Custom focus state (complex, hard with Tailwind)
  &:focus-visible {
    box-shadow:
      0 0 0 2px color('primary', 500),
      0 0 0 4px rgba(color('primary', 500), 0.2);
  }

  // Custom loading animation
  &.loading {
    position: relative;

    &::before {
      @include spinner('sm');
      content: '';
      position: absolute;
      left: spacing('sm');
    }
  }

  // Enhanced hover with transform
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    transition: transform transition('fast');
  }
}

.primary {
  // Complex gradient hover (easier in SCSS)
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, color('primary', 600), color('primary', 700));
  }
}
```

## 🎨 **Design Tokens Usage**

```scss
// Using design tokens in SCSS modules
@import '../../styles/design-tokens';

.myComponent {
  background-color: color('primary', 500);
  padding: spacing('lg');
  border-radius: radius('md');
  font-size: font-size('lg');
  box-shadow: shadow('base');
  transition: all transition('normal');

  @include responsive('md') {
    padding: spacing('xl');
  }
}
```

## 🔧 **Available Design Tokens**

### **Colors**

```scss
color('primary', 500)     // #3b82f6
color('gray', 700)        // #374151
color('success', 500)     // #22c55e
color('error', 500)       // #ef4444
color('warning', 500)     // #f59e0b
```

### **Spacing**

```scss
spacing('xs')    // 0.25rem (4px)
spacing('sm')    // 0.5rem (8px)
spacing('md')    // 0.75rem (12px)
spacing('lg')    // 1rem (16px)
spacing('xl')    // 1.5rem (24px)
```

### **Typography**

```scss
font-size('sm')       // 0.875rem (14px)
font-size('base')     // 1rem (16px)
font-size('lg')       // 1.125rem (18px)
font-weight('medium') // 500
font-weight('bold')   // 700
```

## 🎛️ **Available Mixins**

### **Button Mixins**

```scss
@include button-base; // Base button styling
@include button-variant($bg, $text); // Color variant
@include button-size($py, $px, $font); // Size variant
```

### **Layout Mixins**

```scss
@include flex-center; // Flex center alignment
@include absolute-center; // Absolute center positioning
@include container($max-width); // Container with max width
```

### **Interactive Mixins**

```scss
@include hover-lift; // Hover lift effect
@include focus-ring($color); // Custom focus ring
@include card-base; // Base card styling
```

### **Loading Mixins**

```scss
@include spinner('md'); // Loading spinner
@include loading-skeleton; // Skeleton loading effect
```

## 📱 **Responsive Design**

```scss
// Using responsive mixin
.component {
  padding: spacing('sm');

  @include responsive('md') {
    padding: spacing('lg');
  }

  @include responsive('lg') {
    padding: spacing('xl');
  }
}
```

## 🌙 **Dark Mode Support**

```scss
.component {
  background: color('gray', 50);
  color: color('gray', 900);

  @media (prefers-color-scheme: dark) {
    background: color('gray', 800);
    color: color('gray', 100);
  }
}
```

## ✅ **Best Practices**

### **1. Start with Tailwind**

```tsx
// ✅ GOOD - Use Tailwind first
<div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
```

### **2. Add SCSS for Complex Styling**

```scss
// ✅ GOOD - SCSS for complex effects
.card {
  @include card-base;
  @include hover-lift;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    transition: all transition('normal');
  }
}
```

### **3. Use Design Tokens**

```scss
// ✅ GOOD - Use design tokens
.button {
  background: color('primary', 500);
  padding: spacing('md') spacing('lg');
}

// ❌ BAD - Hard-coded values
.button {
  background: #3b82f6;
  padding: 12px 16px;
}
```

### **4. Combine Both Systems**

```tsx
// ✅ GOOD - Tailwind + SCSS modules
const classes = classNames(
  'flex items-center', // Tailwind for layout
  styles.button, // SCSS for complex styling
  'bg-blue-500' // Tailwind for color
);
```

## 🚀 **Next.js Configuration**

Ensure your `next.config.js` supports SCSS modules:

```js
// next.config.js
const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/shared/styles')],
  },
  // ... other config
};
```

This styling system gives you the productivity of Tailwind with the power of SCSS for complex component styling! 🎨
