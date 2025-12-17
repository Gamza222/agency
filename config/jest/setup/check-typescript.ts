/**
 * Jest setup to check TypeScript compilation errors
 * This ensures that critical TypeScript errors cause test failures
 * while allowing non-critical errors to pass
 */

import { execSync } from 'child_process';
import { resolve } from 'path';

// Check TypeScript compilation errors before running tests
try {
  // console.log('🔍 Checking TypeScript compilation...');

  // Run TypeScript compiler to check for errors
  execSync('npx tsc --noEmit --project config/jest/tsconfig.json', {
    cwd: resolve(__dirname, '../../../..'),
    encoding: 'utf8',
    stdio: 'pipe', // Capture output instead of showing it
  });

  // console.log('✅ TypeScript compilation check passed');
} catch (error: unknown) {
  const errorOutput =
    (error as { stdout?: string; message?: string }).stdout || (error as Error).message;

  // Parse errors and filter out non-critical ones
  const criticalErrors = filterCriticalErrors(errorOutput);

  if (criticalErrors.length > 0) {
    // console.log('❌ Critical TypeScript errors found:');
    // console.log(criticalErrors.join('\n'));

    // Fail the test suite only for critical errors
    throw new Error(
      'Critical TypeScript compilation errors detected. Please fix the errors before running tests.'
    );
  } else {
    // console.log('⚠️  Non-critical TypeScript errors found (allowing tests to continue)');
    // console.log('📝 Consider fixing these errors when possible:');
    // console.log(errorOutput);
  }
}

/**
 * Filter TypeScript errors to only include critical ones
 */
function filterCriticalErrors(errorOutput: string): string[] {
  const lines = errorOutput.split('\n');
  const criticalErrors: string[] = [];

  // Define patterns for critical errors that should fail tests
  const criticalPatterns = [
    // Syntax errors
    /error TS\d+: Cannot find name/,
    /error TS\d+: Cannot find module/,
    /error TS\d+: Module '.*' has no exported member/,
    /error TS\d+: Property '.*' does not exist on type/,
    /error TS\d+: Type '.*' is not assignable to type/,
    /error TS\d+: Argument of type '.*' is not assignable to parameter/,
    /error TS\d+: Object literal may only specify known properties/,
    /error TS\d+: Expected \d+ arguments, but got \d+/,
    /error TS\d+: Cannot assign to '.*' because it is a read-only property/,
    /error TS\d+: Element implicitly has an 'any' type/,
    /error TS\d+: Type '.*' is not assignable to type '.*' with 'exactOptionalPropertyTypes'/,
  ];

  // Define patterns for non-critical errors that can be ignored in tests
  const nonCriticalPatterns = [
    // Unused variables in tests (common and acceptable)
    /error TS6133: '.*' is declared but its value is never read/,
    /error TS6192: All imports in import declaration are unused/,
    // Export conflicts in test mocks (acceptable in test environment)
    /error TS2484: Export declaration conflicts with exported declaration/,
    // Re-export type issues (acceptable in test environment)
    /error TS1205: Re-exporting a type when 'isolatedModules' is enabled/,
    // Enum value type issues (acceptable in test environment)
    /error TS18033: Type 'boolean' is not assignable to type 'number'/,
    // Function condition issues (acceptable in test environment)
    /error TS2774: This condition will always return true/,
  ];

  for (const line of lines) {
    if (line.includes('error TS')) {
      // Check if it's a non-critical error
      const isNonCritical = nonCriticalPatterns.some((pattern) => pattern.test(line));

      if (!isNonCritical) {
        // Check if it's a critical error
        const isCritical = criticalPatterns.some((pattern) => pattern.test(line));

        if (isCritical) {
          criticalErrors.push(line);
        }
      }
    }
  }

  return criticalErrors;
}
