/**
 * Version Management Tests
 *
 * Tests for version management system.
 */

import {
  bumpVersion,
  calculateVersionCode,
  getCurrentVersion,
  getVersionDisplay,
  isPrerelease,
  parseVersion,
} from './index';

// Mock package.json
jest.mock('fs', () => ({
  readFileSync: jest.fn((path: string) => {
    if (path.includes('package.json')) {
      return JSON.stringify({ version: '2.0.0' });
    }
    return '';
  }),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => false),
}));

describe('Version Management', () => {
  describe('Version Parsing', () => {
    it('should parse standard version', () => {
      const version = parseVersion('2.0.0');

      expect(version.major).toBe(2);
      expect(version.minor).toBe(0);
      expect(version.patch).toBe(0);
      expect(version.version).toBe('2.0.0');
      expect(version.versionCode).toBe(20000);
    });

    it('should parse prerelease version', () => {
      const version = parseVersion('2.0.0-alpha.1');

      expect(version.major).toBe(2);
      expect(version.minor).toBe(0);
      expect(version.patch).toBe(0);
      expect(version.prerelease).toBe('alpha.1');
      expect(version.version).toBe('2.0.0-alpha.1');
    });

    it('should parse version with build metadata', () => {
      const version = parseVersion('2.0.0+20231201');

      expect(version.major).toBe(2);
      expect(version.minor).toBe(0);
      expect(version.patch).toBe(0);
      expect(version.build).toBe('20231201');
      expect(version.version).toBe('2.0.0+20231201');
    });

    it('should throw error for invalid version', () => {
      expect(() => parseVersion('invalid-version')).toThrow(
        'Invalid version string: invalid-version'
      );
    });
  });

  describe('Version Code Calculation', () => {
    it('should calculate version code correctly', () => {
      expect(calculateVersionCode(1, 0, 0)).toBe(10000);
      expect(calculateVersionCode(2, 1, 0)).toBe(20100);
      expect(calculateVersionCode(2, 0, 5)).toBe(20005);
      expect(calculateVersionCode(10, 5, 3)).toBe(100503);
    });
  });

  describe('Version Bumping', () => {
    const baseVersion = parseVersion('2.0.0');

    it('should bump major version', () => {
      const newVersion = bumpVersion(baseVersion, 'major');

      expect(newVersion.major).toBe(3);
      expect(newVersion.minor).toBe(0);
      expect(newVersion.patch).toBe(0);
      expect(newVersion.version).toBe('3.0.0');
    });

    it('should bump minor version', () => {
      const newVersion = bumpVersion(baseVersion, 'minor');

      expect(newVersion.major).toBe(2);
      expect(newVersion.minor).toBe(1);
      expect(newVersion.patch).toBe(0);
      expect(newVersion.version).toBe('2.1.0');
    });

    it('should bump patch version', () => {
      const newVersion = bumpVersion(baseVersion, 'patch');

      expect(newVersion.major).toBe(2);
      expect(newVersion.minor).toBe(0);
      expect(newVersion.patch).toBe(1);
      expect(newVersion.version).toBe('2.0.1');
    });

    it('should bump prerelease version', () => {
      const newVersion = bumpVersion(baseVersion, 'prerelease');

      expect(newVersion.major).toBe(2);
      expect(newVersion.minor).toBe(0);
      expect(newVersion.patch).toBe(0);
      expect(newVersion.prerelease).toBe('alpha.1');
      expect(newVersion.version).toBe('2.0.0-alpha.1');
    });

    it('should increment existing prerelease', () => {
      const prereleaseVersion = parseVersion('2.0.0-alpha.1');
      const newVersion = bumpVersion(prereleaseVersion, 'prerelease');

      expect(newVersion.prerelease).toBe('alpha.2');
      expect(newVersion.version).toBe('2.0.0-alpha.2');
    });
  });

  describe('Version Display', () => {
    it('should display development version', () => {
      (process.env as any).NODE_ENV = 'development';
      const display = getVersionDisplay();

      expect(display).toBe('2.0.0-dev');
    });

    it('should display production version', () => {
      (process.env as any).NODE_ENV = 'production';
      const display = getVersionDisplay();

      expect(display).toBe('2.0.0');
    });

    it('should display test version', () => {
      (process.env as any).NODE_ENV = 'test';
      const display = getVersionDisplay();

      expect(display).toBe('2.0.0-test');
    });

    it('should display preview version', () => {
      (process.env as any).NODE_ENV = 'preview';
      const display = getVersionDisplay();

      expect(display).toBe('2.0.0-preview');
    });
  });

  describe('Prerelease Detection', () => {
    it('should detect prerelease versions', () => {
      expect(isPrerelease('2.0.0-alpha.1')).toBe(true);
      expect(isPrerelease('2.0.0-beta.2')).toBe(true);
      expect(isPrerelease('2.0.0-rc.1')).toBe(true);
    });

    it('should not detect stable versions as prerelease', () => {
      expect(isPrerelease('2.0.0')).toBe(false);
      expect(isPrerelease('1.5.3')).toBe(false);
    });
  });

  describe('Current Version', () => {
    it('should get current version from package.json', () => {
      const version = getCurrentVersion();

      expect(version.version).toBe('2.0.0');
      expect(version.major).toBe(2);
      expect(version.minor).toBe(0);
      expect(version.patch).toBe(0);
    });
  });
});
