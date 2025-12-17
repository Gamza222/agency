# 🧩 Component Development Guide

This guide covers how to create, test, and document components in our enterprise FSD foundation.

## 🎯 Component Development Principles

### 1. FSD Architecture Compliance

All components must follow Feature-Sliced Design principles:

- **Shared Layer** - Reusable UI components and utilities
- **Entities Layer** - Business entities and models
- **Features Layer** - User-facing features
- **Widgets Layer** - Composite UI blocks
- **Pages Layer** - Application pages

### 2. Component Design Patterns

- **Composition over Inheritance** - Build complex components from simple ones
- **Props Interface** - Clear, well-typed props
- **Variant System** - Use CVA for consistent styling
- **Accessibility First** - Built-in a11y support
- **Performance Optimized** - Memoization and lazy loading

## 🚀 Creating New Components

### Using Component Generator

```bash
# Generate a new component
npm run generate:component

# Follow the interactive prompts:
# Component name: MyButton
# Layer: shared/ui
# Variants: primary, secondary, danger
# Sizes: sm, md, lg
# Include tests: yes
# Include stories: yes
```

### Manual Component Creation

#### 1. Create Component Structure

```
src/shared/ui/MyButton/
├── MyButton.tsx           # Main component
├── MyButton.types.ts      # TypeScript types
├── MyButton.variants.ts   # CVA variants
├── MyButton.module.scss   # Styles
├── MyButton.test.tsx      # Tests
├── MyButton.stories.tsx   # Storybook stories
└── index.ts              # Exports
```

#### 2. Component Implementation

```typescript
// MyButton.tsx
'use client';

import React from 'react';
import { classNames } from '@/shared/lib/utils/classNames/classNames';
import { buttonVariants } from './MyButton.variants';
import { MyButtonProps } from './MyButton.types';
import styles from './MyButton.module.scss';

export const MyButton: React.FC<MyButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled = false,
  loading = false,
  ...props
}) => {
  const classes = classNames(
    styles.button,
    {},
    [
      ...buttonVariants({ variant, size }),
      className,
    ]
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

#### 3. TypeScript Types

```typescript
// MyButton.types.ts
import { ButtonHTMLAttributes, ReactNode } from 'react';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger',
}

export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  loading?: boolean;
  className?: string;
}
```

#### 4. CVA Variants

```typescript
// MyButton.variants.ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

#### 5. SCSS Styles

```scss
// MyButton.module.scss
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid theme('colors.primary.500');
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-loading='true'] {
    cursor: not-allowed;
  }
}
```

## 🧪 Testing Components

### Test Structure

```typescript
// MyButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyButton } from './MyButton';
import { ButtonVariant, ButtonSize } from './MyButton.types';

describe('MyButton', () => {
  it('renders with default props', () => {
    render(<MyButton>Click me</MyButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders with custom variant and size', () => {
    render(
      <MyButton variant={ButtonVariant.SECONDARY} size={ButtonSize.LG}>
        Large Secondary
      </MyButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary', 'h-11');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyButton onClick={handleClick}>Click me</MyButton>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<MyButton loading>Loading</MyButton>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is accessible', () => {
    render(<MyButton aria-label="Submit form">Submit</MyButton>);

    const button = screen.getByRole('button', { name: /submit form/i });
    expect(button).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Test Behavior, Not Implementation** - Focus on what the component does, not how
2. **Use Semantic Queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test Accessibility** - Ensure components are accessible
4. **Test Edge Cases** - Handle error states, loading states, etc.
5. **Mock External Dependencies** - Use mocks for API calls, context, etc.

## 📚 Storybook Stories

### Story Structure

```typescript
// MyButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyButton } from './MyButton';
import { ButtonVariant, ButtonSize } from './MyButton.types';

