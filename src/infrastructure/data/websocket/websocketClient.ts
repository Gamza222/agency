/**
 * WebSocket Client Configuration
 *
 * Universal WebSocket client foundation that can be used by any enterprise application.
 * Provides automatic reconnection, message queuing, and robust error handling.
 */

import {
  AuthTokenKey,
  type WebSocketConfig,
  type WebSocketMessage,
  WebSocketState,
  type WebSocketSubscription,
} from '../types/types';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

// Import centralized environment configuration
import { envConfig } from '../../../../config/env';

const DEFAULT_WS_URL = envConfig.wsUrl;
const DEFAULT_RECONNECT_INTERVAL = 1000;
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 5;
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_HEARTBEAT_INTERVAL = 30000;

// ============================================================================
// WEBSOCKET CLIENT CLASS
// ============================================================================

/**
 * Universal WebSocket client that can handle any real-time communication needs
 */
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig & {
    url: string;
    reconnectInterval: number;
    maxReconnectAttempts: number;
    timeout: number;
    heartbeatInterval: number;
    enableHeartbeat: boolean;
  };
  private state: WebSocketState = WebSocketState.DISCONNECTED;
  private reconnectAttempts = 0;
  private messageQueue: WebSocketMessage[] = [];
  private subscriptions = new Map<string, Set<WebSocketSubscription>>();
  private connectionPromise: Promise<void> | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;

  // Event handlers
  private onStateChange: ((state: WebSocketState) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;
  private onMessage: ((message: WebSocketMessage) => void) | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url || DEFAULT_WS_URL,
      reconnectInterval: config.reconnectInterval || DEFAULT_RECONNECT_INTERVAL,
      maxReconnectAttempts: config.maxReconnectAttempts || DEFAULT_MAX_RECONNECT_ATTEMPTS,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      heartbeatInterval: config.heartbeatInterval || DEFAULT_HEARTBEAT_INTERVAL,
      enableHeartbeat: config.enableHeartbeat ?? true,
    };

    // Set protocols only if provided
    if (config.protocols) {
      this.config.protocols = config.protocols;
    }
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.state === WebSocketState.CONNECTED || this.state === WebSocketState.CONNECTING) {
      return this.connectionPromise || Promise.resolve();
    }

    this.connectionPromise = this._connect();
    return this.connectionPromise;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this._setState(WebSocketState.DISCONNECTING);
    this._clearHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this._setState(WebSocketState.DISCONNECTED);
    this.connectionPromise = null;
  }

  /**
   * Send message to server
   */
  send(message: WebSocketMessage): void {
    const messageWithId = {
      ...message,
      id: message.id || this._generateId(),
      timestamp: message.timestamp || new Date().toISOString(),
    };

    if (this.state === WebSocketState.CONNECTED && this.ws) {
      try {
        this.ws.send(JSON.stringify(messageWithId));
        // Only log in non-test environments
        if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
          // console.debug('[WebSocket] Message sent:', messageWithId);
        }
      } catch (error) {
        // console.error('[WebSocket] Failed to send message:', error);
        this._handleError(new Error(`Failed to send message: ${String(error)}`));
      }
    } else {
      // Queue message for later delivery
      this.messageQueue.push(messageWithId);
      // Only log in non-test environments
      if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
        // console.debug('[WebSocket] Message queued:', messageWithId);
      }
    }
  }

  /**
   * Subscribe to specific event type
   */
  subscribe(event: string, callback: (message: WebSocketMessage) => void): () => void {
    const subscription: WebSocketSubscription = {
      id: this._generateId(),
      event,
      callback,
    };

    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }

    this.subscriptions.get(event)!.add(subscription);

    // Only log in non-test environments
    if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
      // console.debug('[WebSocket] Subscribed to event:', event);
    }

    // Return unsubscribe function
    return () => {
      const eventSubscriptions = this.subscriptions.get(event);
      if (eventSubscriptions) {
        eventSubscriptions.delete(subscription);
        if (eventSubscriptions.size === 0) {
          this.subscriptions.delete(event);
        }
      }
      // Only log in non-test environments
      if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
        // console.debug('[WebSocket] Unsubscribed from event:', event);
      }
    };
  }

  /**
   * Get current connection state
   */
  getState(): WebSocketState {
    return this.state;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.state === WebSocketState.CONNECTED;
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Set state change handler
   */
  onStateChanged(handler: (state: WebSocketState) => void): void {
    this.onStateChange = handler;
  }

  /**
   * Set error handler
   */
  onErrorOccurred(handler: (error: Error) => void): void {
    this.onError = handler;
  }

  /**
   * Set message handler (for all messages)
   */
  onMessageReceived(handler: (message: WebSocketMessage) => void): void {
    this.onMessage = handler;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Internal connect method
   */
  private async _connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._setState(WebSocketState.CONNECTING);

        // Add authentication token if available
        const token = this._getAuthToken();
        const url = token ? `${this.config.url}?token=${token}` : this.config.url;

        this.ws = new WebSocket(url, this.config.protocols);

        // Connection timeout
        const timeout = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, this.config.timeout);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          this._setState(WebSocketState.CONNECTED);
          this.reconnectAttempts = 0;
          this._processMessageQueue();
          this._startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data as string) as WebSocketMessage;
            this._handleMessage(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error, event.data);
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(timeout);
          this._clearHeartbeat();

          if (this.state === WebSocketState.DISCONNECTING) {
            this._setState(WebSocketState.DISCONNECTED);
            resolve();
          } else {
            console.warn('[WebSocket] Connection closed unexpectedly:', event);
            this._handleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error('[WebSocket] Connection error:', error);
          this._handleError(new Error('WebSocket connection error'));
          reject(new Error('WebSocket connection failed'));
        };
      } catch (error) {
        this._handleError(error as Error);
        reject(error);
      }
    });
  }

  /**
   * Handle incoming messages
   */
  private _handleMessage(message: WebSocketMessage): void {
    // Only log in non-test environments
    if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
      // console.debug('[WebSocket] Message received:', message);
    }

    // Call global message handler
    if (this.onMessage) {
      this.onMessage(message);
    }

    // Handle heartbeat responses
    if (message.type === 'pong') {
      return;
    }

    // Notify event subscribers
    const eventSubscriptions = this.subscriptions.get(message.type);
    if (eventSubscriptions) {
      eventSubscriptions.forEach((subscription) => {
        try {
          subscription.callback(message);
        } catch (error) {
          console.error('[WebSocket] Subscription callback error:', error);
        }
      });
    }
  }

  /**
   * Handle reconnection logic
   */
  private _handleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this._setState(WebSocketState.ERROR);
      this._handleError(new Error('Max reconnection attempts reached'));
      return;
    }

    this._setState(WebSocketState.RECONNECTING);
    this.reconnectAttempts++;

    const delay = this._calculateReconnectDelay();
    // Only log in non-test environments
    if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
      // console.debug(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    }

    setTimeout(() => {
      this._connect().catch((error) => {
        console.error('[WebSocket] Reconnection failed:', error);
        this._handleReconnect();
      });
    }, delay);
  }

  /**
   * Calculate reconnection delay with exponential backoff
   */
  private _calculateReconnectDelay(): number {
    const baseDelay = this.config.reconnectInterval;
    const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }

  /**
   * Process queued messages
   */
  private _processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      this.send(message);
    }
  }

  /**
   * Start heartbeat mechanism
   */
  private _startHeartbeat(): void {
    if (!this.config.enableHeartbeat) return;

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping' });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Clear heartbeat timer
   */
  private _clearHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Set connection state
   */
  private _setState(state: WebSocketState): void {
    this.state = state;
    // Only log in non-test environments
    if (!envConfig.isTest && !process.env.JEST_WORKER_ID) {
      // console.debug('[WebSocket] State changed:', state);
    }

    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }

  /**
   * Handle errors
   */
  private _handleError(error: Error): void {
    console.error('[WebSocket] Error:', error);

    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * Get authentication token
   */
  private _getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    return (
      localStorage.getItem(AuthTokenKey.AUTH_TOKEN) ||
      localStorage.getItem(AuthTokenKey.ACCESS_TOKEN) ||
      sessionStorage.getItem(AuthTokenKey.AUTH_TOKEN) ||
      sessionStorage.getItem(AuthTokenKey.ACCESS_TOKEN) ||
      null
    );
  }

  /**
   * Generate unique ID
   */
  private _generateId(): string {
    return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create a WebSocket client instance
 */
export const createWebSocketClient = (config: WebSocketConfig): WebSocketClient => {
  return new WebSocketClient(config);
};

// Re-export types for convenience
export { WebSocketState } from '../types/types';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default WebSocketClient;
