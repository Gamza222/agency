import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';
import { TextAlign, TextSize, TextVariant } from './Text.types';

const meta = {
  title: 'Shared/UI/Text',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible text component with various sizes, variants, and alignment options.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.values(TextVariant),
      description: 'Text color variant',
    },
    size: {
      control: 'select',
      options: Object.values(TextSize),
      description: 'Text size',
    },
    align: {
      control: 'select',
      options: Object.values(TextAlign),
      description: 'Text alignment',
    },
    children: {
      control: 'text',
      description: 'Text content',
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML element to render',
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: TextVariant.PRIMARY,
    children: 'Primary text content',
  },
};

export const Secondary: Story = {
  args: {
    variant: TextVariant.SECONDARY,
    children: 'Secondary text content',
  },
};

export const Muted: Story = {
  args: {
    variant: TextVariant.SECONDARY,
    children: 'Muted text content',
  },
};

export const Small: Story = {
  args: {
    size: TextSize.SM,
    children: 'Small text content',
  },
};

export const Medium: Story = {
  args: {
    size: TextSize.MD,
    children: 'Medium text content',
  },
};

export const Large: Story = {
  args: {
    size: TextSize.LG,
    children: 'Large text content',
  },
};

export const Center: Story = {
  args: {
    align: TextAlign.CENTER,
    children: 'Centered text content',
  },
};

export const Right: Story = {
  args: {
    align: TextAlign.RIGHT,
    children: 'Right-aligned text content',
  },
};

export const Heading: Story = {
  args: {
    as: 'h1',
    size: TextSize.LG,
    children: 'Heading Text',
  },
};
