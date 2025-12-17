// Removed unused React import
import { render, screen } from '@testing-library/react';
import { Text } from './Text';
import { TextAlign, TextSize, TextVariant } from './Text.types';

describe('Text', () => {
  test('renders with default props', () => {
    render(<Text>Hello World</Text>);
    const textElement = screen.getByText(/hello world/i);
    expect(textElement).toBeInTheDocument();
    expect(textElement.tagName).toBe('P'); // Default 'as' is 'p'
  });

  test('renders with a different tag', () => {
    render(<Text as="h1">Heading</Text>);
    const textElement = screen.getByRole('heading', { name: /heading/i });
    expect(textElement.tagName).toBe('H1');
  });

  test('applies variant, size, and align classes', () => {
    render(
      <Text variant={TextVariant.SECONDARY} size={TextSize.LG} align={TextAlign.CENTER}>
        Styled Text
      </Text>
    );
    const textElement = screen.getByText(/styled text/i);
    // Test for CSS module classes instead of Tailwind classes
    expect(textElement).toHaveClass('secondary', 'lg', 'center');
  });

  test('applies custom className', () => {
    render(<Text className="my-custom-class">Custom</Text>);
    const textElement = screen.getByText(/custom/i);
    expect(textElement).toHaveClass('my-custom-class');
  });
});
