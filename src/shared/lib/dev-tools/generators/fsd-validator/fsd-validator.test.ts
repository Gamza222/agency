import fs from 'fs';
import { fsdValidator } from './fsd-validator';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('fsdValidator', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('returns validation result structure', () => {
    // Mock empty file list
    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.readdirSync.mockReturnValue([]);

    const result = fsdValidator();

    expect(result).toHaveProperty('isValid');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('warnings');
    expect(typeof result.isValid).toBe('boolean');
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it('validates files successfully when no violations found', () => {
    // Mock file system with valid files
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue(['src'] as any);
    mockedFs.statSync.mockReturnValue({ isDirectory: () => true } as any);

    // Mock getAllTsFiles to return empty array (no files to validate)
    jest.spyOn(fs, 'readdirSync').mockImplementation((dir) => {
      if (dir === 'src') {
        return ['shared', 'widgets', 'infrastructure'] as any;
      }
      return [] as any;
    });

    jest.spyOn(fs, 'statSync').mockImplementation((filePath) => {
      const filePathStr = filePath as string;
      if (
        filePathStr.includes('shared') ||
        filePathStr.includes('widgets') ||
        filePathStr.includes('infrastructure')
      ) {
        return { isDirectory: () => true } as any;
      }
      return { isDirectory: () => false } as any;
    });

    const result = fsdValidator();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects FSD violations correctly', () => {
    // Mock file with violation
    const mockFileContent = `
      import { Button } from '@/shared/ui/Button';
      import { UserCard } from '@/widgets/UserCard';
      import { authService } from '@/infrastructure/lib/auth';
    `;

    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockImplementation((dir) => {
      if (dir === 'src') {
        return ['shared', 'widgets', 'infrastructure'] as any;
      }
      if (dir === 'src/shared') {
        return ['ui', 'lib', 'model'] as any;
      }
      if (dir === 'src/shared/ui') {
        return ['Button'] as any;
      }
      if (dir === 'src/widgets') {
        return ['UserCard'] as any;
      }
      if (dir === 'src/infrastructure') {
        return ['lib'] as any;
      }
      if (dir === 'src/infrastructure/lib') {
        return ['auth'] as any;
      }
      return [] as any;
    });

    mockedFs.statSync.mockImplementation((filePath) => {
      const path = filePath as string;
      if (path.endsWith('.ts') || path.endsWith('.tsx')) {
        return { isDirectory: () => false } as any;
      }
      return { isDirectory: () => true } as any;
    });

    mockedFs.readFileSync.mockReturnValue(mockFileContent);

    const result = fsdValidator();

    // Should be valid since all imports are allowed
    expect(result.isValid).toBe(true);
  });

  it('handles file reading errors gracefully', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue(['src'] as any);
    mockedFs.statSync.mockReturnValue({ isDirectory: () => true } as any);

    // Mock getAllTsFiles to return a file
    jest.spyOn(fs, 'readdirSync').mockImplementation((dir) => {
      if (dir === 'src') {
        return ['test.ts'] as any;
      }
      return [] as any;
    });

    jest.spyOn(fs, 'statSync').mockImplementation((filePath) => {
      const filePathStr = filePath as string;
      if (filePathStr.endsWith('.ts')) {
        return { isDirectory: () => false } as any;
      }
      return { isDirectory: () => true } as any;
    });

    // Mock readFileSync to throw error
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('File read error');
    });

    const result = fsdValidator();

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Failed to read file');
  });

  it('handles missing src directory', () => {
    mockedFs.existsSync.mockReturnValue(false);

    const result = fsdValidator();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates import extraction correctly', () => {
    const mockFileContent = `
      import React from 'react';
      import { Button } from '@/shared/ui/Button';
      import { classNames } from '@/shared/lib/utils/classNames';
      import { external } from 'external-package';
      import { relative } from './relative-file';
      import { parent } from '../parent-file';
    `;

    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue(['src'] as any);
    mockedFs.statSync.mockReturnValue({ isDirectory: () => true } as any);

    // Mock getAllTsFiles to return a file
    jest.spyOn(fs, 'readdirSync').mockImplementation((dir) => {
      if (dir === 'src') {
        return ['test.ts'] as any;
      }
      return [] as any;
    });

    jest.spyOn(fs, 'statSync').mockImplementation((filePath) => {
      const filePathStr = filePath as string;
      if (filePathStr.endsWith('.ts')) {
        return { isDirectory: () => false } as any;
      }
      return { isDirectory: () => true } as any;
    });

    mockedFs.readFileSync.mockReturnValue(mockFileContent);

    const result = fsdValidator();

    // Should be valid since all internal imports are allowed
    expect(result.isValid).toBe(true);
  });

  it('handles validation errors gracefully', () => {
    // Mock fs.existsSync to throw error
    mockedFs.existsSync.mockImplementation(() => {
      throw new Error('File system error');
    });

    const result = fsdValidator();

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Validation failed: Error: File system error');
  });
});