const meta: Meta<typeof MyButton> = {
  title: 'Shared/UI/MyButton',
  component: MyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable button component with multiple variants and sizes.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ButtonVariant),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(ButtonSize),
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: ButtonVariant.PRIMARY,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: ButtonVariant.SECONDARY,
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: ButtonVariant.DANGER,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <MyButton size={ButtonSize.SM}>Small</MyButton>
      <MyButton size={ButtonSize.MD}>Medium</MyButton>
      <MyButton size={ButtonSize.LG}>Large</MyButton>
    </div>
  ),
};
```

### Story Best Practices

1. **Clear Naming** - Use descriptive story names
2. **Comprehensive Coverage** - Cover all variants and states
3. **Interactive Controls** - Use argTypes for interactive testing
4. **Documentation** - Include component descriptions
5. **Visual Testing** - Use for visual regression testing

## 📖 Component Documentation

### Documentation Structure

````markdown
# MyButton Component

A customizable button component with multiple variants and sizes.

## Usage

```tsx
import { MyButton } from '@/shared/ui/MyButton/MyButton';

<MyButton variant="primary" size="md">
  Click me
</MyButton>;
```
````

## Props

| Prop     | Type          | Default   | Description          |
| -------- | ------------- | --------- | -------------------- |
| variant  | ButtonVariant | 'primary' | Button style variant |
| size     | ButtonSize    | 'md'      | Button size          |
| children | ReactNode     | -         | Button content       |
| loading  | boolean       | false     | Show loading state   |
| disabled | boolean       | false     | Disable button       |

## Examples

### Basic Usage

```tsx
<MyButton>Default Button</MyButton>
```

### With Variants

```tsx
<MyButton variant="secondary">Secondary</MyButton>
<MyButton variant="danger">Danger</MyButton>
```

### With Sizes

```tsx
<MyButton size="sm">Small</MyButton>
<MyButton size="lg">Large</MyButton>
```

````

## 🔧 Advanced Patterns

### Compound Components

```typescript
// Card.tsx
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
};

// Usage
<Card.Root>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
````

### Render Props Pattern

```typescript
interface DataProviderProps {
  children: (data: Data) => React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const data = useData();
  return <>{children(data)}</>;
};
```

### Higher-Order Components

```typescript
export function withLoading<T extends object>(
  Component: React.ComponentType<T>
) {
  return function WithLoadingComponent(props: T & { loading?: boolean }) {
    if (props.loading) {
      return <LoadingSpinner />;
    }
    return <Component {...props} />;
  };
}
```

## 🚀 Performance Optimization

### Memoization

```typescript
export const MyButton = React.memo<MyButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, ...props }) => {
    // Component implementation
  }
);
```

### Lazy Loading

```typescript
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

export const MyPage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
);
```

### Bundle Optimization

```typescript
// Use dynamic imports for heavy dependencies
const heavyLibrary = await import('heavy-library');

// Tree-shake unused code
import { specificFunction } from 'large-library';
```

## 🎨 Styling Guidelines

### CSS Modules

```scss
// Use CSS modules for component-specific styles
.button {
  // Component styles
}

.variant {
  &--primary {
    // Variant styles
  }
}
```

### CVA Integration

```typescript
// Use CVA for consistent variant management
const buttonVariants = cva('base-styles', {
  variants: {
    variant: {
      primary: 'primary-styles',
      secondary: 'secondary-styles',
    },
  },
});
```

### Responsive Design

```scss
.button {
  // Mobile first
  padding: 0.5rem 1rem;

  // Tablet
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
  }

  // Desktop
  @media (min-width: 1024px) {
    padding: 1rem 2rem;
  }
}
```

## 🔍 Code Review Checklist

### Before Submitting

- [ ] Component follows FSD architecture
- [ ] TypeScript types are complete
- [ ] Tests cover all functionality
- [ ] Stories demonstrate all variants
- [ ] Documentation is up to date
- [ ] Accessibility requirements met
- [ ] Performance considerations addressed
- [ ] No console errors or warnings

### Reviewing Components

- [ ] Code quality and readability
- [ ] Architecture compliance
- [ ] Test coverage adequacy
- [ ] Documentation completeness
- [ ] Accessibility compliance
- [ ] Performance implications
- [ ] Reusability and maintainability

---

**Last Updated:** December 2024  
**Version:** 2.0.0  
**Status:** ✅ Complete
