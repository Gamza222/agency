/**
 * Animation constants for AnimatedBackground
 * These values can be imported and used by other components to track animation state
 */

// Animation duration in milliseconds
export const ANIMATION_DURATION_MS = 2000; // 2 seconds

// Animation duration in seconds (for CSS)
export const ANIMATION_DURATION_S = ANIMATION_DURATION_MS / 1000;

// Starting position values (for CSS custom properties)
export const START_TRANSLATE_X = 0; // Horizontal: 0 = center
export const START_TRANSLATE_Y = 0.1; // Vertical: positive = down
export const START_ROTATION = 28; // Rotation in degrees
export const START_SCALE = 1.15; // Scale factor
export const START_OPACITY = 0; // Opacity: 0 = invisible

// Ending position values
export const END_TRANSLATE_X = 0; // Final horizontal position
export const END_TRANSLATE_Y = 0; // Final vertical position
export const END_ROTATION = 0; // Final rotation
export const END_SCALE = 1; // Final scale
export const END_OPACITY = 1; // Final opacity

// Easing function: cubic-bezier for fast start, slow end
export const EASING_CURVE = "cubic-bezier(0.2, 0, 0.3, 0.6)";
