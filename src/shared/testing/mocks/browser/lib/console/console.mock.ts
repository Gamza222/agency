/**
 * Console Mock for Testing
 *
 * Provides a mock implementation of console methods for testing environments.
 * Captures console outputs for assertion in tests.
 */

// Store original console methods
const originalConsole = { ...console };

// Define proper types for console methods
type ConsoleMethod = (...args: unknown[]) => void;

interface MockConsole {
  log: ConsoleMethod;
  error: ConsoleMethod;
  warn: ConsoleMethod;
  info: ConsoleMethod;
  debug: ConsoleMethod;
  clear: () => void;
  restore: () => void;
  getCalls: () => { method: string; args: unknown[] }[];
}

// Track console calls
const consoleCalls: { method: string; args: unknown[] }[] = [];

export const mockConsole: MockConsole = {
  log: (...args: unknown[]) => {
    consoleCalls.push({ method: 'log', args });
  },
  error: (...args: unknown[]) => {
    consoleCalls.push({ method: 'error', args });
  },
  warn: (...args: unknown[]) => {
    consoleCalls.push({ method: 'warn', args });
  },
  info: (...args: unknown[]) => {
    consoleCalls.push({ method: 'info', args });
  },
  debug: (...args: unknown[]) => {
    consoleCalls.push({ method: 'debug', args });
  },
  clear: () => {
    consoleCalls.length = 0;
  },
  restore: () => {
    Object.assign(console, originalConsole);
  },
  getCalls: () => [...consoleCalls],
};

// Apply mock to console
Object.assign(console, mockConsole);
