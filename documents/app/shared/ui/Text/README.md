# Text Component

A flexible, semantic text component with multiple variants, sizes, and alignment options. Built with TypeScript support and proper accessibility features.

## 🎯 Overview

The Text component provides consistent typography and semantic meaning across all text content. It supports multiple HTML elements, variants, and responsive sizing.

### **Key Features**

- ✅ **Semantic Elements** - h1, h2, h3, p, span, div
- ✅ **Multiple Variants** - Primary, Secondary, Error
- ✅ **Size Options** - xs, sm, md, lg, xl
- ✅ **Alignment** - Left, Center, Right, Justify
- ✅ **Accessibility** - Proper heading hierarchy, screen reader support
- ✅ **TypeScript** - Full type safety and IntelliSense

## 🚀 Quick Start

```tsx
import { Text } from '@/shared/ui/Text';
import { TextVariant } from '@/shared/ui/Text/Text.types';

// Basic usage
<Text>Hello World</Text>

// With variant and size
<Text variant={TextVariant.PRIMARY} size="lg">
  Heading Text
</Text>

// As heading element
<Text as="h1" variant={TextVariant.PRIMARY} size="xl">
  Main Title
</Text>
```

## 📋 API Reference

### **Props**

| Prop        | Type                                             | Default     | Description            |
| ----------- | ------------------------------------------------ | ----------- | ---------------------- |
| `as`        | `'h1' \| 'h2' \| 'h3' \| 'p' \| 'span' \| 'div'` | `'p'`       | HTML element to render |
| `variant`   | `TextVariant`                                    | `PRIMARY`   | Text color variant     |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`           | `'md'`      | Text size              |
| `align`     | `'left' \| 'center' \| 'right' \| 'justify'`     | `'left'`    | Text alignment         |
| `className` | `string`                                         | `undefined` | Additional CSS classes |

### **Variants**

#### Primary Text

```tsx
<Text variant={TextVariant.PRIMARY}>Primary content</Text>
```

- **Use for**: Main content, headings, important text
- **Color**: Dark gray (#111827)
- **Accessibility**: High contrast, clear hierarchy

#### Secondary Text

```tsx
<Text variant={TextVariant.SECONDARY}>Secondary content</Text>
```

- **Use for**: Supporting text, descriptions, metadata
- **Color**: Medium gray (#6b7280)
- **Accessibility**: Clear visual hierarchy

#### Error Text

```tsx
<Text variant={TextVariant.ERROR}>Error message</Text>
```

- **Use for**: Error messages, validation feedback
- **Color**: Red (#dc2626)
- **Accessibility**: High contrast, clear error indication

### **Sizes**

#### Extra Small (xs)

```tsx
<Text size="xs">Extra small text</Text>
```

- **Font Size**: 12px
- **Line Height**: 16px
- **Use for**: Captions, labels, fine print

#### Small (sm)

```tsx
<Text size="sm">Small text</Text>
```

- **Font Size**: 14px
- **Line Height**: 20px
- **Use for**: Secondary information, metadata

#### Medium (md) - Default

```tsx
<Text size="md">Medium text</Text>
```

- **Font Size**: 16px
- **Line Height**: 24px
- **Use for**: Body text, standard content

#### Large (lg)

```tsx
<Text size="lg">Large text</Text>
```

- **Font Size**: 18px
- **Line Height**: 28px
- **Use for**: Subheadings, emphasized content

#### Extra Large (xl)

```tsx
<Text size="xl">Extra large text</Text>
```

- **Font Size**: 20px
- **Line Height**: 28px
- **Use for**: Main headings, prominent text

## 🎨 Usage Examples

### **Semantic Elements**

```tsx
// Main heading
<Text as="h1" variant={TextVariant.PRIMARY} size="xl">
  Page Title
</Text>

// Section heading
<Text as="h2" variant={TextVariant.PRIMARY} size="lg">
  Section Title
</Text>

// Subsection heading
<Text as="h3" variant={TextVariant.PRIMARY} size="md">
  Subsection Title
</Text>

// Paragraph text
<Text as="p" variant={TextVariant.PRIMARY}>
  This is a paragraph of text that explains something important.
</Text>

// Inline text
<Text as="span" variant={TextVariant.SECONDARY}>
  Inline text content
</Text>
```

### **Alignment Examples**

```tsx
// Left aligned (default)
<Text align="left">
  Left aligned text
</Text>

// Center aligned
<Text align="center">
  Centered text
</Text>

// Right aligned
<Text align="right">
  Right aligned text
</Text>

// Justified text
<Text align="justify">
  This is justified text that spreads evenly across the container width,
  creating clean margins on both sides. Perfect for articles and long-form content.
</Text>
```

### **Size Hierarchy**

```tsx
// Article structure
<Text as="h1" size="xl" variant={TextVariant.PRIMARY}>
  Article Title
</Text>

<Text as="h2" size="lg" variant={TextVariant.PRIMARY}>
  Introduction
</Text>

<Text as="p" size="md" variant={TextVariant.PRIMARY}>
  This is the main content of the article...
</Text>

<Text as="p" size="sm" variant={TextVariant.SECONDARY}>
  Published on December 2024
