import { useCallback, useEffect, useState } from "react";

/**
 * Hook to manage LoadingScreen animation state for pages using DEFAULT mode
 * Handles:
 * - Animation completion state
 * - Scroll blocking during animations
 * - Body attribute syncing for navbar
 *
 * @returns Object with animationsComplete state and handleAnimationComplete callback
 */
export const useLoadingScreenState = () => {
  const [animationsComplete, setAnimationsComplete] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setAnimationsComplete(true);
  }, []);

  // Block scroll while animations are running
  useEffect(() => {
    if (!animationsComplete) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [animationsComplete]);

  // Sync animation state to body for navbar
  useEffect(() => {
    document.body.setAttribute(
      "data-animations-complete",
      String(animationsComplete)
    );
    document.body.setAttribute("data-is-loading", String(!animationsComplete));
  }, [animationsComplete]);

  return {
    animationsComplete,
    handleAnimationComplete,
  };
};
