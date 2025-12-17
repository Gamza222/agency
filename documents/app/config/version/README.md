# Version Management System

A comprehensive version management system that handles semantic versioning, changelog generation, and build information with full TypeScript support.

## Overview

The version management system is located in `config/version/` and provides:

- **Semantic Versioning**: Full semver support with bumping capabilities
- **Build Information**: Automatic build info generation
- **Changelog Management**: Automated changelog updates
- **Git Integration**: Version tagging and release management
- **Type Safety**: Full TypeScript support

## Structure

```
config/version/
├── index.ts              # Main exports
├── types/                # TypeScript type definitions
│   └── types.ts
├── constants/            # Version constants
│   └── constants.ts
├── validation/           # Version validation
│   └── validation.ts
├── config/               # Version configuration
│   └── config.ts
├── utils/                # Utility functions
│   └── utils.ts
└── files/                # Version files
    ├── CHANGELOG.md
    └── VERSION
```

## Usage

### Basic Import

```typescript
import { getCurrentVersion, getVersionDisplay, getVersionInfo } from '@/config/version';

// Get current version
const version = getCurrentVersion();
console.log(version.version); // "0.1.0"

// Get formatted version display
const display = getVersionDisplay();
console.log(display); // "v0.1.0 (development)"

// Get detailed version info
const info = getVersionInfo();
console.log(info.buildTime); // "2024-01-15T10:30:00.000Z"
```

### Version Operations

```typescript
import { parseVersion, bumpVersion, isPrerelease } from '@/config/version';

// Parse version string
const version = parseVersion('1.2.3');
console.log(version.major); // 1
console.log(version.minor); // 2
console.log(version.patch); // 3

// Bump version
const newVersion = bumpVersion(version, 'minor');
console.log(newVersion.version); // "1.3.0"

// Check if prerelease
const isPre = isPrerelease('1.2.3-beta.1');
console.log(isPre); // true
```

### Version Display

```typescript
import { getVersionDisplay } from '@/config/version';

// Environment-aware version display
const display = getVersionDisplay();
// Development: "v0.1.0 (development)"
// Production: "v0.1.0"
// Test: "v0.1.0 (test)"
```

## CLI Commands

The version system provides comprehensive CLI commands:

### Version Information

```bash
# Get current version
npm run version:current

# Get version info
npm run version:info

# Display version
npm run version:display

# Get environment-specific version
npm run version:env
```

### Version Bumping

```bash
# Bump patch version (0.1.0 → 0.1.1)
npm run version:bump:patch

# Bump minor version (0.1.0 → 0.2.0)
npm run version:bump:minor

# Bump major version (0.1.0 → 1.0.0)
npm run version:bump:major

# Bump prerelease (0.1.0 → 0.1.1-beta.1)
npm run version:bump:prerelease
```

### Version Management

```bash
# Validate version
npm run version:validate

# Generate build info
npm run version:buildinfo

# Create release
npm run version:release

# Show help
npm run version:help
```

## Build Information

The system automatically generates build information:

```typescript
import { getVersionInfo } from '@/config/version';

const buildInfo = getVersionInfo();
console.log(buildInfo);
// {
//   version: "0.1.0",
//   buildTime: "2024-01-15T10:30:00.000Z",
//   gitHash: "abc123def456",
//   gitBranch: "main",
//   nodeVersion: "18.17.0",
//   environment: "production"
// }
```

## Changelog Management

The system automatically updates CHANGELOG.md:

```markdown
# Changelog

## [0.1.1] - 2024-01-15

### Added

- New feature implementation
- Additional configuration options

### Changed

- Updated dependencies
- Improved performance

### Fixed

- Bug fixes
- Security improvements

## [0.1.0] - 2024-01-01

### Added

- Initial release
- Core functionality
```

## Git Integration

The version system integrates with Git:

- **Automatic Tagging**: Creates Git tags for releases
- **Commit Integration**: Links versions to Git commits
- **Branch Detection**: Identifies current Git branch
- **Hash Tracking**: Records Git commit hashes

## Environment Integration

The version system integrates with the environment configuration:

```typescript
import { envConfig } from '@/config/env';
import { getVersionDisplay } from '@/config/version';

// Environment-aware version display
const versionDisplay = getVersionDisplay();
// Uses envConfig.appEnv for environment-specific formatting
```

## CI/CD Integration

The version system integrates with CI/CD pipelines:

- **Build Info Generation**: Automatic build info for deployments
- **Version Validation**: Ensures version consistency
- **Release Automation**: Automated release creation
- **Environment Tagging**: Environment-specific version tags

## Type Safety

All version operations are fully typed:

```typescript
interface Version {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
  version: string;
}

interface VersionInfo {
  version: string;
  buildTime: string;
  gitHash: string;
  gitBranch: string;
  nodeVersion: string;
  environment: string;
}
```

## Best Practices

1. **Use semantic versioning** - Follow semver.org guidelines
2. **Validate versions** - Always validate before bumping
3. **Update changelog** - Keep changelog up to date
4. **Tag releases** - Create Git tags for releases
5. **Test versions** - Test version changes in CI/CD

## Adding New Version Features

1. Add types to `types/types.ts`
2. Add constants to `constants/constants.ts`
3. Add validation to `validation/validation.ts`
4. Add utilities to `utils/utils.ts`
5. Update CLI commands in `scripts/version.ts`
6. Document the feature in this README

## Testing

The version management system includes comprehensive tests:

```bash
npm test -- --testPathPattern="config/version"
```

## Integration Points

The version system integrates with:

- **Environment Configuration** - Provides version context
- **CI/CD Pipeline** - Automated version management
- **Build Process** - Build info generation
- **Monitoring** - Version tracking in logs
- **Git** - Version tagging and commit tracking
