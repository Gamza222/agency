/**
 * Lighthouse CI Configuration
 *
 * Configuration for Lighthouse CI performance testing with custom budgets
 * and thresholds for enterprise applications.
 */

interface LighthouseConfig {
  ci: {
    collect: {
      numberOfRuns: number;
      url: string[];
      settings: {
        emulatedFormFactor: string;
        throttling: {
          rttMs: number;
          throughputKbps: number;
          cpuSlowdownMultiplier: number;
        };
        screenEmulation: {
          mobile: boolean;
          width: number;
          height: number;
          deviceScaleFactor: number;
        };
      };
    };
    assert: {
      assertions: Record<string, unknown>;
    };
    upload: {
      target: string;
    };
  };
}

const lighthouseConfig: LighthouseConfig = {
  ci: {
    collect: {
      // Number of runs to perform
      numberOfRuns: 3,

      // URLs to test
      url: [
        'http://localhost:3000',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/profile',
      ],

      // Settings for data collection
      settings: {
        // Use mobile emulation
        emulatedFormFactor: 'mobile',

        // Throttling settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },

        // Screen emulation
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
        },
      },
    },

    assert: {
      // Performance budget
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Specific performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],

        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100KB
        'resource-summary:image:size': ['error', { maxNumericValue: 1000000 }], // 1MB
        'resource-summary:font:size': ['error', { maxNumericValue: 200000 }], // 200KB

        // Network requests
        'resource-summary:total:count': ['error', { maxNumericValue: 50 }],

        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        label: 'error',
        'link-name': 'error',
        'button-name': 'error',

        // Best practices
        'uses-https': 'error',
        'is-on-https': 'error',
        'no-vulnerable-libraries': 'error',
        'no-mixed-content': 'error',

        // SEO
        'meta-description': 'error',
        'document-title': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
      },
    },

    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
  },
};

export default lighthouseConfig;
