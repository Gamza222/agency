export const APP_VERSION = '0.1.0';
export const BUILD_NUMBER = process.env.BUILD_NUMBER || '0';
export const GIT_COMMIT = process.env.GIT_COMMIT || 'dev';

export const ROUTES = {
  HOME: '/',
} as const;

export const BUILD_PATHS = {
  root: process.cwd(),
  src: 'src',
  public: 'public',
} as const;

export const DEFAULT_SETTINGS = {
  API_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: 60 * 5, // 5 minutes
} as const;
