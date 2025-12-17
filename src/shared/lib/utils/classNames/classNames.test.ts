import { classNames } from './classNames';

describe('classNames utility', () => {
  describe('Basic functionality', () => {
    it('should return base class when called with string only', () => {
      expect(classNames('btn')).toBe('btn');
    });

    it('should return base class with empty mods and additional arrays', () => {
      expect(classNames('btn', {}, [])).toBe('btn');
    });

    it('should handle empty base class', () => {
      expect(classNames('', {}, ['btn-primary'])).toBe('btn-primary');
    });

    it('should handle all empty parameters', () => {
      expect(classNames('', {}, [])).toBe('');
    });

    it('should filter out falsy values', () => {
      expect(classNames('btn', {}, ['btn-primary', '', null, undefined, 'btn-lg'])).toBe(
        'btn btn-primary btn-lg'
      );
    });
  });

  describe('Conditional classes (mods parameter)', () => {
    it('should include classes for truthy values', () => {
      expect(classNames('btn', { 'btn-primary': true, 'btn-disabled': false })).toBe(
        'btn btn-primary'
      );
    });

    it('should handle string values as truthy', () => {
      expect(classNames('btn', { 'btn-primary': 'active', 'btn-disabled': '' })).toBe(
        'btn btn-primary'
      );
    });

    it('should handle number values correctly', () => {
      expect(classNames('btn', { 'btn-primary': 1, 'btn-disabled': 0, 'btn-large': -1 })).toBe(
        'btn btn-primary btn-large'
      );
    });

    it('should handle undefined and null values as falsy', () => {
      expect(
        classNames('btn', { 'btn-primary': undefined, 'btn-secondary': null, 'btn-tertiary': true })
      ).toBe('btn btn-tertiary');
    });

    it('should handle empty mods object', () => {
      expect(classNames('btn', {})).toBe('btn');
    });

    it('should handle complex boolean expressions', () => {
      const isActive = true;
      const isDisabled = false;
      const isLoading = true;
      const user = { role: 'admin' };

      expect(
        classNames('btn', {
          'btn-active': isActive,
          'btn-disabled': isDisabled,
          'btn-loading': isLoading,
          'btn-admin': user.role === 'admin',
          'btn-user': user.role === 'user',
        })
      ).toBe('btn btn-active btn-loading btn-admin');
    });
  });

  describe('Additional classes array', () => {
    it('should handle array of strings', () => {
      expect(classNames('btn', {}, ['btn-primary', 'btn-lg'])).toBe('btn btn-primary btn-lg');
    });

    it('should filter out falsy values from additional array', () => {
      expect(classNames('btn', {}, ['btn-primary', undefined, null, '', 'btn-lg'])).toBe(
        'btn btn-primary btn-lg'
      );
    });

    it('should handle empty additional array', () => {
      expect(classNames('btn', {}, [])).toBe('btn');
    });

    it('should handle conditional values in additional array', () => {
      const size = 'lg';
      const variant = 'primary';
      const disabled = false;

      expect(
        classNames('btn', {}, [
          size && `btn-${size}`,
          variant && `btn-${variant}`,
          disabled && 'btn-disabled',
          'btn-rounded',
        ])
      ).toBe('btn btn-lg btn-primary btn-rounded');
    });
  });

  describe('Combined usage patterns', () => {
    it('should combine base, mods, and additional correctly', () => {
      expect(
        classNames('btn', { 'btn-primary': true, 'btn-disabled': false }, ['btn-lg', 'btn-rounded'])
      ).toBe('btn btn-lg btn-rounded btn-primary');
    });

    it('should handle real-world component scenario', () => {
      const variant = 'primary' as 'primary' | 'secondary';
      const size = 'lg';
      const isLoading = true;
      const isDisabled = false;
      const fullWidth = true;

      expect(
        classNames(
          'button',
          {
            'button--primary': variant === 'primary',
            'button--secondary': variant === 'secondary',
            'button--loading': isLoading,
            'button--disabled': isDisabled,
            'button--full-width': fullWidth,
          },
          [size && `button--${size}`, 'button--rounded']
        )
      ).toBe(
        'button button--lg button--rounded button--primary button--loading button--full-width'
      );
    });

    it('should handle complex component with multiple conditions', () => {
      const theme = 'dark' as 'dark' | 'light';
      const status = 'success' as 'success' | 'error';
      const features = ['clickable', 'hoverable'];

      expect(
        classNames(
          'card',
          {
            'card--dark': theme === 'dark',
            'card--light': theme === 'light',
            'card--success': status === 'success',
            'card--error': status === 'error',
            'card--clickable': features.includes('clickable'),
            'card--hoverable': features.includes('hoverable'),
          },
          [`card--${theme}`, 'card--elevated']
        )
      ).toBe(
        'card card--dark card--elevated card--dark card--success card--clickable card--hoverable'
      );
    });
  });

  describe('CSS Modules integration', () => {
    it('should work with CSS modules object', () => {
      const styles = {
        button: 'button_abc123',
        primary: 'primary_def456',
        loading: 'loading_ghi789',
        disabled: 'disabled_jkl012',
      };

      expect(
        classNames(
          'btn',
          {
            [styles.primary]: true,
            [styles.loading]: true,
            [styles.disabled]: false,
          },
          [styles.button, 'custom-class']
        )
      ).toBe('btn button_abc123 custom-class primary_def456 loading_ghi789');
    });

    it('should handle CSS modules with dynamic keys', () => {
      const styles = {
        button: 'button_abc123',
        primary: 'primary_def456',
        secondary: 'secondary_ghi789',
        large: 'large_jkl012',
      };

      const variant = 'primary';
      const size = 'large';

      expect(
        classNames(
          'btn',
          {
            [styles[variant]]: true,
            [styles[size]]: true,
          },
          [styles.button]
        )
      ).toBe('btn button_abc123 primary_def456 large_jkl012');
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle special characters in class names', () => {
      expect(classNames('btn-primary_123', {}, ['btn--modifier', 'btn:hover', 'btn@media'])).toBe(
        'btn-primary_123 btn--modifier btn:hover btn@media'
      );
    });

    it('should handle empty string base class', () => {
      expect(classNames('', { active: true }, ['btn', 'primary'])).toBe('btn primary active');
    });

    it('should handle large number of classes', () => {
      const mods = Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [`class-${i}`, i % 2 === 0])
      );
      const additional = Array.from({ length: 10 }, (_, i) => `additional-${i}`);

      const result = classNames('base', mods, additional);
      const classes = result.split(' ');

      expect(result).toContain('base');
      expect(result).toContain('additional-0');
      expect(result).toContain('class-0');
      expect(classes).not.toContain('class-1'); // Use exact match instead of substring
      expect(classes).toContain('class-2');
      expect(classes).not.toContain('class-3');
    });

    it('should maintain consistent class order', () => {
      // Order should be: base, additional, mods
      const result = classNames('base', { 'mod-z': true, 'mod-a': true }, [
        'additional-z',
        'additional-a',
      ]);
      const classes = result.split(' ');

      expect(classes[0]).toBe('base');
      expect(classes[1]).toBe('additional-z');
      expect(classes[2]).toBe('additional-a');
      // mods order might vary due to Object.entries
    });

    it('should handle duplicate class names gracefully', () => {
      // Note: This utility doesn't dedupe, which is acceptable behavior
      expect(classNames('btn', { btn: true }, ['btn'])).toBe('btn btn btn');
    });
  });

  describe('TypeScript type safety', () => {
    it('should handle different value types in mods', () => {
      const mods = {
        string: 'truthy',
        emptyString: '',
        number: 42,
        zero: 0,
        boolean: true,
        booleanFalse: false,
        undefined,
        null: null,
      };

      expect(classNames('base', mods)).toBe('base string number boolean');
    });

    it('should handle undefined values throughout', () => {
      expect(classNames('btn', { active: undefined }, [undefined, 'valid', undefined])).toBe(
        'btn valid'
      );
    });
  });
});
