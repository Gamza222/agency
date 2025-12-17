import { cva } from './cva';

// Define a sample configuration for a test component (e.g., a badge)
const badgeVariants = cva({
  base: 'inline-flex items-center border rounded-full',
  variants: {
    variant: {
      primary: 'bg-blue-500 border-blue-600 text-white',
      secondary: 'bg-gray-200 border-gray-300 text-gray-800',
      destructive: 'bg-red-500 border-red-600 text-white',
    },
    size: {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-0.5 text-sm',
    },
    hasCloseButton: {
      true: 'pr-1',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      hasCloseButton: 'true',
      className: 'bg-blue-600', // Make primary with close button slightly darker
    },
  ],
  defaultVariants: {
    variant: 'secondary',
    size: 'md',
  },
});

describe('CVA (Class Variance Authority)', () => {
  it('should return only base classes when no props are provided', () => {
    const result = badgeVariants();
    expect(result).toContain('inline-flex');
    expect(result).toContain('rounded-full');
  });

  it('should apply default variant and size classes', () => {
    const result = badgeVariants();
    // Default variant is secondary
    expect(result).toContain('bg-gray-200');
    // Default size is md
    expect(result).toContain('text-sm');
  });

  it('should apply specified variant classes and override defaults', () => {
    const result = badgeVariants({ variant: 'primary' });
    // Should NOT have default class
    expect(result).not.toContain('bg-gray-200');
    // SHOULD have specified variant class
    expect(result).toContain('bg-blue-500');
  });

  it('should apply specified size classes', () => {
    const result = badgeVariants({ size: 'sm' });
    // Should NOT have default class
    expect(result).not.toContain('text-sm');
    // SHOULD have specified size class
    expect(result).toContain('text-xs');
  });

  it('should handle boolean variants correctly', () => {
    const result = badgeVariants({ hasCloseButton: true });
    expect(result).toContain('pr-1');
  });

  it('should apply compound variant classes when conditions are met', () => {
    const result = badgeVariants({ variant: 'primary', hasCloseButton: true });
    // It should have the standard primary class
    expect(result).toContain('bg-blue-500');
    // But it should ALSO have the compound variant class, which can be used to override
    expect(result).toContain('bg-blue-600');
  });

  it('should NOT apply compound variant classes when only one condition is met', () => {
    const result = badgeVariants({ variant: 'primary', hasCloseButton: false });
    // It should NOT have the compound class
    expect(result).not.toContain('bg-blue-600');
  });

  it('should handle all props together', () => {
    const result = badgeVariants({
      variant: 'destructive',
      size: 'sm',
      hasCloseButton: true,
    });

    expect(result).toContain('bg-red-500'); // variant
    expect(result).toContain('text-xs'); // size
    expect(result).toContain('pr-1'); // boolean variant
    expect(result).not.toContain('bg-blue-600'); // compound should not match
  });

  it('should return a clean array with no undefined or null values', () => {
    const result = badgeVariants({ variant: 'primary' });
    result.forEach((className) => {
      expect(className).not.toBeUndefined();
      expect(className).not.toBeNull();
      expect(typeof className).toBe('string');
    });
  });
});
