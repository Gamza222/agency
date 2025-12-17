/**
 * API error messages and constants
 */

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed',
  TIMEOUT_ERROR: 'Request timeout',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed',
  UNKNOWN_ERROR: 'Unknown error occurred',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_PATHS = {
  AUTH: '/auth',
  USERS: '/users',
  HEALTH: '/health',
} as const;
