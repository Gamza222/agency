#!/usr/bin/env node

/**
 * Local CI Validation Script
 *
 * Runs all the same checks that GitHub Actions would run locally
 * to ensure CI/CD will pass before committing.
 */

/* eslint-disable no-console */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

interface ValidationSuite {
  name: string;
  results: ValidationResult[];
  passed: boolean;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Run a command and return the result
 */
function runCommand(command: string, description: string): ValidationResult {
  const startTime = Date.now();

  try {
    console.log(`🔍 ${description}...`);
    execSync(command, {
      stdio: 'pipe',
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    const duration = Date.now() - startTime;
    console.log(`✅ ${description} passed (${duration}ms)`);

    return {
      name: description,
      passed: true,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.log(`❌ ${description} failed (${duration}ms)`);
    console.log(`   Error: ${errorMessage}`);

    return {
      name: description,
      passed: false,
      error: errorMessage,
      duration,
    };
  }
}

/**
 * Check if required files exist
 */
function checkRequiredFiles(): ValidationResult {
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'next.config.js',
    'config/ci/ci.config.ts',
    'config/env/index.ts',
    'config/version/index.ts',
  ];

  const missingFiles = requiredFiles.filter((file) => !existsSync(file));

  if (missingFiles.length > 0) {
    return {
      name: 'Required files check',
      passed: false,
      error: `Missing files: ${missingFiles.join(', ')}`,
    };
  }

  return {
    name: 'Required files check',
    passed: true,
  };
}

/**
 * Validate environment configuration
 */
function validateEnvironment(): ValidationResult {
  try {
    console.log('🔍 Validating environment configuration...');
    execSync('npx ts-node --project tsconfig.scripts.json scripts/version.ts validate', {
      stdio: 'pipe',
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    console.log('✅ Environment configuration valid');
    return {
      name: 'Environment validation',
      passed: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('❌ Environment validation failed');
    console.log(`   Error: ${errorMessage}`);

    return {
      name: 'Environment validation',
      passed: false,
      error: errorMessage,
    };
  }
}

/**
 * Check coverage threshold using Jest's lcov.info
 */
function checkCoverageThreshold(): ValidationResult {
  try {
    console.log('🔍 Checking coverage threshold...');

    const lcovPath = join(process.cwd(), 'coverage', 'lcov.info');
    if (!existsSync(lcovPath)) {
      return {
        name: 'Coverage threshold check',
        passed: false,
        error: 'Coverage file not found. Run tests first.',
      };
    }

    const lcov = readFileSync(lcovPath, 'utf8');
    const lines = lcov.split('\n');

    // Calculate total coverage from all file entries
    let totalLines = 0;
    let coveredLines = 0;

    for (const line of lines) {
      if (line.startsWith('LF:')) {
        // LF: total lines in file
        const match = line.match(/LF:(\d+)/);
        if (match && match[1]) {
          totalLines += parseInt(match[1], 10);
        }
      } else if (line.startsWith('LH:')) {
        // LH: hit lines in file
        const match = line.match(/LH:(\d+)/);
        if (match && match[1]) {
          coveredLines += parseInt(match[1], 10);
        }
      }
    }

    if (totalLines === 0) {
      return {
        name: 'Coverage threshold check',
        passed: false,
        error: 'No coverage data found',
      };
    }

    const percentage = ((coveredLines / totalLines) * 100).toFixed(2);

    // Get threshold from CI config
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCiConfig } = require('../config/ci/ci.config') as {
      getCiConfig: (env: string) => { test: { coverageThreshold: number } };
    };
    const config = getCiConfig(process.env.NODE_ENV || 'development');
    const threshold = config.test.coverageThreshold;

    console.log(`Coverage: ${percentage}% (${coveredLines}/${totalLines} lines)`);
    console.log(`Threshold: ${threshold}%`);

    if (parseFloat(percentage) < threshold) {
      return {
        name: 'Coverage threshold check',
        passed: false,
        error: `Coverage ${percentage}% is below threshold ${threshold}%`,
      };
    }

    console.log('✅ Coverage threshold met');
    return {
      name: 'Coverage threshold check',
      passed: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('❌ Coverage threshold check failed');
    console.log(`   Error: ${errorMessage}`);

    return {
      name: 'Coverage threshold check',
      passed: false,
      error: errorMessage,
    };
  }
}

// ============================================================================
// VALIDATION SUITES
// ============================================================================

/**
 * Code Quality Suite
 */
function runCodeQualitySuite(): ValidationSuite {
  console.log('\n📋 Running Code Quality Suite...');
  console.log('='.repeat(50));

  const results: ValidationResult[] = [
    checkRequiredFiles(),
    runCommand('npm run type-check', 'TypeScript type checking'),
    runCommand('npm run lint', 'ESLint code linting'),
    runCommand('npm run format:check', 'Prettier format checking'),
    runCommand('npm run test:ci', 'Jest unit tests with coverage'),
    checkCoverageThreshold(), // Add coverage threshold check
    validateEnvironment(),
  ];

  const passed = results.every((result) => result.passed);

  return {
    name: 'Code Quality Suite',
    results,
    passed,
  };
}

/**
 * Security Suite
 */
function runSecuritySuite(): ValidationSuite {
  console.log('\n🔒 Running Security Suite...');
  console.log('='.repeat(50));

  const results: ValidationResult[] = [
    runCommand('npm audit --audit-level=moderate', 'npm audit security scan'),
    // Add Snyk check if token is available
    (() => {
      if (process.env.SNYK_TOKEN) {
        return runCommand('npx snyk test --severity-threshold=high', 'Snyk security scan');
      } else {
        console.log('⚠️ Snyk scan skipped - no SNYK_TOKEN provided');
        return {
          name: 'Snyk security scan',
          passed: true,
        };
      }
    })(),
  ];

  const passed = results.every((result) => result.passed);

  return {
    name: 'Security Suite',
    results,
    passed,
  };
}

/**
 * Performance Suite
 */
function runPerformanceSuite(): ValidationSuite {
  console.log('\n⚡ Running Performance Suite...');
  console.log('='.repeat(50));

  const results: ValidationResult[] = [
    runCommand('npm run build', 'Production build'),
    runCommand('npm run analyze', 'Bundle size analysis'),
  ];

  const passed = results.every((result) => result.passed);

  return {
    name: 'Performance Suite',
    results,
    passed,
  };
}

/**
 * Build Suite
 */
function runBuildSuite(): ValidationSuite {
  console.log('\n🏗️  Running Build Suite...');
  console.log('='.repeat(50));

  const results: ValidationResult[] = [
    runCommand('npm run build:info', 'Build info generation'),
    runCommand('npm run build', 'Production build'),
    // Check if build artifacts exist
    (() => {
      const buildDir = join(process.cwd(), '.next');
      const buildInfoFile = join(process.cwd(), 'build-info.json');

      if (!existsSync(buildDir)) {
        return {
          name: 'Build artifacts check',
          passed: false,
          error: 'Build directory .next not found',
        };
      }

      if (!existsSync(buildInfoFile)) {
        return {
          name: 'Build artifacts check',
          passed: false,
          error: 'build-info.json not found',
        };
      }

      return {
        name: 'Build artifacts check',
        passed: true,
      };
    })(),
  ];

  const passed = results.every((result) => result.passed);

  return {
    name: 'Build Suite',
    results,
    passed,
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Run all validation suites
 */
function runAllValidations(): void {
  console.log('🚀 Starting Local CI Validation');
  console.log('This will run all the same checks as GitHub Actions');
  console.log('='.repeat(60));

  const startTime = Date.now();

  const suites: ValidationSuite[] = [
    runCodeQualitySuite(),
    runSecuritySuite(),
    runPerformanceSuite(),
    runBuildSuite(),
  ];

  const totalDuration = Date.now() - startTime;

  // ============================================================================
  // RESULTS SUMMARY
  // ============================================================================

  console.log('\n📊 Validation Results Summary');
  console.log('='.repeat(60));

  let totalPassed = 0;
  let totalFailed = 0;

  suites.forEach((suite) => {
    const passed = suite.results.filter((r) => r.passed).length;
    const failed = suite.results.filter((r) => !r.passed).length;

    totalPassed += passed;
    totalFailed += failed;

    const status = suite.passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`\n${suite.name}: ${status}`);
    console.log(`  Passed: ${passed}, Failed: ${failed}`);

    if (!suite.passed) {
      suite.results
        .filter((r) => !r.passed)
        .forEach((result) => {
          console.log(`  ❌ ${result.name}: ${result.error}`);
        });
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${totalPassed} passed, ${totalFailed} failed`);
  console.log(`Duration: ${totalDuration}ms`);

  const allPassed = suites.every((suite) => suite.passed);

  if (allPassed) {
    console.log('\n🎉 All validations passed!');
    console.log('✅ Your code is ready for GitHub Actions');
    console.log('🚀 Safe to commit and push');
    process.exit(0);
  } else {
    console.log('\n❌ Some validations failed!');
    console.log('🔧 Please fix the issues above before committing');
    console.log('💡 Run individual commands to debug specific issues');
    process.exit(1);
  }
}

/**
 * Run specific validation suite
 */
function runSpecificSuite(suiteName: string): void {
  const suites: Record<string, () => ValidationSuite> = {
    quality: runCodeQualitySuite,
    security: runSecuritySuite,
    performance: runPerformanceSuite,
    build: runBuildSuite,
  };

  const suiteFunction = suites[suiteName];

  if (!suiteFunction) {
    console.error(`❌ Unknown suite: ${suiteName}`);
    console.error(`Available suites: ${Object.keys(suites).join(', ')}`);
    process.exit(1);
  }

  const suite = suiteFunction();
  const allPassed = suite.passed;

  console.log(`\n${suite.name}: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);

  if (!allPassed) {
    suite.results
      .filter((r) => !r.passed)
      .forEach((result) => {
        console.log(`❌ ${result.name}: ${result.error}`);
      });
    process.exit(1);
  }

  process.exit(0);
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === '--help' || command === '-h') {
    console.log(`
Local CI Validation Script

Usage:
  npm run validate:ci              # Run all validation suites
  npm run validate:ci quality      # Run only code quality suite
  npm run validate:ci security     # Run only security suite
  npm run validate:ci performance  # Run only performance suite
  npm run validate:ci build        # Run only build suite
  npm run validate:ci --help       # Show this help

This script runs the same checks as GitHub Actions locally to ensure
your code will pass CI/CD before committing.
    `);
    process.exit(0);
  }

  if (command) {
    runSpecificSuite(command);
  } else {
    runAllValidations();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { runAllValidations, runSpecificSuite };
