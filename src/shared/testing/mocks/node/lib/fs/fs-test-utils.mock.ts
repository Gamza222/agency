/**
 * File System Test Utilities
 *
 * Utility functions for setting up file system mocks in tests.
 * These are specifically designed for testing file operations.
 */

import * as fs from 'fs';

/**
 * Creates a mock file system setup for testing
 */
export const createMockFileSystem = () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;

  return {
    // Basic file operations
    mockFileExists: (_path: string, exists: boolean = true) => {
      mockedFs.existsSync.mockReturnValue(exists);
    },

    mockDirectoryExists: (_path: string, exists: boolean = true) => {
      mockedFs.existsSync.mockReturnValue(exists);
    },

    mockReadFile: (_path: string, content: string) => {
      mockedFs.readFileSync.mockReturnValue(content);
    },

    mockWriteFile: () => {
      mockedFs.writeFileSync.mockImplementation(() => undefined);
    },

    mockCreateDirectory: () => {
      mockedFs.mkdirSync.mockImplementation(() => 'mocked');
    },

    // Directory operations
    mockReadDirectory: (_path: string, files: string[]) => {
      mockedFs.readdirSync.mockReturnValue(files as unknown as import('fs').Dirent<Buffer>[]);
    },

    mockFileStats: (_path: string, isDirectory: boolean = false) => {
      mockedFs.statSync.mockReturnValue({
        isDirectory: () => isDirectory,
      } as unknown as import('fs').Stats);
    },

    // Error scenarios
    mockFileReadError: (_path: string, error: Error = new Error('File read error')) => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw error;
      });
    },

    mockFileSystemError: (error: Error = new Error('File system error')) => {
      mockedFs.existsSync.mockImplementation(() => {
        throw error;
      });
    },

    // Reset all mocks
    resetAllMocks: () => {
      mockedFs.existsSync.mockReset();
      mockedFs.readFileSync.mockReset();
      mockedFs.writeFileSync.mockReset();
      mockedFs.mkdirSync.mockReset();
      mockedFs.readdirSync.mockReset();
      mockedFs.statSync.mockReset();
    },

    // Get mock calls for assertions
    getMockCalls: () => ({
      existsSync: mockedFs.existsSync.mock.calls,
      readFileSync: mockedFs.readFileSync.mock.calls,
      writeFileSync: mockedFs.writeFileSync.mock.calls,
      mkdirSync: mockedFs.mkdirSync.mock.calls,
      readdirSync: mockedFs.readdirSync.mock.calls,
      statSync: mockedFs.statSync.mock.calls,
    }),
  };
};

/**
 * Common file system scenarios for testing
 */
export const fileSystemScenarios = {
  /**
   * Empty directory scenario
   */
  emptyDirectory: (mockFs: ReturnType<typeof createMockFileSystem>) => {
    mockFs.mockDirectoryExists('src', true);
    mockFs.mockReadDirectory('src', []);
  },

  /**
   * Directory with files scenario
   */
  directoryWithFiles: (mockFs: ReturnType<typeof createMockFileSystem>, files: string[]) => {
    mockFs.mockDirectoryExists('src', true);
    mockFs.mockReadDirectory('src', files);
  },

  /**
   * File not found scenario
   */
  fileNotFound: (mockFs: ReturnType<typeof createMockFileSystem>, path: string) => {
    mockFs.mockFileExists(path, false);
  },

  /**
   * File read error scenario
   */
  fileReadError: (mockFs: ReturnType<typeof createMockFileSystem>, path: string) => {
    mockFs.mockFileExists(path, true);
    mockFs.mockFileReadError(path);
  },

  /**
   * Successful file operations scenario
   */
  successfulOperations: (mockFs: ReturnType<typeof createMockFileSystem>) => {
    mockFs.mockWriteFile();
    mockFs.mockCreateDirectory();
  },
};

/**
 * Helper to create a mock file system with common setup
 */
export const setupMockFileSystem = (scenario: 'empty' | 'withFiles' | 'error' = 'empty') => {
  const mockFs = createMockFileSystem();

  switch (scenario) {
    case 'empty':
      fileSystemScenarios.emptyDirectory(mockFs);
      break;
    case 'withFiles':
      fileSystemScenarios.directoryWithFiles(mockFs, ['test.ts', 'test.tsx']);
      break;
    case 'error':
      mockFs.mockFileSystemError();
      break;
  }

  return mockFs;
};
