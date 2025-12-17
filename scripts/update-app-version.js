const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json
const packageJson = require('../package.json');
const version = packageJson.version;

// Get current git commit
const gitCommit = execSync('git rev-parse HEAD').toString().trim();

// Get build number (from CI or increment local)
let buildNumber;
try {
  // Try to read current build number
  const buildFile = path.join(__dirname, '.build-number');
  buildNumber = fs.existsSync(buildFile) ? Number(fs.readFileSync(buildFile, 'utf8')) : 0;

  // Increment and save
  buildNumber++;
  fs.writeFileSync(buildFile, buildNumber.toString());
} catch (error) {
  buildNumber = 0;
}

// Path to constants file
const constantsPath = path.join(__dirname, '../src/shared/config/constants/common.ts');

// Read the current file content
const content = fs.readFileSync(constantsPath, 'utf8');

// Replace all version-related constants
const updatedContent = content
  .replace(/export const APP_VERSION = ['"].*['"];/, `export const APP_VERSION = '${version}';`)
  .replace(/export const BUILD_NUMBER = .*?;/, `export const BUILD_NUMBER = '${buildNumber}';`)
  .replace(/export const GIT_COMMIT = .*?;/, `export const GIT_COMMIT = '${gitCommit}';`);

// Write back to file
fs.writeFileSync(constantsPath, updatedContent);

console.log(`Updated version info:
- APP_VERSION: ${version}
- BUILD_NUMBER: ${buildNumber}
- GIT_COMMIT: ${gitCommit}`);
