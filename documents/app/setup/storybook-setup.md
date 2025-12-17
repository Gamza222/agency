# 📚 Storybook Setup Guide

This guide covers how to set up, configure, and use Storybook for component development and documentation.

## 🎯 What is Storybook?

Storybook is a tool for building UI components and pages in isolation. It helps with:

- **Component Development** - Build components in isolation
- **Documentation** - Create living documentation
- **Testing** - Visual testing and interaction testing
- **Design System** - Maintain consistent design patterns
- **Collaboration** - Share components with designers and stakeholders

## 🚀 Installation and Setup

### 1. Install Storybook

```bash
# Install Storybook for Next.js
npx storybook@latest init

# Or install specific version
npm install --save-dev @storybook/react @storybook/nextjs @storybook/addon-essentials
```

### 2. Configuration Files

#### Main Configuration

```javascript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (config) => {
    // Handle SCSS modules
    config.module?.rules?.push({
      test: /\.module\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
            importLoaders: 2,
          },
        },
        'sass-loader',
      ],
    });

    // Handle regular SCSS files
    config.module?.rules?.push({
      test: /\.scss$/,
      exclude: /\.module\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    return config;
  },
};

export default config;
```

#### Preview Configuration

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/shared/styles/globals.scss';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
```

#### TypeScript Configuration

```json
// .storybook/tsconfig.json
{
  "extends": "../tsconfig.json",
  "include": ["../src/**/*", "../.storybook/**/*"],
  "exclude": ["../src/**/*.test.*", "../src/**/*.spec.*"],
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false
  }
}
```

## 📖 Writing Stories

### Basic Story Structure

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
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
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
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
```

### Advanced Story Patterns

#### Composite Stories

```typescript
// UserCard.stories.tsx
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <UserCard variant="default" user={mockUser} />
      <UserCard variant="compact" user={mockUser} />
      <UserCard variant="detailed" user={mockUser} />
    </div>
  ),
};
```

#### Interactive Stories

```typescript
// Form.stories.tsx
export const Interactive: Story = {
  render: () => {
    const [formData, setFormData] = useState({});

    return (
      <Form
        data={formData}
        onChange={setFormData}
        onSubmit={(data) => console.log('Form submitted:', data)}
      />
    );
  },
};
```

#### Stateful Stories

```typescript
// Modal.stories.tsx
export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </>
    );
  },
};
```

## 🎨 Visual Testing

### Chromatic Integration

```bash
# Install Chromatic
npm install --save-dev chromatic

# Run visual tests
npx chromatic --project-token=your-project-token
```

### Visual Regression Testing

```typescript
// Button.stories.tsx
export const VisualTest: Story = {
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  args: {
    children: 'Visual Test Button',
    variant: 'primary',
  },
};
```

## 🧪 Interaction Testing

### User Interactions

```typescript
// Button.stories.tsx
import { userEvent, within } from '@storybook/test';

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    // Add assertions here
  },
};
```

### Form Testing

```typescript
// Form.stories.tsx
export const FormSubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole('form');
    const submitButton = canvas.getByRole('button', { name: /submit/i });

    await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
    await userEvent.click(submitButton);

    await expect(canvas.getByText(/success/i)).toBeInTheDocument();
  },
};
```

## 📚 Documentation

### MDX Stories

````mdx
<!-- Button.mdx -->

import { Meta, Story, Canvas, Controls } from '@storybook/blocks';
import { Button } from './Button';

<Meta title="Shared/UI/Button" component={Button} />

# Button Component

A customizable button component with multiple variants and sizes.

## Usage

```tsx
import { Button } from '@/shared/ui/Button/Button';

<Button variant="primary" size="md">
  Click me
</Button>;
```
````

## Examples

<Canvas of={Button} />

<Controls of={Button} />
```

### Component Documentation

```typescript
// Button.stories.tsx
const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
# Button Component

A customizable button component with multiple variants and sizes.

## Features

- Multiple variants (primary, secondary, danger)
- Different sizes (sm, md, lg)
- Loading and disabled states
- Full accessibility support
- TypeScript support

## Usage

\`\`\`tsx
import { Button } from '@/shared/ui/Button/Button';

<Button variant="primary" size="md">
  Click me
</Button>
\`\`\`
        `,
      },
    },
  },
};
```

## 🚀 Running Storybook

### Development Commands

```bash
# Start Storybook in development mode
npm run storybook

# Build Storybook for production
npm run build-storybook

# Serve built Storybook
npm run serve-storybook
```

### Package.json Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "serve-storybook": "serve storybook-static"
  }
}
```

## 🔧 Configuration Options

### Addons Configuration

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
      },
    },
    {
      name: '@storybook/addon-a11y',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
    },
  ],
};
```

### Webpack Configuration

```typescript
// .storybook/main.ts
webpackFinal: async (config) => {
  // Add custom webpack configuration
  config.resolve?.alias?.set('@', path.resolve(__dirname, '../src'));

  // Handle CSS modules
  config.module?.rules?.push({
    test: /\.module\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      },
    ],
  });

  return config;
},
```

## 📊 Storybook Analytics

### Usage Tracking

```typescript
// .storybook/manager.ts
import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.light,
  panelPosition: 'bottom',
  selectedPanel: 'storybook/controls/panel',
});
```

### Performance Monitoring

```typescript
// .storybook/preview.ts
import { withPerformance } from '@storybook/addon-performance';

export const decorators = [withPerformance];
```

## 🎨 Design System Integration

### Theme Provider

```typescript
// .storybook/preview.ts
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
```

### Global Styles

```typescript
// .storybook/preview.ts
import '../src/shared/styles/globals.scss';
import '../src/shared/styles/variables.scss';
```

## 🚀 Deployment

### Static Hosting

```bash
# Build Storybook
npm run build-storybook

# Deploy to GitHub Pages
npx storybook-to-ghpages

# Deploy to Netlify
npx netlify deploy --dir=storybook-static
```

### CI/CD Integration

```yaml
# .github/workflows/storybook.yml
name: Storybook

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  storybook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build-storybook
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

## 🆘 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear Storybook cache
rm -rf .storybook-static
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Import Errors

```typescript
// Check path mapping in .storybook/main.ts
config.resolve?.alias?.set('@', path.resolve(__dirname, '../src'));
```

#### SCSS Issues

```typescript
// Add SCSS support in webpackFinal
config.module?.rules?.push({
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader'],
});
```

### Debug Mode

```bash
# Run Storybook in debug mode
DEBUG=storybook:* npm run storybook
```

---

**Last Updated:** December 2024  
**Version:** 2.0.0  
**Status:** ✅ Complete
