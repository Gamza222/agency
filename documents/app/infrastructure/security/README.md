# Security Infrastructure

Comprehensive security infrastructure with authentication, authorization, rate limiting, and security monitoring.

## 🎯 Overview

The security infrastructure provides enterprise-grade security features including user authentication, role-based access control, rate limiting, and security monitoring.

### **Key Features**

- ✅ **Authentication** - User login/logout with JWT tokens
- ✅ **Authorization** - Role-based access control (RBAC)
- ✅ **Rate Limiting** - API rate limiting and abuse prevention
- ✅ **Security Headers** - CSP, HSTS, XSS protection
- ✅ **Security Monitoring** - Security event tracking
- ✅ **Production Ready** - Enterprise-grade security

## 🚀 Quick Start

```tsx
import { AuthProvider, useAuth } from '@/infrastructure/security';
import { SecurityProvider } from '@/infrastructure/security';

// Wrap your app with security providers
function App() {
  return (
    <SecurityProvider>
      <AuthProvider>
        <YourApp />
      </AuthProvider>
    </SecurityProvider>
  );
}

// Use authentication in components
function LoginButton() {
  const { user, login, logout } = useAuth();

  if (user) {
    return <button onClick={logout}>Logout {user.name}</button>;
  }

  return <button onClick={() => login('user', 'pass')}>Login</button>;
}
```

## 📋 API Reference

### **Authentication Hooks**

#### `useAuth()`

```tsx
const { user, login, logout, loading, error } = useAuth();
```

**Returns:**

- `user`: Current user object or null
- `login`: Function to authenticate user
- `logout`: Function to log out user
- `loading`: Boolean indicating if auth is loading
- `error`: Error object if authentication failed

#### `useAuthGuard()`

```tsx
const { isAuthenticated, hasRole, hasPermission } = useAuthGuard();
```

**Returns:**

- `isAuthenticated`: Boolean indicating if user is authenticated
- `hasRole`: Function to check if user has specific role
- `hasPermission`: Function to check if user has specific permission

### **Authorization Hooks**

#### `useAuthorization()`

```tsx
const { canAccess, canPerform, roles, permissions } = useAuthorization();
```

**Returns:**

- `canAccess`: Function to check resource access
- `canPerform`: Function to check action permission
- `roles`: Array of user roles
- `permissions`: Array of user permissions

### **Rate Limiting Hooks**

#### `useRateLimit()`

```tsx
const { isLimited, remaining, resetTime } = useRateLimit('api-calls');
```

**Returns:**

- `isLimited`: Boolean indicating if rate limit is exceeded
- `remaining`: Number of remaining requests
- `resetTime`: Time when rate limit resets

## 🎨 Usage Examples

### **Authentication Flow**

```tsx
import { AuthProvider, useAuth } from '@/infrastructure/security';

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <YourApp />
      </AuthGuard>
    </AuthProvider>
  );
}

function AuthGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginPage />;

  return <>{children}</>;
}

function LoginPage() {
  const { login, error } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials.username, credentials.password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
      />
      <button type="submit">Login</button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### **Role-based Access Control**

```tsx
import { useAuthGuard, useAuthorization } from '@/infrastructure/security';

function AdminPanel() {
  const { hasRole } = useAuthGuard();
  const { canAccess } = useAuthorization();

  if (!hasRole('admin')) {
    return <div>Access denied. Admin role required.</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {canAccess('users') && <UsersManagement />}
      {canAccess('settings') && <SettingsPanel />}
    </div>
  );
}

function UsersManagement() {
  const { canPerform } = useAuthorization();

  return (
    <div>
      <h2>Users Management</h2>
      {canPerform('users', 'create') && <CreateUserButton />}
      {canPerform('users', 'read') && <UsersList />}
      {canPerform('users', 'update') && <EditUserButton />}
      {canPerform('users', 'delete') && <DeleteUserButton />}
    </div>
  );
}
```

### **Rate Limiting**

```tsx
import { useRateLimit } from '@/infrastructure/security';

