#!/usr/bin/env node

/**
 * Version Management Script
 *
 * Command-line tool for managing application versions, changelog, and deployment.
 * Usage: ts-node scripts/version.ts <command> [options]
 */

import { execSync } from 'child_process';
import {
  bumpVersionComplete,
  getCurrentVersion,
  getVersionDisplay,
  getVersionInfo,
  isPrerelease,
} from '../config/version';
import { envConfig, validateEnvironment } from '../config/env';
import { getCiConfig } from '../config/ci/ci.config';

// ============================================================================
// COMMAND LINE INTERFACE
// ============================================================================

interface CommandFunction {
  (): void;
}

interface Commands {
  [key: string]: CommandFunction;
}

const commands: Commands = {
  current: () => {
    getCurrentVersion();
    // console.log(`Current version: ${version.version}`);
    // console.log(`Version code: ${version.versionCode}`);
    // console.log(`Release date: ${version.releaseDate}`);
    // console.log(`Commit hash: ${version.commitHash || 'N/A'}`);
    // console.log(`Branch: ${version.branch || 'N/A'}`);
  },

  info: () => {
    getVersionInfo();
    // console.log('Version Information:');
    // console.log(JSON.stringify(version, null, 2));
  },

  display: () => {
    // console.log(`Version display: ${getVersionDisplay()}`);
  },

  'bump:major': () => {
    const changes = ['Major new features', 'Breaking changes', 'Bug fixes'];
    bumpVersionComplete('major', changes);
  },

  'bump:minor': () => {
    const changes = ['New features', 'Bug fixes'];
    bumpVersionComplete('minor', changes);
  },

  'bump:patch': () => {
    const changes = ['Bug fixes'];
    bumpVersionComplete('patch', changes);
  },

  'bump:prerelease': () => {
    const changes = ['Pre-release features', 'Pre-release bug fixes'];
    bumpVersionComplete('prerelease', changes);
  },

  release: () => {
    const currentVersion = getCurrentVersion();
    if (isPrerelease(currentVersion.version)) {
      // Cannot release a prerelease version. Please bump to a stable version first.
      process.exit(1);
    }

    const version = getCurrentVersion();
    // Releasing version ${version.version}

    // Create git tag
    try {
      execSync(`git tag -a v${version.version} -m "Release version ${version.version}"`, {
        stdio: 'inherit',
      });
      // Created git tag v${version.version}
    } catch (error) {
      // Failed to create git tag: ${(error as Error).message}
      process.exit(1);
    }

    // Push tag to remote
    try {
      execSync(`git push origin v${version.version}`, { stdio: 'inherit' });
      // Pushed tag v${version.version} to remote
    } catch (error) {
      // Failed to push git tag: ${(error as Error).message}
      process.exit(1);
    }
  },

  env: () => {
    // console.log(`Environment: ${envConfig.appEnv}`);
    // console.log(`Version: ${envConfig.appVersion}`);
    // console.log(`Debug: ${envConfig.debugEnabled}`);
    // console.log(`API URL: ${envConfig.apiUrl}`);
  },

  ci: () => {
    getCiConfig(process.env.NODE_ENV || 'development');
    // console.log('CI Configuration:');
    // console.log(JSON.stringify(config, null, 2));
  },

  validate: () => {
    try {
      validateEnvironment();
      // Environment validation passed
    } catch (error) {
      // Environment validation failed: ${(error as Error).message}
      process.exit(1);
    }
  },

  buildinfo: () => {
    // Generate build info (values are used in commented console.log)
    const versionInfo = getVersionInfo();
    const versionDisplay = getVersionDisplay();
    const environment = envConfig.appEnv;
    const buildTime = new Date().toISOString();
    const nodeVersion = process.version;
    const platform = process.platform;
    const arch = process.arch;

    // Suppress unused variable warnings
    void versionInfo;
    void versionDisplay;
    void environment;
    void buildTime;
    void nodeVersion;
    void platform;
    void arch;
    // console.log(JSON.stringify(buildInfo, null, 2));
  },

  help: () => {
    // Version Management Script
    //
    // Usage: ts-node scripts/version.ts <command> [options]
    //
    // Commands:
    //   current              Show current version information
    //   info                 Show detailed version information
    //   display              Show environment-specific version display
    //   env                  Show environment configuration
    //   ci                   Show CI configuration
    //   validate             Validate environment configuration
    //   buildinfo            Show build information for CI/CD
    //   bump:major           Bump major version (1.0.0 -> 2.0.0)
    //   bump:minor           Bump minor version (1.0.0 -> 1.1.0)
    //   bump:patch           Bump patch version (1.0.0 -> 1.0.1)
    //   bump:prerelease      Bump prerelease version (1.0.0 -> 1.0.1-dev.1)
    //   release              Create and push git tag for current version
    //   help                 Show this help message
    //
    // Options:
    //   --prerelease-id <id> Specify prerelease identifier (default: dev)
    //
    // Examples:
    //   ts-node scripts/version.ts current
    //   ts-node scripts/version.ts env
    //   ts-node scripts/version.ts ci
    //   ts-node scripts/version.ts validate
    //   ts-node scripts/version.ts buildinfo
    //   ts-node scripts/version.ts bump:minor
    //   ts-node scripts/version.ts bump:prerelease --prerelease-id beta
    //   ts-node scripts/version.ts release
  },
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main(): void {
  const command = process.argv[2];

  if (!command || !commands[command]) {
    // Unknown command: ${command}
    // Use "ts-node scripts/version.ts help" to see available commands.
    process.exit(1);
  }

  try {
    commands[command]();
  } catch (error) {
    // Error executing command "${command}": ${(error as Error).message}
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { commands, main };
