import { ApiConfig } from './api.types';
import { envConfig } from '../../../../config/env';

/**
 * API client configuration
 */
export const apiConfig: ApiConfig = {
  baseUrl: envConfig.apiUrl,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

/**
 * WebSocket configuration
 */
export const wsConfig = {
  url: envConfig.wsUrl,
  reconnectAttempts: 5,
  reconnectInterval: 3000, // 3 seconds
  heartbeatInterval: 30000, // 30 seconds
} as const;