</Text>
```

### **Error States**

```tsx
// Form validation
<Text variant={TextVariant.ERROR} size="sm">
  This field is required
</Text>

// Error messages
<Text variant={TextVariant.ERROR} size="md">
  Something went wrong. Please try again.
</Text>

// Success messages
<Text variant={TextVariant.PRIMARY} size="md">
  ✅ Successfully saved!
</Text>
```

## 🎯 Design Patterns

### **Content Hierarchy**

```tsx
// Card content
<div className="card">
  <Text as="h3" size="lg" variant={TextVariant.PRIMARY}>
    Card Title
  </Text>
  <Text as="p" size="md" variant={TextVariant.SECONDARY}>
    Card description with supporting information.
  </Text>
  <Text as="span" size="sm" variant={TextVariant.SECONDARY}>
    Last updated 2 hours ago
  </Text>
</div>
```

### **Form Labels**

```tsx
// Form field
<div className="form-field">
  <Text as="label" size="sm" variant={TextVariant.PRIMARY}>
    Email Address
  </Text>
  <input type="email" />
  <Text as="span" size="xs" variant={TextVariant.SECONDARY}>
    We'll never share your email
  </Text>
</div>
```

### **Status Messages**

```tsx
// Loading state
<Text variant={TextVariant.SECONDARY} size="sm">
  Loading...
</Text>

// Success state
<Text variant={TextVariant.PRIMARY} size="md">
  ✅ Operation completed successfully
</Text>

// Error state
<Text variant={TextVariant.ERROR} size="md">
  ❌ Operation failed. Please try again.
</Text>
```

### **Responsive Typography**

```tsx
// Responsive sizing
<Text
  as="h1"
  size="lg"
  className="sm:text-xl lg:text-2xl"
>
  Responsive Heading
</Text>

// Mobile-first approach
<Text
  as="p"
  size="sm"
  className="sm:text-base lg:text-lg"
>
  Responsive paragraph text
</Text>
```

## ♿ Accessibility

### **Heading Hierarchy**

```tsx
// Proper heading structure
<Text as="h1" size="xl">Main Title</Text>
<Text as="h2" size="lg">Section Title</Text>
<Text as="h3" size="md">Subsection Title</Text>
<Text as="p" size="md">Content paragraph</Text>
```

### **Screen Reader Support**

```tsx
// Descriptive text
<Text as="p" aria-describedby="help-text">
  Enter your password
</Text>
<Text as="span" id="help-text" size="xs" variant={TextVariant.SECONDARY}>
  Must be at least 8 characters long
</Text>

// Error announcements
<Text
  as="span"
  variant={TextVariant.ERROR}
  role="alert"
  aria-live="polite"
>
  Password is too short
</Text>
```

### **Color Contrast**

- All variants meet WCAG AA contrast requirements
- Error text uses high-contrast red
- Secondary text maintains readability

## 🧪 Testing

### **Unit Tests**

```tsx
import { render, screen } from '@testing-library/react';
import { Text } from '@/shared/ui/Text';

test('renders text with correct content', () => {
  render(<Text>Hello World</Text>);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('renders as correct HTML element', () => {
  render(<Text as="h1">Heading</Text>);
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
});
```

### **Accessibility Tests**

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

test('has no accessibility violations', async () => {
  const { container } = render(<Text as="h1">Heading</Text>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 🎨 Styling

### **CSS Custom Properties**

```css
.text {
  --text-color: var(--color-primary);
  --text-size: 1rem;
  --text-line-height: 1.5;
  --text-font-weight: 400;
}
```

### **SCSS Modules**

```scss
// Custom text styles
.custom-text {
  @extend .text;
  font-family: 'Custom Font', sans-serif;
  letter-spacing: 0.025em;
}
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't skip heading hierarchy
<Text as="h3">Main Title</Text> // Should be h1
<Text as="h1">Subtitle</Text>   // Should be h2

// Don't use text for interactive elements
<Text as="span" onClick={handleClick}>Click me</Text> // Use Button

// Don't forget semantic meaning
<Text as="div">This is a heading</Text> // Use h1, h2, etc.
```

### **✅ Do**

```tsx
// Use proper heading hierarchy
<Text as="h1">Main Title</Text>
<Text as="h2">Subtitle</Text>

// Use appropriate elements
<Button onClick={handleClick}>Click me</Button>

// Use semantic elements
<Text as="h2">This is a heading</Text>
```

## 🔄 Migration Guide

### **From HTML Elements**

```tsx
// Before
<h1 className="text-xl font-bold">Title</h1>
<p className="text-base text-gray-600">Content</p>

// After
<Text as="h1" size="xl" variant={TextVariant.PRIMARY}>Title</Text>
<Text as="p" size="md" variant={TextVariant.SECONDARY}>Content</Text>
```

### **From Other Text Components**

```tsx
// Before
<CustomText type="heading" level={1}>Title</CustomText>

// After
<Text as="h1" size="xl" variant={TextVariant.PRIMARY}>Title</Text>
```

## 📚 Related Components

- [Button Component](../Button/README.md) - For interactive text elements
- [Heading Components](../../lib/headings/README.md) - For specialized headings
- [Form Components](../../lib/forms/README.md) - For form text elements

---

**Last Updated**: December 2024  
**Version**: 1.0.0
