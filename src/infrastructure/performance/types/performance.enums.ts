/**
 * Performance-related enums
 */

export enum PerformanceRating {
  GOOD = 'good',
  NEEDS_IMPROVEMENT = 'needs-improvement',
  POOR = 'poor',
}

export enum ImageFormat {
  WEBP = 'webp',
  AVIF = 'avif',
  JPEG = 'jpeg',
  PNG = 'png',
}

export enum NonCriticalStrategy {
  ASYNC = 'async',
  DEFER = 'defer',
  LAZY = 'lazy',
}

export enum CacheStrategy {
  MEMORY = 'memory',
  DISK = 'disk',
  NO_CACHE = 'no-cache',
  NO_STORE = 'no-store',
  PRIVATE = 'private',
  PUBLIC = 'public',
}
