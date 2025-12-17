# Environment Configuration System

A comprehensive, type-safe environment configuration system that provides centralized management of all environment variables with validation, defaults, and overrides.

## Overview

The environment configuration system is located in `config/env/` and follows FSD architecture principles. It provides:

- **Type Safety**: Full TypeScript support with strict typing
- **Validation**: Runtime validation of all environment variables
- **Defaults**: Sensible defaults for all configurations
- **Overrides**: Environment-specific overrides
- **Centralized**: Single source of truth for all environment variables

## Structure

```
config/env/
├── index.ts              # Main exports
├── types/                # TypeScript type definitions
│   └── types.ts
├── constants/            # Environment variable constants
│   └── constants.ts
├── validation/           # Validation schemas
│   └── validation.ts
├── config/               # Configuration logic
│   └── config.ts
├── utils/                # Utility functions
│   └── utils.ts
└── files/                # Environment files
    ├── .env.development
    ├── .env.production
    └── .env.preview
```

## Usage

### Basic Import

```typescript
import { envConfig, isDevelopment, isProduction } from '@/config/env';

// Use environment configuration
console.log(envConfig.appName); // "Abstract Team"
console.log(envConfig.apiUrl); // "http://localhost:3000/api"

// Environment checks
if (isDevelopment) {
  console.log('Running in development mode');
}
```

### Environment Variables

The system supports the following environment variables:

#### Core Application

- `NODE_ENV` - Environment (development, production, test, preview)
- `PORT` - Server port (default: 3000)
- `APP_NAME` - Application name (default: "Abstract Team")
- `APP_VERSION` - Application version (from package.json)

#### API Configuration

- `API_URL` - Base API URL
- `WS_URL` - WebSocket URL
- `GRAPHQL_URL` - GraphQL endpoint

#### Security

- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time

#### External Services

- `SENTRY_DSN` - Sentry error tracking DSN
- `ANALYTICS_ID` - Analytics tracking ID

#### Development

- `DEBUG_ENABLED` - Enable debug mode
- `LOG_LEVEL` - Logging level

### Environment Files

Create environment-specific files in `config/env/files/`:

```bash
# .env.development
NODE_ENV=development
DEBUG_ENABLED=true
API_URL=http://localhost:3000/api

# .env.production
NODE_ENV=production
DEBUG_ENABLED=false
API_URL=https://api.yourapp.com
```

### Validation

The system automatically validates all environment variables:

```typescript
import { envConfig } from '@/config/env';

// This will throw if validation fails
envConfig.validate();
```

### Environment Checks

```typescript
import { isDevelopment, isProduction, isTest, isPreview } from '@/config/env';

if (isDevelopment) {
  // Development-specific code
}

if (isProduction) {
  // Production-specific code
}
```

## Configuration Priority

1. **Environment Files** (`.env.*`) - Highest priority
2. **Environment Overrides** - Environment-specific overrides
3. **Default Values** - Fallback defaults

## Type Safety

All environment variables are fully typed:

```typescript
interface EnvironmentConfig {
  port: number;
  appName: string;
  appVersion: string;
  appEnv: Environment;
  apiUrl: string;
  wsUrl: string;
  graphqlUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  sentryDsn: string;
  analyticsId: string;
  debugEnabled: boolean;
  // ... more properties
}
```

## Best Practices

1. **Always use the centralized config** - Don't access `process.env` directly
2. **Use environment checks** - Use `isDevelopment`, `isProduction` instead of string comparisons
3. **Validate early** - Call `envConfig.validate()` in your app initialization
4. **Type everything** - All environment variables should be typed
5. **Document variables** - Add JSDoc comments for new environment variables

## Adding New Environment Variables

1. Add the variable to `types/types.ts`
2. Add default value to `constants/constants.ts`
3. Add validation to `validation/validation.ts`
4. Update environment files if needed
5. Document the variable in this README

## Testing

The environment configuration system includes comprehensive tests:

```bash
npm test -- --testPathPattern="config/env"
```

## Integration

The environment configuration integrates with:

- **Version Management** - Provides app version and environment info
- **CI/CD Pipeline** - Used for environment-specific builds
- **Monitoring** - Provides environment context for logging
- **Security** - Manages security-related environment variables
