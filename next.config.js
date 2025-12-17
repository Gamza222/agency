/** @type {import('next').NextConfig} */
const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // SCSS configuration for modules and shared styles
  sassOptions: {
    includePaths: [path.join(__dirname, "src/shared/styles")],
    // Removed prependData completely - @use statements must be at file level
    // Each SCSS file handles its own @use imports for proper module isolation
  },
  outputFileTracingRoot: path.join(__dirname),
  // Custom webpack config (rarely needed)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Example: Add a custom webpack plugin if needed
    // config.plugins.push(new MyPlugin())

    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Convert all *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    return config;
  },

  // Image domains for next/image
  images: {
    domains: ["example.com"],
  },

  // Environment variables
  env: {
    customKey: "customValue",
  },

  // API routes configuration
  async rewrites() {
    return [
      // Example: Proxy API requests
      // {
      //   source: '/api/:path*',
      //   destination: 'https://api.example.com/:path*',
      // },
    ];
  },

  // Exclude test files from API routes
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  poweredByHeader: false,
  typescript: {
    // Report build-time type checking errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Report build-time eslint errors
    ignoreDuringBuilds: false,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
