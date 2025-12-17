/**
 * Node.js Mocks
 *
 * Mock implementations for Node.js modules and APIs used in testing.
 */

// File System
export { mockFs, setupFsMock, resetFsMock, defaultFsMock } from './lib/fs/fs.mock';
export {
  createMockFileSystem,
  fileSystemScenarios,
  setupMockFileSystem,
} from './lib/fs/fs-test-utils.mock';
