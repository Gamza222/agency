import { mockStorageInterface } from '../../types/types';

/**
 * Creates a mock storage object for testing
 *
 * @param initialData - Optional initial data to populate the storage
 * @returns A mock storage object that implements StorageMockInterface
 */
export const mockStorage = (initialData: Record<string, string> = {}): mockStorageInterface => {
  const store = new Map<string, string>(Object.entries(initialData));

  const storageMock: mockStorageInterface = {
    get length() {
      return store.size;
    },

    getItem(key: string): string | null {
      return store.get(key) || null;
    },

    setItem(key: string, value: string): void {
      store.set(key, value);
    },

    removeItem(key: string): void {
      store.delete(key);
    },

    clear(): void {
      store.clear();
    },

    key(index: number): string | null {
      const keys = Array.from(store.keys());
      return keys[index] || null;
    },
  };

  return storageMock;
};

// Replace window storage APIs
Object.defineProperty(window, 'localStorage', { value: mockStorage() });
Object.defineProperty(window, 'sessionStorage', { value: mockStorage() });
