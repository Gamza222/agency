# Button Component

A versatile, accessible button component with multiple variants, sizes, and states. Built with TypeScript support and comprehensive accessibility features.

## 🎯 Overview

The Button component is the foundation of interactive UI elements in our design system. It provides consistent styling, behavior, and accessibility across all applications.

### **Key Features**

- ✅ **Multiple Variants** - Primary, Secondary
- ✅ **Size Options** - Small, Medium, Large
- ✅ **State Management** - Loading, Disabled, Normal
- ✅ **Icon Support** - Left-aligned icons with proper spacing
- ✅ **Full Width** - Responsive width options
- ✅ **Accessibility** - ARIA labels, keyboard navigation, focus management
- ✅ **TypeScript** - Full type safety and IntelliSense

## 🚀 Quick Start

```tsx
import { Button } from '@/shared/ui/Button';
import { ButtonVariant, ButtonSize } from '@/shared/ui/Button/Button.types';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant={ButtonVariant.PRIMARY} size={ButtonSize.LG}>
  Primary Button
</Button>

// With icon
<Button icon={<span>🚀</span>}>
  Launch App
</Button>
```

## 📋 API Reference

### **Props**

| Prop        | Type                              | Default     | Description            |
| ----------- | --------------------------------- | ----------- | ---------------------- |
| `variant`   | `ButtonVariant`                   | `PRIMARY`   | Visual style variant   |
| `size`      | `ButtonSize`                      | `MD`        | Button size            |
| `fullWidth` | `boolean`                         | `false`     | Make button full width |
| `loading`   | `boolean`                         | `false`     | Show loading state     |
| `disabled`  | `boolean`                         | `false`     | Disable the button     |
| `icon`      | `ReactNode`                       | `undefined` | Icon to display        |
| `type`      | `'button' \| 'submit' \| 'reset'` | `'button'`  | HTML button type       |
| `className` | `string`                          | `undefined` | Additional CSS classes |

### **Variants**

#### Primary Button

```tsx
<Button variant={ButtonVariant.PRIMARY}>Primary Action</Button>
```

- **Use for**: Main actions, CTAs, primary user flows
- **Color**: Blue background with white text
- **Accessibility**: High contrast, clear focus states

#### Secondary Button

```tsx
<Button variant={ButtonVariant.SECONDARY}>Secondary Action</Button>
```

- **Use for**: Secondary actions, alternative options
- **Color**: White background with gray text and border
- **Accessibility**: Clear visual hierarchy

### **Sizes**

#### Small (SM)

```tsx
<Button size={ButtonSize.SM}>Small Button</Button>
```

- **Height**: 36px
- **Padding**: 12px horizontal, 8px vertical
- **Use for**: Compact spaces, inline actions

#### Medium (MD) - Default

```tsx
<Button size={ButtonSize.MD}>Medium Button</Button>
```

- **Height**: 40px
- **Padding**: 16px horizontal, 8px vertical
- **Use for**: Standard buttons, most use cases

#### Large (LG)

```tsx
<Button size={ButtonSize.LG}>Large Button</Button>
```

- **Height**: 44px
- **Padding**: 32px horizontal, 12px vertical
- **Use for**: Prominent actions, mobile-friendly

## 🎨 Usage Examples

### **Basic Examples**

```tsx
// Primary action
<Button variant={ButtonVariant.PRIMARY}>
  Save Changes
</Button>

// Secondary action
<Button variant={ButtonVariant.SECONDARY}>
  Cancel
</Button>

// Loading state
<Button loading>
  Processing...
</Button>

// Disabled state
<Button disabled>
  Not Available
</Button>
```

### **With Icons**

```tsx
// Icon with text
<Button icon={<span>💾</span>}>
  Save
</Button>

// Icon with loading
<Button icon={<span>🚀</span>} loading>
  Launching...
</Button>

// Icon only (accessibility: add aria-label)
<Button icon={<span>❌</span>} aria-label="Close">
</Button>
```

### **Responsive Design**

