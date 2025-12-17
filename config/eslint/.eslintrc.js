module.exports = {
  root: true, // Stop ESLint from looking for config files in parent directories
  ignorePatterns: [
    'src/shared/testing/transformers/**/*.js', // Ignore JS transformer files
    'structure/**/*', // Ignore structure directory
  ],
  env: {
    browser: true, // Enable browser globals like window and document
    es2022: true, // Enable all ECMAScript 2022 globals and features
    node: true, // Enable Node.js globals and Node.js scoping
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser', // Tell ESLint to use TypeScript parser
  parserOptions: {
    ecmaVersion: 'latest', // Use latest ECMAScript features
    sourceType: 'module', // Treat files as ES modules
    project: ['./tsconfig.json'], // Path to your TypeScript configuration
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect', // Automatically detect React version from package.json
    },
  },
  rules: {
    // TypeScript Specific Rules
    '@typescript-eslint/explicit-function-return-type': 'off', // Don't require explicit return types on functions
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Don't require explicit return types on exported functions
    '@typescript-eslint/no-explicit-any': 'warn', // Warn when using the 'any' type
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        // Configure unused variable warnings
        argsIgnorePattern: '^_', // Ignore parameters starting with underscore
        varsIgnorePattern: '^_', // Ignore variables starting with underscore
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error', // Forces handling promises with await or .then()
    '@typescript-eslint/no-misused-promises': 'error', // Prevents common promise mistakes (like using promises in useEffect deps)
    '@typescript-eslint/await-thenable': 'error', // Ensures await is only used with promises
    '@typescript-eslint/no-unnecessary-type-assertion': 'error', // Prevents redundant type casts
    '@typescript-eslint/triple-slash-reference': 'off', // Disable triple slash reference rule

    // React Specific Rules
    'react/prop-types': 'off', // Disable prop-types as we use TypeScript
    'react/display-name': 'off', // Don't require display names for components
    'react/jsx-key': [
      'error',
      {
        // Enforce array keys
        checkFragmentShorthand: true, // Require keys on fragments
        checkKeyMustBeforeSpread: true, // Key prop must come before spreads
      },
    ],
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }], // No duplicate props in JSX
    'react/jsx-uses-react': 'off', // Not needed with React 17+ (new JSX transform)
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+ (new JSX transform)

    // React Hooks Rules
    'react-hooks/rules-of-hooks': 'error', // Enforce React Hooks rules
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        // Check effect dependencies
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)', // Add support for Recoil hooks
        enableDangerousAutofixThisMayCauseInfiniteLoops: false, // Prevent dangerous auto-fixes
      },
    ],

    // General JavaScript Rules
    'no-console': 'off', // Only allow console.warn and console.error
    eqeqeq: ['error', 'always'], // Require === and !==
    'no-duplicate-imports': 'error', // No multiple import statements from same module
    'no-unused-expressions': 'error', // No unused expressions like foo;
    'no-shadow': 'off', // Disable base shadow rule
    '@typescript-eslint/no-shadow': ['error'], // Use TypeScript-aware shadow rule
    'prefer-const': 'error', // Use const if variable is never reassigned
    'no-var': 'error', // Use let/const instead of var
    'object-shorthand': ['error', 'always'], // Use { foo } instead of { foo: foo }

    // Import Organization
    'sort-imports': 'off', // Disabled - let developers organize imports as they prefer
  },
  // Special Rules for Test Files and JS Files
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'], // Apply to test files only
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in tests
        '@typescript-eslint/no-unsafe-member-access': 'off', // Allow unsafe member access in tests
        '@typescript-eslint/no-unsafe-call': 'off', // Allow unsafe calls in tests
        '@typescript-eslint/no-unsafe-assignment': 'off', // Allow unsafe assignment in tests
        '@typescript-eslint/no-unsafe-return': 'off', // Allow unsafe returns in tests
        '@typescript-eslint/no-unsafe-argument': 'off', // Allow unsafe arguments in tests
        'react-hooks/rules-of-hooks': 'off', // Allow breaking hooks rules in tests
      },
    },
    {
      files: ['**/*.js'], // Apply to JavaScript files
      parser: 'espree', // Use default JS parser instead of TypeScript parser
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Don't use TypeScript project for JS files
      },
      extends: ['eslint:recommended'], // Use only basic JS rules
      rules: {
        // Disable ALL TypeScript-specific rules for JS files
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-base-to-string': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // Re-enable basic JS rules
        'no-shadow': 'error',
        'no-unused-vars': 'warn',
      },
    },
  ],
};
