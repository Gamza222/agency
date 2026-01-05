/**
 * Environment Utilities
 * 
 * Provides a unified interface for accessing environment variables
 * that works with both Vite (import.meta.env) and Node.js (process.env)
 */

// Safe check for process
function hasProcess(): boolean {
  try {
    return typeof process !== 'undefined' && process !== null && process.env !== undefined;
  } catch {
    return false;
  }
}

// Safe access to process.env
function getProcessEnv(key: string): string | undefined {
  try {
    if (hasProcess()) {
      return process.env[key];
    }
  } catch {
    // Ignore errors
  }
  return undefined;
}

/**
 * Get environment variable value
 * Works in both browser (Vite) and Node.js environments
 */
export function getEnv(key: string): string | undefined {
  // Try process.env first (for Node.js/server-side scripts)
  const processValue = getProcessEnv(key);
  if (processValue !== undefined) {
    return processValue;
  }
  
  // Check if we're in a Vite environment (browser)
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // In Vite, environment variables are available via import.meta.env
      // For client-side, we need to use VITE_ prefix
      // For variables that were NEXT_PUBLIC_*, we'll map them to VITE_*
      const viteKey = key.startsWith('NEXT_PUBLIC_') 
        ? key.replace('NEXT_PUBLIC_', 'VITE_')
        : key.startsWith('VITE_')
        ? key
        : `VITE_${key}`;
      
      // Try the mapped key first, then the original key
      const env = import.meta.env as Record<string, string | undefined>;
      const value = env[viteKey] || env[key];
      
      if (value !== undefined && value !== '') {
        return value;
      }
    }
  } catch {
    // Ignore errors
  }
  
  return undefined;
}

/**
 * Get NODE_ENV value
 */
export function getNodeEnv(): string {
  // Try process.env first (for Node.js/server-side scripts)
  try {
    if (hasProcess() && process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }
  } catch {
    // Ignore errors
  }
  
  // Check Vite environment
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // Vite uses MODE instead of NODE_ENV
      const mode = import.meta.env.MODE;
      if (mode) {
        // Map Vite modes to our Environment enum
        if (mode === 'production') return 'production';
        if (mode === 'development') return 'development';
        if (mode === 'test') return 'test';
        return mode;
      }
    }
  } catch {
    // Ignore errors
  }
  
  return 'development';
}

