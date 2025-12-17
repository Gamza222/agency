import * as fs from 'fs';
import path from 'path';

export interface ComponentConfig {
  name: string;
  layer: 'shared' | 'widgets' | 'infrastructure';
  type: 'ui' | 'lib' | 'model' | 'api';
  description?: string;
}

export function componentGenerator(config: ComponentConfig) {
  const { name, layer, type, description = '' } = config;

  // Validate layer and type combination
  if (layer === 'shared' && !['ui', 'lib', 'model'].includes(type)) {
    throw new Error('Shared layer only supports ui, lib, or model types');
  }

  if (layer === 'widgets' && type !== 'ui') {
    throw new Error('Widgets layer only supports ui type');
  }

  if (layer === 'infrastructure' && !['lib', 'api'].includes(type)) {
    throw new Error('Infrastructure layer only supports lib or api types');
  }

  const componentDir = path.join('src', layer, type, name);

  // Create directory if it doesn't exist
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  // Generate component file
  const componentContent = generateComponentFile(name, description);
  fs.writeFileSync(path.join(componentDir, `${name}.tsx`), componentContent);

  // Generate test file
  const testContent = generateTestFile(name);
  fs.writeFileSync(path.join(componentDir, `${name}.test.tsx`), testContent);

  // Generate stories file
  const storiesContent = generateStoriesFile(name, description);
  fs.writeFileSync(path.join(componentDir, `${name}.stories.tsx`), storiesContent);

  // Generate index file
  const indexContent = generateIndexFile(name);
  fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent);

  // Component ${name} generated successfully in ${componentDir}
  // Files created:
  //   - ${name}.tsx
  //   - ${name}.test.tsx
  //   - ${name}.stories.tsx
  //   - index.ts
}

function generateComponentFile(name: string, description: string): string {
  return `import React from 'react';
import { classNames } from '@/shared/lib/utils/classNames';

export interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
  // Add your props here
}

/**
 * ${description || `${name} component`}
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ${name}({ className, children, ...props }: ${name}Props) {
  return (
    <div 
      className={classNames('${name.toLowerCase()}', {}, [className])}
      {...props}
    >
      {children}
    </div>
  );
}
`;
}

function generateTestFile(name: string): string {
  return `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name}>Test content</${name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<${name} className="custom-class">Test</${name}>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class');
    expect(element).toHaveClass('${name.toLowerCase()}');
  });

  it('renders children correctly', () => {
    render(
      <${name}>
        <span>Child 1</span>
        <span>Child 2</span>
      </${name}>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
`;
}

function generateStoriesFile(name: string, description: string): string {
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: '${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${description || `${name} component`}',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS class',
    },
    children: {
      control: 'text',
      description: 'Content to render inside the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default ${name}',
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div>
        <h3>Custom Content</h3>
        <p>This is custom content inside ${name}</p>
      </div>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'custom-${name.toLowerCase()}-class',
    children: 'Styled ${name}',
  },
};
`;
}

function generateIndexFile(name: string): string {
  return `export { ${name} } from './${name}';
export type { ${name}Props } from './${name}';
`;
}
