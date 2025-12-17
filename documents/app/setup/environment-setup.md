# 🌍 Environment Setup Guide

This guide will help you set up your development environment for our enterprise FSD foundation.

## 📋 Prerequisites

### Required Software

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** 2.30.0 or higher
- **VS Code** (recommended editor)

### Optional but Recommended

- **Docker** (for containerized development)
- **Postman** (for API testing)
- **Chrome DevTools** (for debugging)

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend-foundation
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Install Storybook dependencies (if not already installed)
npm install --save-dev @storybook/react @storybook/nextjs @storybook/addon-essentials @storybook/addon-docs @storybook/addon-a11y @storybook/addon-onboarding @storybook/addon-links
```

### 3. Environment Configuration

Our application uses a centralized environment configuration system located in `config/env/`. This system provides type-safe, validated environment variable management.

#### Environment Files

Create environment-specific files in `config/env/files/`:

```bash
# Development environment
echo "NODE_ENV=development
DEBUG_ENABLED=true
API_URL=http://localhost:3000/api
WS_URL=ws://localhost:3000/ws
GRAPHQL_URL=/graphql
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
SENTRY_DSN=
ANALYTICS_ID=" > config/env/files/.env.development

# Production environment
echo "NODE_ENV=production
DEBUG_ENABLED=false
API_URL=https://api.yourapp.com
WS_URL=wss://api.yourapp.com/ws
GRAPHQL_URL=/graphql
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=1h
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
ANALYTICS_ID=your-analytics-id" > config/env/files/.env.production
```

#### Environment System Features

- **Type Safety**: Full TypeScript support with strict typing
- **Validation**: Runtime validation of all environment variables
- **Defaults**: Sensible defaults for all configurations
- **Centralized**: Single source of truth for all environment variables

#### Usage

```typescript
import { envConfig, isDevelopment, isProduction } from '@/config/env';

// Use environment configuration
console.log(envConfig.appName); // "Abstract Team"
console.log(envConfig.apiUrl); // Environment-specific URL

// Environment checks
if (isDevelopment) {
  console.log('Running in development mode');
}
```

For detailed documentation, see [Environment Configuration System](../config/environment/README.md).

### 4. VS Code Setup

Install recommended extensions:

```bash
# Install VS Code extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension ms-vscode.vscode-json
```

### 5. Git Hooks Setup

```bash
# Install husky for git hooks
npm install --save-dev husky

# Setup git hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-push "npm run test"
```

## 🔧 Configuration

### TypeScript Configuration

The project uses TypeScript with strict configuration. Key settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint Configuration

ESLint is configured with strict rules:

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:storybook/recommended"
  ]
}
```

### Prettier Configuration

Code formatting is handled by Prettier:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🧪 Verify Installation

### 1. Run Tests

```bash
npm test
```

### 2. Run Linting

```bash
npm run lint
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Storybook

```bash
npm run storybook
```

### 5. Build Project

```bash
npm run build
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill processes on ports 3000 and 6006
npx kill-port 3000 6006
```

#### Node Modules Issues

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit
```

#### Storybook Issues

```bash
# Clear Storybook cache
rm -rf .storybook-static
rm -rf node_modules/.cache
npm run storybook
```

### Environment Variables

Required environment variables:

```bash
# .env.local
NEXT_PUBLIC_APP_NAME=Abstract Team
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/api/graphql

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📚 Next Steps

After completing the environment setup:

1. Read the [Development Workflow Guide](./development-workflow.md)
2. Explore the [Component Development Guide](./component-development.md)
3. Set up [Testing Environment](./testing-setup.md)
4. Learn about [Storybook Setup](./storybook-setup.md)

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting Section](#-troubleshooting)
2. Review the [Project Documentation](../README.md)
3. Check [GitHub Issues](https://github.com/your-org/frontend-foundation/issues)
4. Contact the development team

---

**Last Updated:** December 2024  
**Version:** 2.0.0  
**Status:** ✅ Complete
