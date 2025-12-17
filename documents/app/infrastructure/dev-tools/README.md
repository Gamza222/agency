# Development Tools Infrastructure

Infrastructure layer for development tools including CLI scripts, configuration, and development workflow automation.

## 🎯 Overview

The development tools infrastructure provides the underlying services and configuration needed to support the development tools ecosystem.

### **Key Features**

- ✅ **CLI Scripts** - Command-line interface for development tools
- ✅ **Code Generation** - Automated file generation with templates
- ✅ **Architecture Validation** - FSD compliance checking
- ✅ **Development Configuration** - Environment-specific settings
- ✅ **Workflow Automation** - Streamlined development processes

## 🚀 Quick Start

### **Available CLI Commands**

```bash
# Generate a new component
npm run generate:component <name> [layer] [type] [description]

# Validate FSD architecture
npm run validate:fsd

# Examples
npm run generate:component Button
npm run generate:component UserCard widgets ui
npm run generate:component AuthService infrastructure lib
```

## 📋 CLI Scripts

### **Component Generator Script**

**File**: `scripts/generate-component.js`

**Usage**:

```bash
npm run generate:component <name> [layer] [type] [description]
```

**Parameters**:

- `name` (required): Component name
- `layer` (optional): FSD layer (shared, widgets, infrastructure)
- `type` (optional): Component type (ui, lib, model, api)
- `description` (optional): Component description

**Examples**:

```bash
# Generate a Button component in shared/ui
npm run generate:component Button

# Generate a UserCard widget
npm run generate:component UserCard widgets ui "User card widget"

# Generate an AuthService in infrastructure
npm run generate:component AuthService infrastructure lib "Authentication service"
```

**Generated Files**:

- `{name}.tsx` - Component implementation
- `{name}.test.tsx` - Unit tests
- `{name}.stories.tsx` - Storybook stories
- `index.ts` - Export file

### **FSD Validator Script**

**File**: `scripts/validate-fsd.js`

**Usage**:

```bash
npm run validate:fsd
```

**Features**:

- Validates all TypeScript files
- Checks import/export compliance
- Enforces FSD architecture rules
- Provides detailed error reporting

**Output**:

- ✅ Pass: No violations found
- ❌ Fail: Architecture violations detected
- ⚠️ Warnings: Non-critical issues

## 🎨 Code Generation

### **Component Templates**

The component generator uses templates to create consistent, FSD-compliant components:

#### **TypeScript Component Template**

```tsx
import React from 'react';
import { classNames } from '@/shared/lib/utils/classNames';

export interface {Name}Props {
  className?: string;
  children?: React.ReactNode;
  // Add your props here
}

/**
 * {description}
 *
 * @param props - Component props
 * @returns JSX element
 */
export function {Name}({ className, children, ...props }: {Name}Props) {
  return (
    <div
      className={classNames('{name}', {}, [className])}
      {...props}
    >
      {children}
    </div>
  );
}
```

#### **Test Template**

```tsx
import { render, screen } from '@testing-library/react';
import { {Name} } from './{Name}';

describe('{Name}', () => {
  it('renders without crashing', () => {
    render(<{Name}>Test content</{Name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<{Name} className="custom-class">Test</{Name}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class');
    expect(element).toHaveClass('{name}');
  });

  it('renders children correctly', () => {
    render(
      <{Name}>
        <span>Child 1</span>
        <span>Child 2</span>
      </{Name}>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
```

#### **Storybook Template**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { {Name} } from './{Name}';

const meta: Meta<typeof {Name}> = {
  title: '{Name}',
  component: {Name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '{description}',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS class',
    },
    children: {
      control: 'text',
      description: 'Content to render inside the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default {Name}',
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div>
        <h3>Custom Content</h3>
        <p>This is custom content inside {Name}</p>
      </div>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'custom-{name}-class',
    children: 'Styled {Name}',
  },
};
```

## 🔧 Architecture Validation

### **FSD Rules**

The FSD validator enforces the following architecture rules:

#### **Shared Layer Rules**

- ✅ `shared/ui` → `shared/lib` (UI can use utilities)
- ✅ `shared/ui` → `shared/model` (UI can use models)
- ✅ `shared/lib` → `shared/model` (Lib can use models)
- ❌ `shared/model` → `shared/ui` (Models should not depend on UI)
- ❌ `shared/model` → `shared/lib` (Models should not depend on lib)

#### **Widgets Layer Rules**

- ✅ `widgets` → `shared` (Widgets can use shared components)
- ✅ `widgets` → `infrastructure` (Widgets can use infrastructure)
- ❌ `widgets` → `widgets` (Widgets should not depend on other widgets)

#### **Infrastructure Layer Rules**

- ✅ `infrastructure` → `shared` (Infrastructure can use shared utilities)
- ❌ `infrastructure` → `widgets` (Infrastructure should not depend on widgets)
- ✅ `infrastructure` → `infrastructure` (Infrastructure can use other infrastructure)

#### **App Layer Rules**

- ✅ `app` → `shared` (App can use shared components)
- ✅ `app` → `widgets` (App can use widgets)
- ✅ `app` → `infrastructure` (App can use infrastructure)

### **Validation Process**

1. **File Discovery**: Scans all TypeScript files in `src/`
2. **Import Extraction**: Extracts all import statements
3. **Path Analysis**: Determines source and target layers
4. **Rule Application**: Applies FSD rules to each import
5. **Violation Reporting**: Reports errors and warnings

## 🧪 Testing

### **CLI Script Testing**

```bash
# Test component generation
npm run generate:component TestComponent shared ui "Test component"
npm test -- --testPathPattern=TestComponent
rm -rf src/shared/ui/TestComponent

# Test FSD validation
npm run validate:fsd
```

### **Integration Testing**

```tsx
import { componentGenerator } from '@/shared/lib/dev-tools/generators/component-generator';
import { fsdValidator } from '@/shared/lib/dev-tools/generators/fsd-validator';

test('component generator creates valid files', () => {
  const config = {
    name: 'TestComponent',
    layer: 'shared',
    type: 'ui',
    description: 'Test component',
  };

  expect(() => componentGenerator(config)).not.toThrow();
});

test('fsd validator returns validation result', () => {
  const result = fsdValidator();
  expect(result).toHaveProperty('isValid');
  expect(result).toHaveProperty('errors');
  expect(result).toHaveProperty('warnings');
});
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Development mode
NODE_ENV=development

# Enable debug tools
NEXT_PUBLIC_DEBUG_TOOLS=true
```

### **Package.json Scripts**

```json
{
  "scripts": {
    "generate:component": "node scripts/generate-component.js",
    "validate:fsd": "node scripts/validate-fsd.js"
  }
}
```

## 🚨 Common Issues

### **Component Generation Issues**

**Issue**: Import path errors
**Solution**: Ensure correct import paths in templates

**Issue**: Test failures
**Solution**: Check classNames function usage and test assertions

### **FSD Validation Issues**

**Issue**: False positive violations
**Solution**: Check file path patterns and layer detection

**Issue**: Missing rules
**Solution**: Add new rules to FSD_RULES array

## 📚 Related Documentation

- [Development Tools](../shared/lib/dev-tools/README.md) - Main dev tools documentation
- [FSD Architecture](../../architecture/fsd-architecture.md) - FSD principles
- [Component Patterns](../shared/ui/README.md) - Component development patterns

---

**Last Updated**: December 2024  
**Version**: 1.0.0
