/**
 * Version Management Types
 *
 * Type definitions for version management system.
 * Clean, focused types for version handling.
 */

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
  version: string;
  versionCode: number;
  releaseDate: string;
  commitHash?: string;
  branch?: string;
}

export type VersionBumpType = 'major' | 'minor' | 'patch' | 'prerelease';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    added: string[];
    fixed: string[];
    changed: string[];
    removed: string[];
    security: string[];
  };
  contributors: string[];
}

export interface VersionHistory {
  [version: string]: {
    date: string;
    changes: string[];
    type: string;
    breaking?: boolean;
  };
}

export interface VersionConfig {
  currentVersion: VersionInfo;
  versionHistory: VersionHistory;
  changelogPath: string;
  packageJsonPath: string;
}