function ApiButton() {
  const { isLimited, remaining, resetTime } = useRateLimit('api-calls');
  const [data, setData] = useState(null);

  const handleClick = async () => {
    if (isLimited) {
      alert(`Rate limit exceeded. Try again in ${resetTime} seconds.`);
      return;
    }

    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLimited}>
        {isLimited ? 'Rate Limited' : 'Call API'}
      </button>
      {!isLimited && <div>Remaining: {remaining} calls</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
}
```

### **Security Headers**

```tsx
import { SecurityProvider } from '@/infrastructure/security';

function App() {
  return (
    <SecurityProvider
      config={{
        csp: {
          'default-src': "'self'",
          'script-src': "'self' 'unsafe-inline'",
          'style-src': "'self' 'unsafe-inline'",
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
        },
        xssProtection: true,
        contentTypeOptions: true,
      }}
    >
      <YourApp />
    </SecurityProvider>
  );
}
```

## 🎯 Security Features

### **Authentication**

| Feature                | Description                       | Implementation         |
| ---------------------- | --------------------------------- | ---------------------- |
| **JWT Tokens**         | Secure token-based authentication | JWT with RS256 signing |
| **Session Management** | Secure session handling           | HttpOnly cookies       |
| **Password Hashing**   | Secure password storage           | bcrypt with salt       |
| **Multi-factor Auth**  | Additional security layer         | TOTP support           |

### **Authorization**

| Feature            | Description                   | Implementation              |
| ------------------ | ----------------------------- | --------------------------- |
| **RBAC**           | Role-based access control     | Hierarchical role system    |
| **Permissions**    | Fine-grained permissions      | Resource-action permissions |
| **Access Control** | Resource-level access control | Dynamic access checking     |
| **Audit Logging**  | Security event logging        | Comprehensive audit trail   |

### **Rate Limiting**

| Feature                 | Description              | Implementation            |
| ----------------------- | ------------------------ | ------------------------- |
| **API Rate Limiting**   | Request rate limiting    | Token bucket algorithm    |
| **IP-based Limiting**   | IP address rate limiting | Per-IP request tracking   |
| **User-based Limiting** | Per-user rate limiting   | Authenticated user limits |
| **Dynamic Limits**      | Adaptive rate limiting   | Load-based adjustments    |

### **Security Headers**

| Header                     | Description                    | Value                     |
| -------------------------- | ------------------------------ | ------------------------- |
| **CSP**                    | Content Security Policy        | Restrict resource loading |
| **HSTS**                   | HTTP Strict Transport Security | Force HTTPS               |
| **X-Frame-Options**        | Clickjacking protection        | DENY/SAMEORIGIN           |
| **X-Content-Type-Options** | MIME type sniffing protection  | nosniff                   |
| **X-XSS-Protection**       | XSS protection                 | 1; mode=block             |

## 🧪 Testing

### **Unit Tests**

```tsx
import { renderHook } from '@testing-library/react';
import { useAuth } from '@/infrastructure/security';

test('useAuth hook', () => {
  const { result } = renderHook(() => useAuth());

  expect(result.current.user).toBeNull();
  expect(result.current.loading).toBe(false);
});
```

### **Integration Tests**

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/infrastructure/security';

test('authentication flow', async () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );

  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpass' } });
  fireEvent.click(screen.getByText('Login'));

  await waitFor(() => {
    expect(screen.getByText('Welcome, testuser')).toBeInTheDocument();
  });
});
```

## 🔧 Configuration

### **Environment Variables**

```bash
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security Headers
CSP_POLICY=default-src 'self'
HSTS_MAX_AGE=31536000
```

### **Security Provider Configuration**

```tsx
import { SecurityProvider } from '@/infrastructure/security';

function App() {
  return (
    <SecurityProvider
      config={{
        jwt: {
          secret: process.env.JWT_SECRET,
          expiresIn: '24h',
        },
        rateLimit: {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // limit each IP to 100 requests per windowMs
        },
        headers: {
          csp: {
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline'",
          },
          hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
          },
        },
      }}
    >
      <YourApp />
    </SecurityProvider>
  );
}
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't store sensitive data in localStorage
localStorage.setItem('token', jwtToken); // Not secure

// Don't forget to validate permissions
function AdminPanel() {
  return <div>Admin Panel</div>; // No permission check
}

// Don't ignore rate limiting
function ApiCall() {
  const response = await fetch('/api/data'); // No rate limit check
  return response.json();
}
```

### **✅ Do**

```tsx
// Use secure token storage
const { login } = useAuth();
await login(username, password); // Handles secure storage

// Always check permissions
function AdminPanel() {
  const { hasRole } = useAuthGuard();

  if (!hasRole('admin')) {
    return <div>Access denied</div>;
  }

  return <div>Admin Panel</div>;
}

// Implement rate limiting
function ApiCall() {
  const { isLimited } = useRateLimit('api-calls');

  if (isLimited) {
    throw new Error('Rate limit exceeded');
  }

  const response = await fetch('/api/data');
  return response.json();
}
```

## 🔄 Migration Guide

### **From Custom Auth**

```tsx
// Before
const { user, login } = useCustomAuth();

// After
const { user, login } = useAuth();
```

### **From Third-party Auth**

```tsx
// Before
import { useAuth0 } from '@auth0/auth0-react';

// After
import { useAuth } from '@/infrastructure/security';
```

## 📚 Related Components

- [Auth Service](./lib/auth/README.md) - Authentication service
- [Authorization Service](./lib/authorization/README.md) - Authorization service
- [Rate Limiter](./lib/rate-limiter/README.md) - Rate limiting service
- [Security Headers](./lib/security-headers/README.md) - Security headers service

---

**Last Updated**: December 2024  
**Version**: 1.0.0
