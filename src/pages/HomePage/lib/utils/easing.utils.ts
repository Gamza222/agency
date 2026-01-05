/**
 * Easing functions for scroll-based animations
 * These functions transform linear progress (0-1) into eased progress
 */

/**
 * Ease-in quadratic: slow start, fast end
 * @param t - Progress value from 0 to 1
 * @returns Eased progress value
 */
export const easeInQuad = (t: number): number => t * t;

/**
 * Ease-out quadratic: fast start, slow end
 * @param t - Progress value from 0 to 1
 * @returns Eased progress value
 */
export const easeOutQuad = (t: number): number => t * (2 - t);

/**
 * Ease-in-out quadratic: slow start and end, fast middle
 * @param t - Progress value from 0 to 1
 * @returns Eased progress value
 */
export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

/**
 * Ease-in cubic: slower start than quadratic
 * @param t - Progress value from 0 to 1
 * @returns Eased progress value
 */
export const easeInCubic = (t: number): number => t * t * t;

/**
 * Ease-out cubic: slower end than quadratic
 * @param t - Progress value from 0 to 1
 * @returns Eased progress value
 */
export const easeOutCubic = (t: number): number => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

/**
 * Custom piecewise easing: slow for most of scroll, then aggressive acceleration at the end
 * - At 90% scroll → ~65% transform (slow phase)
 * - Last 10% scroll → accelerates to 100% transform (fast phase)
 *
 * @param t - Progress value from 0 to 1
 * @param threshold - When fast phase starts (default: 0.9 = 90%)
 * @param slowPhaseMax - Transform value at threshold (default: 0.65 = 65%)
 * @param fastPhasePower - Power for fast phase acceleration (default: 3 = cubic)
 * @returns Eased progress value
 */
export const easeSlowThenFast = (
  t: number,
  threshold: number = 0.8,
  slowPhaseMax: number = 0.65,
  fastPhasePower: number = 3
): number => {
  if (t < threshold) {
    // Slow phase: map 0-threshold scroll → 0-slowPhaseMax transform
    return (t / threshold) * slowPhaseMax;
  } else {
    // Fast phase: map threshold-1 scroll → slowPhaseMax-1 transform
    const fastProgress = (t - threshold) / (1 - threshold);
    const fastPhaseRange = 1 - slowPhaseMax;
    return (
      slowPhaseMax + Math.pow(fastProgress, fastPhasePower) * fastPhaseRange
    );
  }
};
