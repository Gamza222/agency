# 🚀 Deployment Guide

This guide covers how to deploy our enterprise FSD foundation to various platforms and environments.

## 🎯 Deployment Overview

Our deployment strategy supports multiple environments and platforms with automated CI/CD pipelines:

- **Development** - Local development environment
- **Preview** - Feature branch preview deployments (automated)
- **Production** - Live production environment (automated)
- **Staging** - Pre-production testing environment

### CI/CD Pipeline

Our deployment system includes a comprehensive CI/CD pipeline with:

- **Quality Gates**: Automated testing, linting, and type checking
- **Security Scanning**: Vulnerability scanning and security checks
- **Performance Testing**: Automated performance and load testing
- **Automated Deployment**: Preview and production deployments
- **Monitoring**: Real-time pipeline monitoring and notifications

For detailed CI/CD documentation, see [CI/CD Pipeline System](../config/ci-cd/README.md).

## 🛠️ Prerequisites

### Required Tools

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Docker** (for containerized deployment)
- **Git** (for version control)

### Platform Accounts

- **Vercel** (recommended for Next.js)
- **Netlify** (alternative platform)
- **AWS** (for enterprise deployments)
- **Docker Hub** (for container registry)

## 🚀 Platform-Specific Deployments

### Vercel Deployment

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Configure Vercel

```bash
# Login to Vercel
vercel login

# Link project to Vercel
vercel link
```

#### 3. Environment Variables

Our application uses a centralized environment configuration system. Set up environment variables in Vercel:

```bash
# Core application variables
vercel env add NODE_ENV production
vercel env add PORT production
vercel env add APP_NAME production
vercel env add APP_VERSION production

# API configuration
vercel env add API_URL production
vercel env add WS_URL production
vercel env add GRAPHQL_URL production

# Security
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production

# External services
vercel env add SENTRY_DSN production
vercel env add ANALYTICS_ID production

# Development flags
vercel env add DEBUG_ENABLED production
```

For detailed environment configuration, see [Environment Configuration System](../config/environment/README.md).

#### 4. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 5. Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "functions": {
    "src/pages/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NEXT_PUBLIC_APP_NAME": "@app-name",
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### Netlify Deployment

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Configure Netlify

```bash
# Login to Netlify
netlify login

# Initialize site
netlify init
```

#### 3. Build Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "src/pages/api"
```

#### 4. Deploy

```bash
# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Docker Deployment

#### 1. Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Create .dockerignore

```dockerfile
# .dockerignore
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.env
.env.local
.env.production.local
.env.development.local
.git
.gitignore
.next
.vercel
coverage
.nyc_output
```

#### 3. Build and Run

```bash
# Build Docker image
docker build -t frontend-foundation .

# Run container
docker run -p 3000:3000 frontend-foundation
```

#### 4. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=abstract_team
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres_data:
```

### AWS Deployment

#### 1. AWS Amplify

```bash
# Install AWS CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### 2. AWS Lambda (Serverless)

```typescript
// serverless.yml
service: frontend-foundation

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    NODE_ENV: production

functions:
  app:
    handler: src/pages/api/index.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true

plugins:
  - serverless-nextjs-plugin
```

## 🔧 Environment Configuration

### Environment Variables

#### Development

```bash
# .env.development
NEXT_PUBLIC_APP_NAME=Abstract Team (Dev)
NEXT_PUBLIC_APP_VERSION=2.0.0-dev
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/api/graphql
```

#### Staging

```bash
# .env.staging
NEXT_PUBLIC_APP_NAME=Abstract Team (Staging)
NEXT_PUBLIC_APP_VERSION=2.0.0-staging
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_API_URL=https://api-staging.frontend-foundation.com
NEXT_PUBLIC_GRAPHQL_URL=https://api-staging.frontend-foundation.com/graphql
```

#### Production

```bash
# .env.production
NEXT_PUBLIC_APP_NAME=Abstract Team
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://api.frontend-foundation.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.frontend-foundation.com/graphql
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Build Configuration

#### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run build

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '18'

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run test
    - npm run lint
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  only:
    - main
```

## 🔍 Monitoring and Analytics

### Performance Monitoring

```typescript
// src/infrastructure/monitoring/performance.ts
export const performanceConfig = {
  // Web Vitals
  webVitals: {
    enabled: process.env.NODE_ENV === 'production',
    sampleRate: 1.0,
  },
  // Bundle Analysis
  bundleAnalysis: {
    enabled: process.env.ANALYZE === 'true',
  },
  // Error Tracking
  errorTracking: {
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
};
```

### Health Checks

```typescript
// src/pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'ERROR';
    res.status(503).json(healthCheck);
  }
}
```

## 🛡️ Security Considerations

### Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Environment Security

```bash
# Never commit sensitive data
echo ".env.local" >> .gitignore
echo ".env.production.local" >> .gitignore
echo "*.pem" >> .gitignore
echo "*.key" >> .gitignore
```

## 📊 Performance Optimization

### Build Optimization

```javascript
// next.config.js
module.exports = {
  // Enable SWC minification
  swcMinify: true,

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Enable compression
  compress: true,

  // Optimize bundles
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/shared/ui'],
  },
};
```

### CDN Configuration

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## 🆘 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Check build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

#### Environment Variables

```bash
# Verify environment variables
vercel env ls

# Check in production
vercel env pull .env.production
```

#### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check Lighthouse scores
npm run lighthouse
```

### Debug Commands

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Check build output
vercel build
```

## 📚 Additional Resources

### Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)

### Best Practices

- [Web Performance](https://web.dev/performance/)
- [Security Headers](https://securityheaders.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated:** December 2024  
**Version:** 2.0.0  
**Status:** ✅ Complete
