# Data Infrastructure

Comprehensive data layer with GraphQL, REST, and WebSocket clients for seamless API integration.

## 🎯 Overview

The data infrastructure provides a complete data layer with multiple API clients, caching, error handling, and real-time capabilities.

### **Key Features**

- ✅ **Apollo GraphQL** - GraphQL client with caching
- ✅ **Axios REST** - REST API client with interceptors
- ✅ **React Query** - Server state management
- ✅ **WebSocket** - Real-time data streaming
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Caching** - Intelligent data caching

## 🚀 Quick Start

```tsx
import { ApolloProvider } from '@/infrastructure/data';
import { QueryClient, QueryClientProvider } from '@/infrastructure/data';
import { useQuery, useMutation } from '@/infrastructure/data';

// Wrap your app with data providers
function App() {
  return (
    <ApolloProvider>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </ApolloProvider>
  );
}

// Use GraphQL queries
function UsersList() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Use REST API
function UserProfile({ userId }) {
  const { data, loading, error } = useQuery(['user', userId], () =>
    fetch(`/api/users/${userId}`).then((res) => res.json())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}
```

## 📋 API Reference

### **GraphQL Hooks**

#### `useQuery(query, options)`

```tsx
const { data, loading, error, refetch } = useQuery(GET_USERS, {
  variables: { limit: 10 },
  fetchPolicy: 'cache-first',
});
```

#### `useMutation(mutation, options)`

```tsx
const [createUser, { loading, error }] = useMutation(CREATE_USER, {
  onCompleted: (data) => {
    console.log('User created:', data);
  },
});
```

#### `useSubscription(subscription, options)`

```tsx
const { data, loading, error } = useSubscription(USER_UPDATED, {
  variables: { userId },
});
```

### **REST API Hooks**

#### `useQuery(key, fetcher, options)`

```tsx
const { data, loading, error, refetch } = useQuery(
  ['users'],
  () => fetch('/api/users').then((res) => res.json()),
  { staleTime: 5 * 60 * 1000 }
);
```

#### `useMutation(mutationFn, options)`

```tsx
const { mutate, loading, error } = useMutation(
  (userData) =>
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }).then((res) => res.json()),
  {
    onSuccess: (data) => {
      console.log('User created:', data);
    },
  }
);
```

### **WebSocket Hooks**

#### `useWebSocket(url, options)`

```tsx
const { socket, isConnected, sendMessage } = useWebSocket('ws://localhost:8080', {
  onMessage: (event) => {
    console.log('Message received:', event.data);
  },
});
```

## 🎨 Usage Examples

### **GraphQL Integration**

```tsx
import { gql, useQuery, useMutation } from '@/infrastructure/data';

const GET_USERS = gql`
  query GetUsers($limit: Int) {
    users(limit: $limit) {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

function UsersPage() {
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { limit: 10 },
  });

  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      refetch(); // Refresh the list
    },
  });

  const handleCreateUser = async (userData) => {
    try {
      await createUser({ variables: { input: userData } });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <button onClick={() => handleCreateUser({ name: 'New User', email: 'new@example.com' })}>
        {creating ? 'Creating...' : 'Create User'}
      </button>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### **REST API Integration**

```tsx
import { useQuery, useMutation, useQueryClient } from '@/infrastructure/data';

function UsersPage() {
  const queryClient = useQueryClient();

  const {
    data: users,
    loading,
    error,
  } = useQuery(['users'], () => fetch('/api/users').then((res) => res.json()), {
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: createUser, loading: creating } = useMutation(
    (userData) =>
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    }
  );

  const { mutate: deleteUser } = useMutation(
    (userId) => fetch(`/api/users/${userId}`, { method: 'DELETE' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    }
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <button onClick={() => createUser({ name: 'New User', email: 'new@example.com' })}>
        {creating ? 'Creating...' : 'Create User'}
      </button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### **WebSocket Integration**

```tsx
import { useWebSocket } from '@/infrastructure/data';

function ChatRoom({ roomId }) {
  const { socket, isConnected, sendMessage } = useWebSocket(`ws://localhost:8080/chat/${roomId}`, {
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      console.log('New message:', message);
    },
    onOpen: () => {
      console.log('Connected to chat room');
    },
    onClose: () => {
      console.log('Disconnected from chat room');
    },
  });

  const handleSendMessage = (text) => {
    sendMessage(
      JSON.stringify({
        type: 'message',
        text,
        timestamp: Date.now(),
      })
    );
  };

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <button onClick={() => handleSendMessage('Hello!')}>Send Message</button>
    </div>
  );
}
```

### **Error Handling**

```tsx
import { useQuery } from '@/infrastructure/data';
import { ErrorBoundary } from '@/infrastructure/error-handling';

function UserProfile({ userId }) {
  const { data, loading, error } = useQuery(['user', userId], () =>
    fetch(`/api/users/${userId}`).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }
      return res.json();
    })
  );

  if (loading) return <div>Loading...</div>;
  if (error) throw error; // Let ErrorBoundary handle it

  return <div>{data.name}</div>;
}

