import { useEffect, useRef, useState } from "react";
import { LoadingScreenMode } from "../../types/types";
import { EXIT_ANIMATION_DELAY_MS } from "../constants/animation.constants";

interface UseAnimationEndHandlersParams {
  mode: LoadingScreenMode;
  onAnimationComplete?: () => void;
  percentageHideAnimationName: string;
  slideOutRotateAnimationName: string;
}

/**
 * Hook to handle animation end events for LoadingScreen
 * Manages percentage hide and exit animations
 */
export const useAnimationEndHandlers = ({
  mode,
  onAnimationComplete,
  percentageHideAnimationName,
  slideOutRotateAnimationName,
}: UseAnimationEndHandlersParams) => {
  const percentageRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [exitAnimationStarted, setExitAnimationStarted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Handle percentage hide animation end
  useEffect(() => {
    if (!percentageRef.current) return;

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === percentageHideAnimationName) {
        // In both modes, call onAnimationComplete immediately when percentage hide ends
        // This enables events (scroll, navbar) immediately
        onAnimationComplete?.();

        // In DEFAULT mode, start exit animation after a brief delay
        if (mode === LoadingScreenMode.DEFAULT) {
          setTimeout(
            () => setExitAnimationStarted(true),
            EXIT_ANIMATION_DELAY_MS
          );
        }
      }
    };

    const el = percentageRef.current;
    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
  }, [mode, onAnimationComplete, percentageHideAnimationName]);

  // Handle exit animation end (DEFAULT mode only)
  // This only hides the component after exit animation completes
  // Events are already enabled from percentage hide animation end
  useEffect(() => {
    if (!containerRef.current || mode !== LoadingScreenMode.DEFAULT) return;

    const handleExitEnd = (event: AnimationEvent) => {
      if (event.animationName === slideOutRotateAnimationName) {
        setIsHidden(true);
      }
    };

    const el = containerRef.current;
    el.addEventListener("animationend", handleExitEnd);
    return () => el.removeEventListener("animationend", handleExitEnd);
  }, [mode, slideOutRotateAnimationName]);

  return {
    percentageRef,
    containerRef,
    exitAnimationStarted,
    isHidden,
  };
};
