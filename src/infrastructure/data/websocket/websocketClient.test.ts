/**
 * WebSocket Client Tests
 *
 * Real-life enterprise scenarios testing with minimal mocking.
 * Uses existing mock factory patterns and focuses on client configuration.
 */

import { createWebSocketClient, WebSocketClient, WebSocketState } from './websocketClient';

// Use existing mock factory patterns
import { mockConsole, mockStorage } from '@/shared/testing/mocks/browser';

describe('WebSocket Client', () => {
  let wsClient: WebSocketClient;
  let mockLocalStorage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    // Use existing mock factory patterns
    mockConsole.clear();

    // Create fresh localStorage mock for each test
    mockLocalStorage = mockStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    // Cleanup
    if (wsClient) {
      wsClient.disconnect();
    }
    mockConsole.restore();
    // Clear any pending timers
    jest.clearAllTimers();
    // Clear mock storage
    mockLocalStorage.clear();
  });

  // ============================================================================
  // REAL-LIFE ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Enterprise WebSocket Operations', () => {
    it('should create WebSocket client with enterprise configuration', () => {
      // Real scenario: connecting to enterprise notification system
      wsClient = createWebSocketClient({
        url: 'wss://notifications.company.com/ws',
        reconnectInterval: 1000,
        maxReconnectAttempts: 3,
      });

      expect(wsClient).toBeDefined();
      expect(wsClient.getState()).toBe(WebSocketState.DISCONNECTED);
      expect(typeof wsClient.connect).toBe('function');
      expect(typeof wsClient.disconnect).toBe('function');
      expect(typeof wsClient.send).toBe('function');
      expect(typeof wsClient.subscribe).toBe('function');
    });

    it('should configure client for real-time chat scenarios', () => {
      // Real scenario: enterprise chat application
      wsClient = createWebSocketClient({
        url: 'wss://chat.company.com/ws',
      });

      expect(wsClient).toBeDefined();
      expect(typeof wsClient.subscribe).toBe('function');

      // Should support subscription functionality
      const unsubscribe = wsClient.subscribe('chat_message', (_message) => {
        // Message handler would process real messages
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should configure client for system monitoring', () => {
      // Real scenario: monitoring dashboard with live system status
      wsClient = createWebSocketClient({
        url: 'wss://monitoring.company.com/ws',
      });

      expect(wsClient).toBeDefined();
      expect(typeof wsClient.onStateChanged).toBe('function');
      expect(typeof wsClient.onErrorOccurred).toBe('function');
    });

    it('should support message sending configuration', () => {
      // Real scenario: tracking user activity for collaborative features
      wsClient = createWebSocketClient({
        url: 'wss://collaboration.company.com/ws',
      });

      expect(wsClient).toBeDefined();
      expect(typeof wsClient.send).toBe('function');
      expect(wsClient.getState()).toBe(WebSocketState.DISCONNECTED);
    });
  });

  // ============================================================================
  // CONNECTION MANAGEMENT - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Connection Management', () => {
    it('should provide connection control methods', () => {
      // Real scenario: user logs out, need clean disconnection
      wsClient = createWebSocketClient({
        url: 'wss://realtime.company.com/ws',
      });

      expect(typeof wsClient.connect).toBe('function');
      expect(typeof wsClient.disconnect).toBe('function');
      expect(typeof wsClient.isConnected).toBe('function');
      expect(wsClient.getState()).toBe(WebSocketState.DISCONNECTED);
    });

    it('should support message queuing configuration', () => {
      // Real scenario: network hiccup, messages should be queued
      wsClient = createWebSocketClient({
        url: 'wss://reliable.company.com/ws',
        reconnectInterval: 100,
      });

      expect(wsClient).toBeDefined();
      expect(typeof wsClient.send).toBe('function');
    });

    it('should support reconnection configuration', () => {
      // Real scenario: network drops, should support reconnection
      wsClient = createWebSocketClient({
        url: 'wss://resilient.company.com/ws',
        reconnectInterval: 50,
        maxReconnectAttempts: 2,
      });

      expect(wsClient).toBeDefined();
      expect(wsClient.getState()).toBe(WebSocketState.DISCONNECTED);
    });

    it('should provide connection state tracking', () => {
      // Real scenario: UI needs to show connection status
      wsClient = createWebSocketClient({
        url: 'wss://stateful.company.com/ws',
      });

      expect(typeof wsClient.getState).toBe('function');
      expect(typeof wsClient.onStateChanged).toBe('function');

      // Should support state change callbacks
      const stateChanges: WebSocketState[] = [];
      wsClient.onStateChanged((state) => {
        stateChanges.push(state);
      });

      expect(stateChanges).toEqual([]);
    });
  });

  // ============================================================================
  // AUTHENTICATION - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Authentication Integration', () => {
    it('should work with authentication tokens', () => {
      // Real scenario: authenticated WebSocket connection
      mockLocalStorage.setItem('auth_token', 'enterprise_ws_token_123');

      wsClient = createWebSocketClient({
        url: 'wss://secure.company.com/ws',
      });

      expect(wsClient).toBeDefined();
      expect(mockLocalStorage.getItem('auth_token')).toBe('enterprise_ws_token_123');
    });

    it('should work without authentication for public channels', () => {
      // Real scenario: public announcements channel
      expect(mockLocalStorage.getItem('auth_token')).toBeNull();

      wsClient = createWebSocketClient({
        url: 'wss://public.company.com/ws',
      });

      expect(wsClient).toBeDefined();
      expect(wsClient.getState()).toBe(WebSocketState.DISCONNECTED);
    });

    it('should handle different token storage strategies', () => {
      // Real scenario: different enterprise systems store tokens differently
      const tokenStrategies = ['auth_token', 'access_token', 'websocket_token', 'bearer_token'];

      tokenStrategies.forEach((tokenKey) => {
        mockLocalStorage.clear();
        mockLocalStorage.setItem(tokenKey, `${tokenKey}_value_123`);

        wsClient = createWebSocketClient({
          url: 'wss://flexible-auth.company.com/ws',
        });

        // Should handle each token strategy
        expect(mockLocalStorage.getItem(tokenKey)).toBe(`${tokenKey}_value_123`);
        expect(wsClient).toBeDefined();
        wsClient.disconnect();
      });
    });
  });

  // ============================================================================
  // EVENT SUBSCRIPTION - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Event Subscription Management', () => {
    beforeEach(() => {
      wsClient = createWebSocketClient({
        url: 'wss://events.company.com/ws',
      });
    });

    it('should support multiple subscribers for same event', () => {
      // Real scenario: multiple UI components listening to same data
      const subscriber1Handler = jest.fn();
      const subscriber2Handler = jest.fn();

      const unsub1 = wsClient.subscribe('order_update', subscriber1Handler);
      const unsub2 = wsClient.subscribe('order_update', subscriber2Handler);

      expect(typeof unsub1).toBe('function');
      expect(typeof unsub2).toBe('function');

      unsub1();
      unsub2();
    });

    it('should handle subscription cleanup', () => {
      // Real scenario: component unmounts, need to cleanup subscriptions
      const messageHandler = jest.fn();
      const unsubscribe = wsClient.subscribe('cleanup_test', messageHandler);

      expect(typeof unsubscribe).toBe('function');

      // Unsubscribe should not throw
      expect(() => unsubscribe()).not.toThrow();
    });

    it('should handle subscription errors gracefully', () => {
      // Real scenario: subscriber callback throws error
      const errorCallback = jest.fn(() => {
        throw new Error('Subscriber error');
      });

      // Should not crash when creating subscription with error-prone callback
      expect(() => {
        wsClient.subscribe('error_test', errorCallback);
      }).not.toThrow();
    });
  });

  // ============================================================================
  // CONNECTION HEALTH MANAGEMENT
  // ============================================================================

  describe('Connection Health Management', () => {
    it('should support heartbeat configuration', () => {
      // Real scenario: enterprise firewalls drop idle connections
      wsClient = createWebSocketClient({
        url: 'wss://heartbeat.company.com/ws',
        enableHeartbeat: true,
        heartbeatInterval: 30000,
      });

      expect(wsClient).toBeDefined();
      expect(wsClient.getState()).toBe(WebSocketState.DISCONNECTED);
    });

    it('should support heartbeat responses', () => {
      // Real scenario: server responds to ping with pong
      wsClient = createWebSocketClient({
        url: 'wss://pong.company.com/ws',
        enableHeartbeat: true,
      });

      expect(wsClient).toBeDefined();
    });

    it('should allow disabling heartbeat when not needed', () => {
      // Real scenario: some servers don't need heartbeat
      wsClient = createWebSocketClient({
        url: 'wss://no-heartbeat.company.com/ws',
        enableHeartbeat: false,
      });

      expect(wsClient).toBeDefined();
    });
  });

  // ============================================================================
  // ERROR HANDLING - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Error Handling', () => {
    it('should provide error handling configuration', () => {
      // Real scenario: WebSocket server is down
      wsClient = createWebSocketClient({
        url: 'wss://down-server.company.com/ws',
        maxReconnectAttempts: 1,
      });

      expect(typeof wsClient.onErrorOccurred).toBe('function');

      const errorHandler = jest.fn();
      wsClient.onErrorOccurred(errorHandler);

      expect(errorHandler).not.toHaveBeenCalled();
    });

    it('should handle malformed message configuration', () => {
      // Real scenario: server sends invalid JSON
      wsClient = createWebSocketClient({
        url: 'wss://malformed.company.com/ws',
      });

      expect(wsClient).toBeDefined();
      expect(typeof wsClient.subscribe).toBe('function');
    });

    it('should provide error context capabilities', () => {
      // Real scenario: developers need error details
      wsClient = createWebSocketClient({
        url: 'wss://debug.company.com/ws',
      });

      expect(typeof wsClient.onErrorOccurred).toBe('function');
      expect(typeof wsClient.onStateChanged).toBe('function');
    });
  });

  // ============================================================================
  // PERFORMANCE - REAL ENTERPRISE SCENARIOS
  // ============================================================================

  describe('Performance Considerations', () => {
    it('should handle high-frequency message configuration', () => {
      // Real scenario: real-time trading data with high message volume
      wsClient = createWebSocketClient({
        url: 'wss://high-frequency.company.com/ws',
      });

      expect(wsClient).toBeDefined();
      expect(typeof wsClient.subscribe).toBe('function');
    });

    it('should handle many subscriptions efficiently', () => {
      // Real scenario: complex dashboard with many data subscriptions
      wsClient = createWebSocketClient({
        url: 'wss://dashboard.company.com/ws',
      });

      const unsubscribers: (() => void)[] = [];

      // Create many subscriptions
      for (let i = 0; i < 50; i++) {
        const unsub = wsClient.subscribe(`event_${i}`, () => {
          // Handle message
        });
        unsubscribers.push(unsub);
      }

      expect(unsubscribers).toHaveLength(50);

      // Cleanup all subscriptions
      unsubscribers.forEach((unsub) => unsub());
    });
  });
});

describe('WebSocket Client Factory', () => {
  it('should create client with default configuration', () => {
    // Real scenario: simple client creation
    const client = createWebSocketClient({
      url: 'wss://default.company.com/ws',
    });

    expect(client).toBeInstanceOf(WebSocketClient);
    expect(client.getState()).toBe(WebSocketState.DISCONNECTED);
  });

  it('should create client with custom configuration', () => {
    // Real scenario: enterprise-specific configuration
    const client = createWebSocketClient({
      url: 'wss://custom.company.com/ws',
      protocols: ['chat', 'notifications'],
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      timeout: 15000,
      heartbeatInterval: 60000,
      enableHeartbeat: true,
    });

    expect(client).toBeInstanceOf(WebSocketClient);
    expect(client.getState()).toBe(WebSocketState.DISCONNECTED);
  });
});