```tsx
// Full width on mobile
<Button fullWidth className="sm:w-auto">
  Mobile Full Width
</Button>

// Responsive sizing
<Button size={ButtonSize.SM} className="sm:size-md lg:size-lg">
  Responsive Button
</Button>
```

### **Form Integration**

```tsx
// Submit button
<Button type="submit" variant={ButtonVariant.PRIMARY}>
  Submit Form
</Button>

// Reset button
<Button type="reset" variant={ButtonVariant.SECONDARY}>
  Reset
</Button>
```

## 🎯 Design Patterns

### **Button Groups**

```tsx
// Horizontal group
<div className="flex gap-2">
  <Button variant={ButtonVariant.PRIMARY}>Save</Button>
  <Button variant={ButtonVariant.SECONDARY}>Cancel</Button>
</div>

// Vertical group
<div className="flex flex-col gap-2">
  <Button>Option 1</Button>
  <Button>Option 2</Button>
  <Button>Option 3</Button>
</div>
```

### **Action Sequences**

```tsx
// Multi-step actions
<div className="flex justify-between">
  <Button variant={ButtonVariant.SECONDARY}>← Back</Button>
  <Button variant={ButtonVariant.PRIMARY}>Next →</Button>
</div>
```

### **Status Indicators**

```tsx
// Success action
<Button variant={ButtonVariant.PRIMARY} icon={<span>✅</span>}>
  Success
</Button>

// Warning action
<Button variant={ButtonVariant.SECONDARY} icon={<span>⚠️</span>}>
  Warning
</Button>

// Error action
<Button variant={ButtonVariant.SECONDARY} icon={<span>❌</span>}>
  Error
</Button>
```

## ♿ Accessibility

### **Keyboard Navigation**

- **Tab**: Focus the button
- **Enter/Space**: Activate the button
- **Escape**: Cancel if applicable

### **Screen Readers**

```tsx
// Descriptive labels
<Button aria-label="Save the current document">
  <span>💾</span>
</Button>

// Loading state announcement
<Button loading aria-describedby="loading-text">
  Processing
</Button>
<div id="loading-text" className="sr-only">
  Please wait while we process your request
</div>
```

### **Focus Management**

- Clear focus indicators
- High contrast focus states
- Proper focus order in forms

## 🧪 Testing

### **Unit Tests**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/shared/ui/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

test('handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### **Accessibility Tests**

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

test('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 🎨 Styling

### **CSS Custom Properties**

```css
.button {
  --button-padding-x: 1rem;
  --button-padding-y: 0.5rem;
  --button-border-radius: 0.375rem;
  --button-font-weight: 500;
}
```

### **SCSS Modules**

```scss
// Custom button styles
.custom-button {
  @extend .button;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
}
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't use div for buttons
<div onClick={handleClick}>Click me</div>

// Don't forget accessibility
<Button><span>💾</span></Button> // Missing aria-label

// Don't use buttons for navigation
<Button onClick={() => router.push('/home')}>Home</Button> // Use Link instead
```

### **✅ Do**

```tsx
// Use proper button element
<Button onClick={handleClick}>Click me</Button>

// Include accessibility
<Button aria-label="Save document"><span>💾</span></Button>

// Use appropriate elements
<Link href="/home">Home</Link>
```

## 🔄 Migration Guide

### **From HTML Buttons**

```tsx
// Before
<button className="btn btn-primary">Click me</button>

// After
<Button variant={ButtonVariant.PRIMARY}>Click me</Button>
```

### **From Other Button Components**

```tsx
// Before
<CustomButton type="primary" size="large">Click me</CustomButton>

// After
<Button variant={ButtonVariant.PRIMARY} size={ButtonSize.LG}>Click me</Button>
```

## 📚 Related Components

- [Text Component](../Text/README.md) - For button text styling
- [Icon Components](../../lib/icons/README.md) - For button icons
- [Form Components](../../lib/forms/README.md) - For form integration

---

**Last Updated**: December 2024  
**Version**: 1.0.0
