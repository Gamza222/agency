#!/usr/bin/env node

/**
 * Build Info Generator
 *
 * Generates build information file for CI/CD and monitoring.
 * This script is called during the build process to create build-info.json.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { envConfig } from '../config/env';
import { getVersionDisplay, getVersionInfo } from '../config/version';

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

/**
 * Generate build information
 */
function generateBuildInfo(): BuildInfo {
  const versionInfo = getVersionInfo();
  const buildTime = new Date().toISOString();

  const buildInfo: BuildInfo = {
    // Version information
    version: envConfig.appVersion,
    versionDisplay: getVersionDisplay(),
    versionInfo: {
      major: versionInfo.major,
      minor: versionInfo.minor,
      patch: versionInfo.patch,
      prerelease: versionInfo.prerelease,
      versionCode: versionInfo.versionCode,
      commitHash: versionInfo.commitHash,
      branch: versionInfo.branch,
    },

    // Environment information
    environment: envConfig.appEnv,
    isDevelopment: envConfig.isDevelopment,
    isProduction: envConfig.isProduction,
    isTest: envConfig.isTest,
    isPreview: envConfig.isPreview,

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
      name: envConfig.appName,
      apiUrl: envConfig.apiUrl,
      wsUrl: envConfig.wsUrl,
      graphqlUrl: envConfig.graphqlUrl,
      debugEnabled: envConfig.debugEnabled,
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

// Run if called directly
if (require.main === module) {
  try {
    generateBuildInfo();
  } catch (error) {
    console.error('❌ Failed to generate build info:', (error as Error).message);
    process.exit(1);
  }
}

export { generateBuildInfo };
