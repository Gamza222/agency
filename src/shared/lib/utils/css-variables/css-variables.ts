/**
 * Utility functions for reading CSS custom properties (CSS variables)
 */

/**
 * Gets a CSS custom property value as a number (parses pixel values)
 * @param propertyName - The CSS variable name (e.g., "--breakpoint-mobile")
 * @param fallback - Fallback value if variable is not found or cannot be parsed
 * @returns The numeric value in pixels, or fallback if unavailable
 */
export const getCssVariableAsNumber = (
  propertyName: string,
  fallback: number
): number => {
  if (typeof window === "undefined") return fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();

  // Parse "1020px" to 1020
  const numericValue = parseInt(value, 10);
  return isNaN(numericValue) ? fallback : numericValue;
};

/**
 * Gets a CSS custom property value as a string
 * @param propertyName - The CSS variable name (e.g., "--color-primary")
 * @param fallback - Fallback value if variable is not found
 * @returns The CSS variable value or fallback
 */
export const getCssVariable = (
  propertyName: string,
  fallback: string = ""
): string => {
  if (typeof window === "undefined") return fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();

  return value || fallback;
};
