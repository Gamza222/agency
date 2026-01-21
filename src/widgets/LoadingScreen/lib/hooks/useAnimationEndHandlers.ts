import { useEffect, useRef, useState, Ref } from "react";
import { LoadingScreenMode } from "../../types/types";
import { EXIT_ANIMATION_DELAY_MS } from "../constants/animation.constants";

interface UseAnimationEndHandlersParams {
  mode: LoadingScreenMode;
  onAnimationComplete?: () => void;
  percentageHideAnimationName: string;
  slideOutRotateAnimationName: string;
  externalContainerRef?: Ref<HTMLDivElement>;
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
  externalContainerRef,
}: UseAnimationEndHandlersParams) => {
  const percentageRef = useRef<HTMLParagraphElement>(null);
  // Only create internal ref for DEFAULT mode (HOMEPAGE uses external ref)
  const internalContainerRef = useRef<HTMLDivElement>(null);
  const [exitAnimationStarted, setExitAnimationStarted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Use external ref if provided (HOMEPAGE mode), otherwise use internal (DEFAULT mode)
  const containerRef = externalContainerRef || internalContainerRef;

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
  // Note: For HOMEPAGE mode, externalContainerRef is provided but not used here
  useEffect(() => {
    // Only use internal ref for DEFAULT mode (HOMEPAGE doesn't need this listener)
    if (mode !== LoadingScreenMode.DEFAULT || !internalContainerRef.current)
      return;

    const handleExitEnd = (event: AnimationEvent) => {
      if (event.animationName === slideOutRotateAnimationName) {
        setIsHidden(true);
      }
    };

    const el = internalContainerRef.current;
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
