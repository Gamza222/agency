# CI/CD Workflows

This directory contains all GitHub Actions workflows organized by purpose and responsibility.

## 📁 **Directory Structure**

```
.github/workflows/
├── ci.yml                           # Main CI orchestrator
├── quality/
│   └── code-quality.yml            # Code quality & testing
├── security/
│   └── security-scan.yml           # Security scanning
├── performance/
│   └── performance-test.yml        # Performance testing
├── deployment/
│   ├── deploy-preview.yml          # Preview deployments
│   └── deploy-production.yml       # Production deployments
├── monitoring/
│   └── health-monitoring.yml       # Health monitoring
└── README.md                       # This file
```

## 🔄 **Workflow Overview**

### **Main CI Pipeline** (`ci.yml`)

- **Purpose**: Orchestrates the entire CI process
- **Triggers**: Push to main/develop, PRs
- **Responsibilities**:
  - Coordinates all quality checks
  - Manages workflow dependencies
  - Provides overall CI status

### **Quality Workflows** (`quality/`)

- **code-quality.yml**: Code quality, testing, and coverage
- **Triggers**: Push to any branch, PRs
- **Responsibilities**:
  - TypeScript compilation
  - Linting and formatting
  - Unit testing with coverage
  - Quality gates enforcement

### **Security Workflows** (`security/`)

- **security-scan.yml**: Security scanning and compliance
- **Triggers**: Push to main/develop, PRs, weekly schedule
- **Responsibilities**:
  - Dependency vulnerability scanning
  - Code security analysis
  - Secrets detection
  - Security compliance checks

### **Performance Workflows** (`performance/`)

- **performance-test.yml**: Performance testing and analysis
- **Triggers**: Push to main/develop, PRs
- **Responsibilities**:
  - Lighthouse performance testing
  - Bundle size analysis
  - Performance regression detection
  - Performance budget enforcement

### **Deployment Workflows** (`deployment/`)

- **deploy-preview.yml**: Preview environment deployments
- **deploy-production.yml**: Production environment deployments
- **Triggers**: PRs (preview), push to main (production)
- **Responsibilities**:
  - Environment-specific deployments
  - Build artifact generation
  - Deployment health checks
  - Rollback capabilities

### **Monitoring Workflows** (`monitoring/`)

- **health-monitoring.yml**: System health monitoring
- **Triggers**: Every 5 minutes, manual dispatch
- **Responsibilities**:
  - Application health checks
  - Performance monitoring
  - Alert generation
  - System status reporting

## 🎯 **Quality Gates**

All workflows implement strict quality gates that must pass before deployment:

### **Code Quality Gates**

- ✅ TypeScript compilation must pass
- ✅ Linting must pass with zero errors
- ✅ Code formatting must be consistent
- ✅ Test coverage must meet threshold (92%)
- ✅ All tests must pass

### **Security Gates**

- ✅ No high/critical vulnerabilities in dependencies
- ✅ No security issues in code scan
- ✅ No secrets detected in codebase
- ✅ Security compliance requirements met

### **Performance Gates**

- ✅ Lighthouse score must meet threshold (90+)
- ✅ Bundle size must be within limits
- ✅ Performance regression tests must pass
- ✅ Core Web Vitals must be in green

## 🚀 **Deployment Strategy**

### **Preview Deployments**

- Triggered on PR creation/updates
- Deployed to Vercel preview environment
- Includes PR comments with preview URL
- Full quality gates must pass

### **Production Deployments**

- Triggered on push to main branch
- Deployed to Vercel production environment
- Includes health checks and monitoring
- Automatic rollback on failure

## 📊 **Monitoring & Alerting**

### **Health Monitoring**

- Continuous health checks every 5 minutes
- Performance metrics monitoring
- Automatic alerting on failures
- System status reporting

### **Deployment Monitoring**

- Deployment success/failure tracking
- Performance impact monitoring
- User experience monitoring
- Error rate tracking

## 🔧 **Configuration**

All workflows use centralized configuration from:

- `config/ci/ci.config.ts` - CI configuration
- `config/env/` - Environment configuration
- `config/version/` - Version management

## 📝 **Usage**

### **Running Workflows Manually**

```bash
# Run specific workflow
gh workflow run "Code Quality & Testing"

# Run with specific inputs
gh workflow run "Deploy Production Environment" -f environment=staging
```

### **Checking Workflow Status**

```bash
# List all workflows
gh workflow list

# View workflow runs
gh run list

# View specific run
gh run view <run-id>
```

## 🎯 **Best Practices**

1. **Semantic Naming**: All workflows have clear, descriptive names
2. **Single Responsibility**: Each workflow has one clear purpose
3. **Quality Gates**: Strict enforcement of quality standards
4. **Monitoring**: Comprehensive monitoring and alerting
5. **Documentation**: Clear documentation and usage instructions
6. **Maintainability**: Easy to understand and modify workflows

## 🚨 **Troubleshooting**

### **Common Issues**

- **Workflow failures**: Check the specific job logs
- **Quality gate failures**: Fix the underlying issues (tests, linting, etc.)
- **Deployment failures**: Check environment variables and secrets
- **Performance failures**: Review bundle size and performance metrics

### **Getting Help**

- Check workflow logs in GitHub Actions
- Review configuration files in `config/` directory
- Consult this README for workflow details
- Check individual workflow files for specific configurations
