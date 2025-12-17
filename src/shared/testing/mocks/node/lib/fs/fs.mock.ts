/**
 * File System Mock for Testing
 *
 * Provides a mock implementation of the Node.js fs module for testing environments.
 * Simulates file system operations without actually touching the file system.
 */

import * as fs from 'fs';

// Mock file system data
const mockFileSystem: Record<string, string | boolean> = {};

// Mock directory structure
const mockDirectories: Set<string> = new Set();

/**
 * Creates a mock fs module for testing
 *
 * @param customData - Optional custom file system data
 * @returns A mock fs module
 */
export const mockFs = (customData: Record<string, string | boolean> = {}) => {
  // Reset mock data
  Object.keys(mockFileSystem).forEach((key) => delete mockFileSystem[key]);
  mockDirectories.clear();

  // Set up custom data
  Object.entries(customData).forEach(([path, content]) => {
    if (typeof content === 'boolean') {
      if (content) {
        mockDirectories.add(path);
      }
    } else {
      mockFileSystem[path] = content;
    }
  });

  const mockedFs = {
    existsSync: jest.fn((path: string) => {
      return (
        Object.prototype.hasOwnProperty.call(mockFileSystem, path) || mockDirectories.has(path)
      );
    }),

    readFileSync: jest.fn((path: string) => {
      if (Object.prototype.hasOwnProperty.call(mockFileSystem, path)) {
        return mockFileSystem[path];
      }
      throw new Error(`ENOENT: no such file or directory, open '${path}'`);
    }),

    writeFileSync: jest.fn((path: string, content: string) => {
      mockFileSystem[path] = content;
    }),

    mkdirSync: jest.fn((path: string, options?: { recursive?: boolean }) => {
      if (options?.recursive) {
        // Create parent directories
        const parts = path.split('/');
        for (let i = 1; i <= parts.length; i++) {
          const parentPath = parts.slice(0, i).join('/');
          if (parentPath) {
            mockDirectories.add(parentPath);
          }
        }
      } else {
        mockDirectories.add(path);
      }
      return 'mocked';
    }),

    readdirSync: jest.fn((path: string) => {
      const entries: string[] = [];

      // Find files and directories that start with this path
      Object.keys(mockFileSystem).forEach((filePath) => {
        if (filePath.startsWith(path + '/') && !filePath.substring(path.length + 1).includes('/')) {
          entries.push(filePath.split('/').pop()!);
        }
      });

      mockDirectories.forEach((dirPath) => {
        if (dirPath.startsWith(path + '/') && !dirPath.substring(path.length + 1).includes('/')) {
          entries.push(dirPath.split('/').pop()!);
        }
      });

      return entries;
    }),

    statSync: jest.fn((path: string) => {
      if (mockDirectories.has(path)) {
        return { isDirectory: () => true };
      }
      if (Object.prototype.hasOwnProperty.call(mockFileSystem, path)) {
        return { isDirectory: () => false };
      }
      throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
    }),
  };

  return mockedFs as unknown as jest.Mocked<typeof fs>;
};

/**
 * Sets up global fs mock
 *
 * @param customData - Optional custom file system data
 */
export const setupFsMock = (customData: Record<string, string | boolean> = {}): void => {
  const fsMock = mockFs(customData);

  jest.doMock('fs', () => fsMock);
};

/**
 * Resets the file system mock
 */
export const resetFsMock = (): void => {
  Object.keys(mockFileSystem).forEach((key) => delete mockFileSystem[key]);
  mockDirectories.clear();
};

// Default fs mock instance
export const defaultFsMock = mockFs();
