/**
 * LoadingScreen display mode
 * - HOMEPAGE: Relative position, scroll-controlled exit animation
 * - DEFAULT: Fixed position, auto exit animation after loading
 */
export enum LoadingScreenMode {
  HOMEPAGE = "homepage",
  DEFAULT = "default",
}

export interface LoadingScreenProps {
  className?: string;
  /** Loading bar animation duration in ms */
  duration?: number;
  /** Stroke shrink animation duration in ms */
  strokeDuration?: number;
  /** Delay before stroke animation in ms */
  strokeDelay?: number;
  /** Flicker animation duration in seconds */
  flickerDuration?: number;
  /** Called when all loading animations complete */
  onAnimationComplete?: () => void;
  /** Whether parent animations are complete (enables scroll in HOMEPAGE mode) */
  animationsComplete?: boolean;
  /** Display mode */
  mode?: LoadingScreenMode;
  /** Scroll progress (0-1) for HOMEPAGE mode exit transform */
  scrollProgress?: number;
}
