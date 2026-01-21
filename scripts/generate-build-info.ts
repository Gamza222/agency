#!/usr/bin/env node

/**
 * Build Info Generator
 *
 * Generates build information file for CI/CD and monitoring.
 * This script is called during the build process to create build-info.json.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import { pathToFileURL } from 'url';

interface BuildInfo {
  version: string;
  versionDisplay: string;
  versionInfo: {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
    versionCode: number;
    commitHash?: string;
    branch?: string;
  };
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  isPreview: boolean;
  buildTime: string;
  nodeVersion: string;
  platform: string;
  arch: string;
  ci: {
    githubRef?: string;
    githubSha?: string;
    githubRunId?: string;
    githubRunNumber?: string;
    githubActor?: string;
    githubRepository?: string;
    githubWorkflow?: string;
  };
  app: {
    name: string;
    apiUrl: string;
    wsUrl: string;
    graphqlUrl: string;
    debugEnabled: boolean;
  };
}

function getEnv(key: string, fallback = ''): string {
  const v = process.env[key];
  return v !== undefined ? v : fallback;
}

function getEnvBool(key: string, fallback = false): boolean {
  const v = process.env[key];
  if (v === undefined) return fallback;
  return v === '1' || v.toLowerCase() === 'true' || v.toLowerCase() === 'yes';
}

function parseSemver(version: string): { major: number; minor: number; patch: number; prerelease?: string } {
  // Supports: 1.2.3, 1.2.3-beta.1
  const m = version.trim().match(/^v?(\\d+)\\.(\\d+)\\.(\\d+)(?:-([0-9A-Za-z.-]+))?/);
  if (!m) return { major: 0, minor: 0, patch: 0 };
  const [, maj, min, pat, pre] = m;
  return {
    major: Number(maj),
    minor: Number(min),
    patch: Number(pat),
    ...(pre ? { prerelease: pre } : {}),
  };
}

function getPackageVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    return typeof pkg.version === 'string' ? pkg.version : '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Generate build information
 */
function generateBuildInfo(): BuildInfo {
  const version = getPackageVersion();
  const parsed = parseSemver(version);
  const buildTime = new Date().toISOString();

  const buildInfo: BuildInfo = {
    // Version information
    version,
    versionDisplay: version,
    versionInfo: {
      major: parsed.major,
      minor: parsed.minor,
      patch: parsed.patch,
      prerelease: parsed.prerelease,
      // simple monotonic code: major*1e6 + minor*1e3 + patch
      versionCode: parsed.major * 1_000_000 + parsed.minor * 1_000 + parsed.patch,
      commitHash: process.env.GITHUB_SHA,
      branch: process.env.GITHUB_REF_NAME || process.env.GITHUB_REF,
    },

    // Environment information
    environment: getEnv('APP_ENV', process.env.NODE_ENV || 'production'),
    isDevelopment: (process.env.NODE_ENV || '') === 'development',
    isProduction: (process.env.NODE_ENV || 'production') === 'production',
    isTest: (process.env.NODE_ENV || '') === 'test',
    isPreview: getEnvBool('IS_PREVIEW', false),

    // Build information
    buildTime,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,

    // CI/CD information (if available)
    ci: {
      githubRef: process.env.GITHUB_REF,
      githubSha: process.env.GITHUB_SHA,
      githubRunId: process.env.GITHUB_RUN_ID,
      githubRunNumber: process.env.GITHUB_RUN_NUMBER,
      githubActor: process.env.GITHUB_ACTOR,
      githubRepository: process.env.GITHUB_REPOSITORY,
      githubWorkflow: process.env.GITHUB_WORKFLOW,
    },

    // Application information
    app: {
      name: getEnv('APP_NAME', 'app'),
      apiUrl: getEnv('VITE_API_URL', ''),
      wsUrl: getEnv('VITE_WS_URL', ''),
      graphqlUrl: getEnv('VITE_GRAPHQL_URL', ''),
      debugEnabled: getEnvBool('VITE_DEBUG_ENABLED', false),
    },
  };

  // Write build info to public directory for runtime access
  const publicPath = join(process.cwd(), 'public', 'build-info.json');
  mkdirSync(dirname(publicPath), { recursive: true });
  writeFileSync(publicPath, JSON.stringify(buildInfo, null, 2));

  // Also write to build directory for CI/CD access
  const buildPath = join(process.cwd(), 'build-info.json');
  mkdirSync(dirname(buildPath), { recursive: true });
  writeFileSync(buildPath, JSON.stringify(buildInfo, null, 2));

  // Build info generated successfully
  // Public path: ${publicPath}
  // Build path: ${buildPath}
  // Version: ${buildInfo.versionDisplay}
  // Environment: ${buildInfo.environment}

  return buildInfo;
}

// Run if called directly (ESM-safe)
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try {
    generateBuildInfo();
  } catch (error) {
    console.error('❌ Failed to generate build info:', (error as Error).message);
    process.exit(1);
  }
}

export { generateBuildInfo };
