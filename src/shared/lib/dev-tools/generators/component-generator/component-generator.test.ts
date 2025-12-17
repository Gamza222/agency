import fs from 'fs';
import path from 'path';
import { componentGenerator } from './component-generator';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('componentGenerator', () => {
  const testDir = 'src/shared/ui/TestComponent';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock fs.existsSync to return false (directory doesn't exist)
    mockedFs.existsSync.mockReturnValue(false);

    // Mock fs.mkdirSync
    mockedFs.mkdirSync.mockImplementation(() => 'mocked');

    // Mock fs.writeFileSync
    mockedFs.writeFileSync.mockImplementation(() => undefined);
  });

  afterEach(() => {
    // Clean up any created files
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('generates component files successfully', () => {
    const config = {
      name: 'TestComponent',
      layer: 'shared' as const,
      type: 'ui' as const,
      description: 'Test component for validation',
    };

    expect(() => componentGenerator(config)).not.toThrow();

    // Verify directory creation
    expect(mockedFs.mkdirSync).toHaveBeenCalledWith(testDir, { recursive: true });

    // Verify file creation
    expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(4);

    // Check that all expected files are created
    const writeFileCalls = mockedFs.writeFileSync.mock.calls;
    const filePaths = writeFileCalls.map((call) => call[0]);

    expect(filePaths).toContain(path.join(testDir, 'TestComponent.tsx'));
    expect(filePaths).toContain(path.join(testDir, 'TestComponent.test.tsx'));
    expect(filePaths).toContain(path.join(testDir, 'TestComponent.stories.tsx'));
    expect(filePaths).toContain(path.join(testDir, 'index.ts'));
  });

  it('validates layer and type combinations for shared layer', () => {
    const validConfigs = [
      { name: 'Test', layer: 'shared' as const, type: 'ui' as const },
      { name: 'Test', layer: 'shared' as const, type: 'lib' as const },
      { name: 'Test', layer: 'shared' as const, type: 'model' as const },
    ];

    validConfigs.forEach((config) => {
      expect(() => componentGenerator(config)).not.toThrow();
    });

    const invalidConfigs = [{ name: 'Test', layer: 'shared' as const, type: 'api' as const }];

    invalidConfigs.forEach((config) => {
      expect(() => componentGenerator(config)).toThrow(
        'Shared layer only supports ui, lib, or model types'
      );
    });
  });

  it('validates layer and type combinations for widgets layer', () => {
    const validConfigs = [{ name: 'Test', layer: 'widgets' as const, type: 'ui' as const }];

    validConfigs.forEach((config) => {
      expect(() => componentGenerator(config)).not.toThrow();
    });

    const invalidConfigs = [
      { name: 'Test', layer: 'widgets' as const, type: 'lib' as const },
      { name: 'Test', layer: 'widgets' as const, type: 'model' as const },
      { name: 'Test', layer: 'widgets' as const, type: 'api' as const },
    ];

    invalidConfigs.forEach((config) => {
      expect(() => componentGenerator(config)).toThrow('Widgets layer only supports ui type');
    });
  });

  it('validates layer and type combinations for infrastructure layer', () => {
    const validConfigs = [
      { name: 'Test', layer: 'infrastructure' as const, type: 'lib' as const },
      { name: 'Test', layer: 'infrastructure' as const, type: 'api' as const },
    ];

    validConfigs.forEach((config) => {
      expect(() => componentGenerator(config)).not.toThrow();
    });

    const invalidConfigs = [
      { name: 'Test', layer: 'infrastructure' as const, type: 'ui' as const },
      { name: 'Test', layer: 'infrastructure' as const, type: 'model' as const },
    ];

    invalidConfigs.forEach((config) => {
      expect(() => componentGenerator(config)).toThrow(
        'Infrastructure layer only supports lib or api types'
      );
    });
  });

  it('generates correct component content', () => {
    const config = {
      name: 'TestComponent',
      layer: 'shared' as const,
      type: 'ui' as const,
      description: 'Test component description',
    };

    componentGenerator(config);

    // Get the component file content
    const componentCall = mockedFs.writeFileSync.mock.calls.find((call) =>
      String(call[0]).endsWith('TestComponent.tsx')
    );

    expect(componentCall).toBeDefined();
    const componentContent = componentCall![1] as string;

    // Check for key elements in the generated component
    expect(componentContent).toContain("import React from 'react';");
    expect(componentContent).toContain(
      "import { classNames } from '@/shared/lib/utils/classNames';"
    );
    expect(componentContent).toContain('export interface TestComponentProps');
    expect(componentContent).toContain('export function TestComponent');
    expect(componentContent).toContain('Test component description');
    expect(componentContent).toContain("className={classNames('testcomponent', {}, [className])}");
  });

  it('generates correct test content', () => {
    const config = {
      name: 'TestComponent',
      layer: 'shared' as const,
      type: 'ui' as const,
      description: 'Test component description',
    };

    componentGenerator(config);

    // Get the test file content
    const testCall = mockedFs.writeFileSync.mock.calls.find((call) =>
      String(call[0]).endsWith('TestComponent.test.tsx')
    );

    expect(testCall).toBeDefined();
    const testContent = testCall![1] as string;

    // Check for key elements in the generated test
    expect(testContent).toContain("import { render, screen } from '@testing-library/react';");
    expect(testContent).toContain("import { TestComponent } from './TestComponent';");
    expect(testContent).toContain("describe('TestComponent', () => {");
    expect(testContent).toContain("it('renders without crashing', () => {");
    expect(testContent).toContain("it('applies custom className', () => {");
    expect(testContent).toContain("it('renders children correctly', () => {");
  });

  it('generates correct stories content', () => {
    const config = {
      name: 'TestComponent',
      layer: 'shared' as const,
      type: 'ui' as const,
      description: 'Test component description',
    };

    componentGenerator(config);

    // Get the stories file content
    const storiesCall = mockedFs.writeFileSync.mock.calls.find((call) =>
      String(call[0]).endsWith('TestComponent.stories.tsx')
    );

    expect(storiesCall).toBeDefined();
    const storiesContent = storiesCall![1] as string;

    // Check for key elements in the generated stories
    expect(storiesContent).toContain("import type { Meta, StoryObj } from '@storybook/react';");
    expect(storiesContent).toContain("import { TestComponent } from './TestComponent';");
    expect(storiesContent).toContain('const meta: Meta<typeof TestComponent>');
    expect(storiesContent).toContain('export const Default: Story');
    expect(storiesContent).toContain('export const WithCustomContent: Story');
    expect(storiesContent).toContain('export const WithCustomClassName: Story');
  });

  it('generates correct index content', () => {
    const config = {
      name: 'TestComponent',
      layer: 'shared' as const,
      type: 'ui' as const,
      description: 'Test component description',
    };

    componentGenerator(config);

    // Get the index file content
    const indexCall = mockedFs.writeFileSync.mock.calls.find((call) =>
      String(call[0]).endsWith('index.ts')
    );

    expect(indexCall).toBeDefined();
    const indexContent = indexCall![1] as string;

    // Check for key elements in the generated index
    expect(indexContent).toContain("export { TestComponent } from './TestComponent';");
    expect(indexContent).toContain("export type { TestComponentProps } from './TestComponent';");
  });

  it('handles missing description', () => {
    const config = {
      name: 'TestComponent',
      layer: 'shared' as const,
      type: 'ui' as const,
    };

    expect(() => componentGenerator(config)).not.toThrow();

    // Check that default description is used
    const componentCall = mockedFs.writeFileSync.mock.calls.find((call) =>
      String(call[0]).endsWith('TestComponent.tsx')
    );

    const componentContent = componentCall![1] as string;
    expect(componentContent).toContain('TestComponent component');
  });
});
