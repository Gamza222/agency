# Enterprise Foundation Documentation

Comprehensive documentation for our Feature-Sliced Design (FSD) based enterprise foundation.

## 🏗️ Architecture Overview

Our foundation follows the **Feature-Sliced Design (FSD)** architecture with clear layer separation and unidirectional dependencies:

```
app/
├── shared/          # Reusable components and utilities
├── widgets/         # Complex UI blocks
└── infrastructure/  # Technical infrastructure
```

## 📚 Documentation Structure

### **🔧 Configuration** (`app/config/`)

Centralized configuration management for the entire application.

- [Environment](./app/config/environment/README.md) - Environment variable management
- [Version](./app/config/version/README.md) - Version management and build info
- [CI/CD](./app/config/ci-cd/README.md) - Continuous Integration and Deployment

### **🔧 Shared Layer** (`app/shared/`)

Reusable components and utilities across the entire application.

#### **UI Components** (`app/shared/ui/`)

- [Button](./app/shared/ui/Button/README.md) - Interactive button with variants
- [Text](./app/shared/ui/Text/README.md) - Semantic text with typography

#### **Utilities** (`app/shared/lib/`)

- [classNames](./app/shared/lib/classNames/README.md) - CSS class utility
- [cva](./app/shared/lib/cva/README.md) - Component Variant Architecture
- [Dev Tools](./app/shared/lib/dev-tools/README.md) - Developer tools and utilities

### **🧩 Widgets Layer** (`app/widgets/`)

Complex UI blocks composed of shared components.

- [PerformanceDashboard](./app/widgets/PerformanceDashboard/README.md) - Performance monitoring widget

### **🚀 Infrastructure Layer** (`app/infrastructure/`)

Technical infrastructure and cross-cutting concerns.

- [Performance](./app/infrastructure/performance/README.md) - Performance monitoring
- [Security](./app/infrastructure/security/README.md) - Authentication and authorization
- [Data](./app/infrastructure/data/README.md) - API clients and data layer
- [Dev Tools](./app/infrastructure/dev-tools/README.md) - Developer tools and utilities

## 🚀 Quick Start

### **1. Explore the Foundation**