function App() {
  return (
    <ErrorBoundary>
      <UserProfile userId="123" />
    </ErrorBoundary>
  );
}
```

## 🎯 Data Layer Features

### **GraphQL Client**

| Feature                     | Description                    | Implementation                     |
| --------------------------- | ------------------------------ | ---------------------------------- |
| **Query Caching**           | Intelligent query caching      | Apollo Client cache                |
| **Optimistic Updates**      | Immediate UI updates           | Apollo Client optimistic responses |
| **Error Handling**          | Comprehensive error management | Apollo Client error policies       |
| **Real-time Subscriptions** | Live data updates              | GraphQL subscriptions              |

### **REST Client**

| Feature                  | Description                   | Implementation                 |
| ------------------------ | ----------------------------- | ------------------------------ |
| **Request Interceptors** | Request/response modification | Axios interceptors             |
| **Retry Logic**          | Automatic retry on failure    | Exponential backoff            |
| **Caching**              | Response caching              | React Query cache              |
| **Background Updates**   | Automatic data refetching     | React Query background updates |

### **WebSocket Client**

| Feature               | Description                          | Implementation               |
| --------------------- | ------------------------------------ | ---------------------------- |
| **Auto Reconnection** | Automatic reconnection on disconnect | WebSocket reconnection logic |
| **Message Queuing**   | Queue messages when disconnected     | Message queue system         |
| **Heartbeat**         | Connection health monitoring         | Ping/pong heartbeat          |
| **Error Handling**    | WebSocket error management           | Error event handling         |

### **Caching Strategy**

| Feature                | Description                     | Implementation                 |
| ---------------------- | ------------------------------- | ------------------------------ |
| **Memory Cache**       | In-memory data caching          | Apollo Client + React Query    |
| **Cache Invalidation** | Smart cache invalidation        | Tag-based invalidation         |
| **Background Sync**    | Background data synchronization | React Query background updates |
| **Offline Support**    | Offline data access             | Cache persistence              |

## 🧪 Testing

### **Unit Tests**

```tsx
import { renderHook } from '@testing-library/react';
import { useQuery } from '@/infrastructure/data';

test('useQuery hook', () => {
  const { result } = renderHook(() => useQuery(['users'], () => Promise.resolve([])));

  expect(result.current.data).toBeUndefined();
  expect(result.current.loading).toBe(true);
});
```

### **Integration Tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@/infrastructure/data';

test('data fetching integration', async () => {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <UsersList />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Users')).toBeInTheDocument();
  });
});
```

## 🔧 Configuration

### **Environment Variables**

```bash
# GraphQL Configuration
GRAPHQL_ENDPOINT=http://localhost:4000/graphql
GRAPHQL_WS_ENDPOINT=ws://localhost:4000/graphql

# REST API Configuration
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=10000

# WebSocket Configuration
WS_ENDPOINT=ws://localhost:8080
WS_RECONNECT_INTERVAL=5000
```

### **Data Provider Configuration**

```tsx
import { ApolloProvider } from '@/infrastructure/data';
import { QueryClient, QueryClientProvider } from '@/infrastructure/data';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <ApolloProvider>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </ApolloProvider>
  );
}
```

## 🚨 Common Pitfalls

### **❌ Don't**

```tsx
// Don't forget error handling
const { data } = useQuery(GET_USERS);
return <div>{data.users.map((u) => u.name)}</div>; // Will crash if error

// Don't ignore loading states
const { data } = useQuery(GET_USERS);
return <div>{data.users.length} users</div>; // Will crash if loading

// Don't forget to handle WebSocket disconnection
const { sendMessage } = useWebSocket(url);
sendMessage('Hello'); // May fail if disconnected
```

### **✅ Do**

```tsx
// Always handle errors and loading states
const { data, loading, error } = useQuery(GET_USERS);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <div>{data.users.map((u) => u.name)}</div>;

// Check connection status
const { sendMessage, isConnected } = useWebSocket(url);

const handleSend = (message) => {
  if (isConnected) {
    sendMessage(message);
  } else {
    console.log('Not connected, message queued');
  }
};
```

## 🔄 Migration Guide

### **From Custom API Clients**

```tsx
// Before
const { data, loading } = useCustomQuery('/api/users');

// After
const { data, loading } = useQuery(['users'], () => fetch('/api/users').then((res) => res.json()));
```

### **From Third-party Libraries**

```tsx
// Before
import { useQuery } from 'react-query';

// After
import { useQuery } from '@/infrastructure/data';
```

## 📚 Related Components

- [Apollo Client](./lib/apollo/README.md) - GraphQL client
- [Axios Client](./lib/axios/README.md) - REST client
- [React Query Client](./lib/react-query/README.md) - Server state management
- [WebSocket Client](./lib/websocket/README.md) - WebSocket client

---

**Last Updated**: December 2024  
**Version**: 1.0.0
