import { mockWebSocketInstanceInterface, mockWebSocketMessageInterface } from '../../types/types';

export class WebSocketMock implements mockWebSocketInstanceInterface {
  private messageHandlers: ((event: MessageEvent) => void)[] = [];
  private isConnected = false;

  constructor(_url: string) {
    // Simulate immediate connection
    setTimeout(() => {
      this.isConnected = true;
      this.emit('open');
    }, 0);
  }

  addEventListener(type: string, handler: (event: MessageEvent) => void): void {
    if (type === 'message') {
      this.messageHandlers.push(handler);
    }
  }

  removeEventListener(type: string, handler: (event: MessageEvent) => void): void {
    if (type === 'message') {
      const index = this.messageHandlers.indexOf(handler);
      if (index !== -1) {
        this.messageHandlers.splice(index, 1);
      }
    }
  }

  send(_data: string): void {
    if (!this.isConnected) {
      throw new Error('WebSocket is not connected');
    }
  }

  mockMessage(message: mockWebSocketMessageInterface): void {
    const event = new MessageEvent('message', {
      data: JSON.stringify(message),
    });
    this.messageHandlers.forEach((handler) => handler(event));
  }

  close(): void {
    this.isConnected = false;
    this.emit('close');
  }

  private emit(type: string): void {
    const event = new Event(type);
    this.dispatchEvent(event);
  }

  private dispatchEvent(_event: Event): boolean {
    return true;
  }
}

// Type assertion to WebSocket constructor type
global.WebSocket = WebSocketMock as unknown as typeof WebSocket;

export const createWebSocketMock = (url: string): mockWebSocketInstanceInterface =>
  new WebSocketMock(url);