Start with the [Architecture Overview](#-architecture-overview) to understand the FSD structure.

### **2. Browse Components**

- **Shared Components**: [Button](./app/shared/ui/Button/README.md), [Text](./app/shared/ui/Text/README.md)
- **Shared Utilities**: [classNames](./app/shared/lib/classNames/README.md), [cva](./app/shared/lib/cva/README.md), [Dev Tools](./app/shared/lib/dev-tools/README.md)
- **Widgets**: [PerformanceDashboard](./app/widgets/PerformanceDashboard/README.md)
- **Infrastructure**: [Performance](./app/infrastructure/performance/README.md), [Security](./app/infrastructure/security/README.md), [Data](./app/infrastructure/data/README.md), [Dev Tools](./app/infrastructure/dev-tools/README.md)

### **3. Learn Patterns**

Check out the component documentation for real-world usage examples.

### **4. Development**

- **Storybook**: `npm run storybook` - Interactive component playground
- **Tests**: `npm test` - Run component tests
- **Build**: `npm run build` - Build the application
- **Dev Tools**: `npm run dev` - Start development with debug tools
- **Component Generator**: `npm run generate:component` - Generate FSD components
- **FSD Validator**: `npm run validate:fsd` - Validate architecture compliance

## 🎯 Key Features

### **✅ Complete Infrastructure**

- **Performance Monitoring** - Web Vitals, custom metrics, real-time dashboard
- **Security** - Authentication, authorization, rate limiting
- **Data Layer** - Apollo GraphQL, Axios REST, React Query, WebSocket
- **State Management** - Zustand integration
- **Error Handling** - Comprehensive error boundaries and reporting
- **Testing** - Complete test coverage with mock factories
- **Developer Tools** - Debug panel, performance monitor, component generator, FSD validator

### **✅ Enterprise-Ready**

- **TypeScript** - Full type safety across all layers
- **Accessibility** - WCAG AA compliant components
- **Performance** - Optimized for production use
- **Scalability** - FSD architecture for large applications
- **Documentation** - Comprehensive guides and examples

### **✅ Developer Experience**

- **Storybook** - Interactive component development
- **Hot Reload** - Fast development iteration
- **IntelliSense** - Full TypeScript support
- **Testing** - Comprehensive test utilities and mock factories
- **Documentation** - Clear guides and examples
- **Developer Tools** - Real-time debugging and performance monitoring
- **Code Generation** - Automated FSD component creation
- **Architecture Validation** - Automated FSD compliance checking

## 📊 Foundation Statistics

### **Components**

- **Shared UI**: 2 components (Button, Text)
- **Shared Utilities**: 3 utilities (classNames, cva, Dev Tools)
- **Widgets**: 1 widget (PerformanceDashboard)
- **Infrastructure**: 4 services (Performance, Security, Data, Dev Tools)

### **Documentation**

- **Component Guides**: 8 comprehensive guides
- **API References**: 8 complete API references
- **Setup Guides**: 6 complete setup guides
- **Usage Examples**: 50+ real-world examples
- **Best Practices**: Complete development guidelines
- **Developer Tools**: Debug panel, performance monitor, generators

### **Testing**

- **Test Coverage**: 100% component coverage
- **Mock Factories**: 100+ mock utilities across all domains
- **Test Utilities**: Comprehensive testing helpers
- **Accessibility Tests**: Automated a11y validation
- **Developer Tools Tests**: 27 comprehensive dev-tools tests
- **Mock Factory**: Centralized mock management system

## 🛠️ Developer Tools

### **Debug Panel** (Development Mode Only)

Real-time debugging interface with performance metrics, error tracking, and state inspection.

```tsx
import { DebugPanel } from '@/shared/lib/dev-tools';

// Automatically appears in development mode
<DebugPanel />;
```

### **Performance Monitor** (Development Mode Only)

Live performance dashboard showing Web Vitals, memory usage, and render metrics.

```tsx
import { PerformanceMonitor } from '@/shared/lib/dev-tools';

// Position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
<PerformanceMonitor position="top-right" />;
```

### **Component Generator**

Automated FSD-compliant component generation with proper structure and boilerplate.

```bash
# Generate a new component
npm run generate:component Button shared ui "A button component"

# Examples:
npm run generate:component UserCard widgets ui "User card widget"
npm run generate:component AuthService infrastructure lib "Authentication service"
```

### **FSD Validator**

Architecture compliance checker ensuring FSD rules are followed.

```bash
# Validate FSD architecture
npm run validate:fsd

# Output: ✅ FSD Validation Passed - No violations found
```

## 🧪 Mock Factory

### **Centralized Testing Utilities**

Comprehensive mock factory system providing reusable testing utilities across all domains.

```tsx
import {
  createMockEventListener,
  createMockRenderCounter,
  createMockResponse,
  createMockStoreListener,
} from '@/shared/testing/mocks';

// Event testing
const { listener } = createMockEventListener();

// React testing
const { renderCount } = createMockRenderCounter();

// API testing
const mockResponse = createMockResponse({ status: 200 });

// State testing
const { listener: storeListener } = createMockStoreListener();
```

### **Available Mock Categories**

- **Browser Mocks** - Event listeners, React utilities, performance APIs
- **Infrastructure Mocks** - API responses, state management, store listeners
- **Node Mocks** - File system operations, process utilities
- **Entity Mocks** - Domain-specific mock data and services

### **Mock Factory Benefits**

- **Type Safety** - Full TypeScript support for all mocks
- **Consistency** - Standardized mock patterns across tests
- **Reusability** - Centralized utilities reduce duplication
- **Maintainability** - Single source of truth for mock logic

## 🔧 Development Workflow

### **1. Component Development**

```bash
# Start Storybook for component development
npm run storybook

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate new components
npm run generate:component ComponentName layer type "Description"

# Validate architecture
npm run validate:fsd
```

### **2. Documentation Updates**

- Update component documentation in `app/shared/ui/`
- Update widget documentation in `app/widgets/`
- Update infrastructure documentation in `app/infrastructure/`

### **3. Adding New Components**

1. Create component in appropriate layer
2. Add comprehensive documentation
3. Create Storybook stories
4. Add unit and accessibility tests
5. Update layer overview

## 📚 Learning Resources

### **FSD Architecture**

- [Feature-Sliced Design](https://feature-sliced.design/) - Official FSD documentation
- [FSD Architecture Guide](./app/infrastructure/README.md) - Our implementation

### **React Best Practices**

- [React Best Practices](./app/shared/ui/README.md) - Our React guidelines
- [Component Patterns](./app/shared/ui/Button/README.md) - Common patterns

### **Testing**

- [Testing Strategy](./app/shared/lib/README.md) - Our testing approach
- [Mock Factory](./src/shared/testing/mocks/README.md) - Comprehensive mock utilities
- [Dev Tools Testing](./app/shared/lib/dev-tools/README.md) - Testing utilities and patterns

## 🤝 Contributing

### **Documentation Standards**

- Follow FSD layer separation
- Include comprehensive examples
- Maintain consistent formatting
- Update related documentation

### **Code Standards**

- Follow SOLID principles
- Include TypeScript types
- Add comprehensive tests
- Maintain accessibility standards

## 📞 Support

### **Documentation Issues**

- Check existing documentation first
- Look for similar issues in patterns
- Follow FSD architecture principles

### **Development Issues**

- Check component documentation
- Review API references
- Look at usage examples
- Check test files for usage patterns

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Status**: ✅ Complete with Developer Tools & Mock Factory
