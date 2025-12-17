import type { Meta, StoryObj } from '@storybook/react';
import {
  CardLoadingFallback,
  ComponentLoadingFallback,
  DefaultSuspenseFallback,
  InlineLoadingFallback,
  PageLoadingFallback,
} from './fallbacks';
import { ComponentHeight, LoadingSize } from '@/infrastructure/suspense/types/suspenseEnums';
import { Text, TextSize } from '@/shared/ui/Text';
// import { Button, ButtonSize, ButtonVariant } from '@/shared/ui/Button';

const meta = {
  title: 'Infrastructure/Suspense/Fallbacks',
  component: ComponentLoadingFallback,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Loading fallback components for Suspense boundaries and lazy loading.',
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Loading text to display',
    },
    size: {
      control: 'select',
      options: Object.values(LoadingSize),
      description: 'Size of the loading indicator',
    },
    height: {
      control: 'select',
      options: Object.values(ComponentHeight),
      description: 'Height of the loading container',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ComponentLoadingFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComponentLoading: Story = {
  args: {
    text: 'Loading component...',
    size: LoadingSize.MEDIUM,
    height: ComponentHeight.MEDIUM,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard component loading fallback with customizable text and size.',
      },
    },
  },
};

export const PageLoading: Story = {
  render: () => <PageLoadingFallback text="Loading page..." />,
  parameters: {
    docs: {
      description: {
        story: 'Full page loading fallback for page-level lazy loading.',
      },
    },
  },
};

export const InlineLoading: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Text size={TextSize.SM}>Processing</Text>
      <InlineLoadingFallback text="Processing..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline loading fallback for small loading states within content.',
      },
    },
  },
};

export const CardLoading: Story = {
  render: () => <CardLoadingFallback className="custom-padding" />,
  parameters: {
    docs: {
      description: {
        story: 'Card-style loading fallback for card components.',
      },
    },
  },
};

export const DefaultSuspense: Story = {
  render: () => <DefaultSuspenseFallback />,
  parameters: {
    docs: {
      description: {
        story: 'Default suspense fallback with minimal styling.',
      },
    },
  },
};
