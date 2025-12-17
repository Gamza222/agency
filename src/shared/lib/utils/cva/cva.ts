/**
 * @file This file contains a Class Variance Authority (CVA) utility.
 * CVA is a design pattern used to create a consistent and type-safe system for
 * building UI components with multiple style variants. This implementation is a
 * higher-order function that acts as a factory for variant-to-class-name logic.
 */

type VariantValue = string | boolean | null | undefined;

/**
 * @example { primary: 'button-primary', secondary: 'button-secondary' }
 */
type VariantConfig = Record<string, string>;
type Variants = Record<string, VariantConfig>;

/**
 * Defines the shape of the main configuration object for the `cva` function.
 * The generic `<V extends Variants>` creates a type-safe link between `variants`,
 * `defaultVariants`, and `compoundVariants`, ensuring they all use the same keys.
 */
type CvaConfig<V extends Variants> = {
  /** The foundational CSS classes applied to every instance. */
  base?: string | string[];

  /** The core dictionary of all possible style variations. */
  variants?: V;

  /** Fallback values to use if a variant prop is not provided. */
  defaultVariants?: { [K in keyof V]?: keyof V[K] };

  /** Rules for applying styles based on a *combination* of other variants. */
  compoundVariants?: Array<
    {
      [K in keyof V]?: keyof V[K] | Array<keyof V[K]>;
    } & { className: string }
  >;
};

/**
 * A factory function that creates a variant-resolver function based on a given config.
 * @param config The configuration object that defines all styling rules.
 * @returns A new function that takes component props and returns an array of class names.
 */
export const cva = <V extends Variants>(config: CvaConfig<V>) => {
  return (props?: { [K in keyof V]?: VariantValue }): string[] => {
    const { base, variants, defaultVariants, compoundVariants } = config;
    const resolvedProps = { ...defaultVariants, ...props };

    // Resolve standard variants based on the provided props.
    const variantClasses = variants
      ? Object.keys(variants).map((variantKey) => {
          const variantValue = resolvedProps[variantKey as keyof typeof resolvedProps];
          if (variantValue === null || variantValue === undefined) return undefined;
          return variants?.[variantKey]?.[String(variantValue)];
        })
      : [];

    // Resolve compound variants for handling style exceptions.
    const compoundVariantClasses = compoundVariants
      ? compoundVariants.map((compoundVariant) => {
          const { className, ...conditions } = compoundVariant;
          const isMatch = Object.entries(conditions).every(([key, value]) => {
            const propValue = resolvedProps[key as keyof typeof resolvedProps];
            return Array.isArray(value)
              ? value.includes(String(propValue))
              : String(propValue) === String(value);
          });
          return isMatch ? className : undefined;
        })
      : [];

    return [...(Array.isArray(base) ? base : [base]), ...variantClasses, ...compoundVariantClasses]
      .filter(Boolean)
      .flatMap((item) => {
        if (!item) return [];
        return Array.isArray(item) ? item : item.split(' ');
      }) as string[];
  };
};
