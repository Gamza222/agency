/**
 * Version Configuration
 *
 * Main version configuration class.
 * Clean, focused version configuration.
 */

import { VersionConfig, VersionHistory, VersionInfo } from './types';
import { getCurrentVersion } from './utils';

export class VersionConfigClass implements VersionConfig {
  public readonly currentVersion: VersionInfo;
  public readonly versionHistory: VersionHistory;
  public readonly changelogPath: string;
  public readonly packageJsonPath: string;

  constructor() {
    this.currentVersion = getCurrentVersion();
    this.versionHistory = {};
    this.changelogPath = './CHANGELOG.md';
    this.packageJsonPath = './package.json';
  }

  public validate(): void {
    // Validate current version
    if (!this.currentVersion || !this.currentVersion.version) {
      throw new Error('Invalid current version');
    }
  }
}

export const versionConfig = new VersionConfigClass();
export const validateVersionConfig = () => versionConfig.validate();
