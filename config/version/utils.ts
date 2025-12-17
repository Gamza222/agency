/**
 * Version Management Utils
 *
 * Utility functions for version management.
 * Clean, focused version handling functions.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { ChangelogEntry, VersionBumpType, VersionInfo } from './types';

// Version patterns
const VERSION_PATTERNS = {
  SEMVER: /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/,
  CHANGELOG_HEADER: /^## \[(\d+\.\d+\.\d+)\]/,
  VERSION_LINE: /^version:\s*(\d+\.\d+\.\d+)/,
} as const;

// File paths
const VERSION_FILE_PATH = join(process.cwd(), 'package.json');

/**
 * Parse version string into VersionInfo object
 */
export function parseVersion(versionString: string): VersionInfo {
  const match = versionString.match(VERSION_PATTERNS.SEMVER);
  if (!match) {
    throw new Error(`Invalid version string: ${versionString}`);
  }

  const [, major, minor, patch, prerelease, build] = match;

  return {
    major: parseInt(major!, 10),
    minor: parseInt(minor!, 10),
    patch: parseInt(patch!, 10),
    prerelease: prerelease || undefined,
    build: build || undefined,
    version: versionString,
    versionCode: calculateVersionCode(
      parseInt(major!, 10),
      parseInt(minor!, 10),
      parseInt(patch!, 10)
    ),
    releaseDate: new Date().toISOString().split('T')[0] as string,
  };
}

/**
 * Calculate version code from major, minor, patch
 */
export function calculateVersionCode(major: number, minor: number, patch: number): number {
  return major * 10000 + minor * 100 + patch;
}

/**
 * Get current version from package.json
 */
export function getCurrentVersion(): VersionInfo {
  try {
    const packageJson = JSON.parse(readFileSync(VERSION_FILE_PATH, 'utf8')) as { version: string };
    return parseVersion(packageJson.version);
  } catch (error) {
    // console.error('Failed to read version from package.json:', error);
    return parseVersion('0.1.0');
  }
}

/**
 * Bump version based on type
 */
export function bumpVersion(currentVersion: VersionInfo, bumpType: VersionBumpType): VersionInfo {
  const { major, minor, patch, prerelease } = currentVersion;
  let newMajor = major;
  let newMinor = minor;
  let newPatch = patch;
  let newPrerelease: string | undefined;

  switch (bumpType) {
    case 'major':
      newMajor += 1;
      newMinor = 0;
      newPatch = 0;
      newPrerelease = undefined;
      break;
    case 'minor':
      newMinor += 1;
      newPatch = 0;
      newPrerelease = undefined;
      break;
    case 'patch':
      newPatch += 1;
      newPrerelease = undefined;
      break;
    case 'prerelease':
      if (prerelease) {
        const prereleaseMatch = prerelease.match(/^(.+?)\.(\d+)$/);
        if (prereleaseMatch) {
          const [, prereleaseId, prereleaseNumber] = prereleaseMatch;
          newPrerelease = `${prereleaseId}.${parseInt(prereleaseNumber!) + 1}`;
        } else {
          newPrerelease = `${prerelease}.1`;
        }
      } else {
        newPrerelease = 'dev.1';
      }
      break;
  }

  const newVersionString = `${newMajor}.${newMinor}.${newPatch}${newPrerelease ? `-${newPrerelease}` : ''}`;
  return parseVersion(newVersionString);
}

/**
 * Generate changelog entry
 */
export function generateChangelogEntry(
  versionInfo: VersionInfo,
  changes: string[]
): ChangelogEntry {
  return {
    version: versionInfo.version,
    date: versionInfo.releaseDate,
    changes: {
      added: changes.filter((c) => c.startsWith('+') || c.startsWith('add:')),
      fixed: changes.filter((c) => c.startsWith('fix:') || c.startsWith('bug:')),
      changed: changes.filter((c) => c.startsWith('change:') || c.startsWith('update:')),
      removed: changes.filter((c) => c.startsWith('-') || c.startsWith('remove:')),
      security: changes.filter((c) => c.startsWith('security:') || c.startsWith('sec:')),
    },
    contributors: [],
  };
}

/**
 * Update changelog with new entry
 */
export function updateChangelog(_changelogPath: string, _entry: ChangelogEntry): void {
  // console.log(`Updating changelog at ${changelogPath} with version ${entry.version}`);
  // Implementation would go here
}

/**
 * Save version history
 */
export function saveVersionHistory(_versionInfo: VersionInfo, _changes: string[]): void {
  // console.log(`Saving version history for ${versionInfo.version}`);
  // Implementation would go here
}

/**
 * Complete version bump process
 */
export function bumpVersionComplete(bumpType: VersionBumpType, changes: string[]): VersionInfo {
  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersion(currentVersion, bumpType);
  const entry = generateChangelogEntry(newVersion, changes);

  updateChangelog('./CHANGELOG.md', entry);
  saveVersionHistory(newVersion, changes);

  return newVersion;
}

/**
 * Get version info
 */
export function getVersionInfo(): VersionInfo {
  return getCurrentVersion();
}

/**
 * Get version display string
 */
export function getVersionDisplay(): string {
  const version = getCurrentVersion();
  const env = (process.env.NODE_ENV as string) || 'development';

  switch (env) {
    case 'development':
      return `${version.version}-dev`;
    case 'production':
      return version.version;
    case 'test':
      return `${version.version}-test`;
    case 'preview':
      return `${version.version}-preview`;
    default:
      return version.version;
  }
}

/**
 * Check if version is prerelease
 */
export function isPrerelease(version: string): boolean {
  return VERSION_PATTERNS.SEMVER.test(version) && version.includes('-');
}
