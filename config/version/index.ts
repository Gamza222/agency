/**
 * Version Management - Main Entry Point
 *
 * This is the SINGLE entry point for all version management needs.
 * Follows FSD principles by providing a clean, organized interface.
 *
 * Usage:
 *   import { getCurrentVersion, bumpVersion, getVersionDisplay } from '@/config/version';
 *   import { VersionInfo, VersionBumpType } from '@/config/version';
 */

// ============================================================================
// CORE EXPORTS - Most commonly used
// ============================================================================

// Version management (most used)
export {
  getCurrentVersion,
  getVersionInfo,
  getVersionDisplay,
  parseVersion,
  calculateVersionCode,
} from './utils';

// Version configuration
export { versionConfig, validateVersionConfig } from './config';

// ============================================================================
// TYPE EXPORTS - For TypeScript usage
// ============================================================================

export type {
  VersionInfo,
  VersionBumpType,
  ChangelogEntry,
  VersionHistory,
  VersionConfig,
} from './types';

// ============================================================================
// ADVANCED EXPORTS - For advanced usage
// ============================================================================

// Version utilities
export {
  bumpVersion,
  generateChangelogEntry,
  updateChangelog,
  saveVersionHistory,
  bumpVersionComplete,
  isPrerelease,
} from './utils';

// ============================================================================
// DEFAULT EXPORT - Main configuration instance
// ============================================================================

export { versionConfig as default } from './config';
