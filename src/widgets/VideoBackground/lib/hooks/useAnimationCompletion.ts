import { useEffect, useRef } from "react";
import {
  ANIMATION_DURATION_MS,
  ANIMATION_COMPLETE_OFFSET_MS,
} from "../constants";

interface UseAnimationCompletionParams {
  animationStarted: boolean;
  onAnimationComplete?: () => void;
}

/**
 * Hook to signal animation completion
 * Calls onAnimationComplete slightly before animation ends for smoother UX
 */
export const useAnimationCompletion = ({
  animationStarted,
  onAnimationComplete,
}: UseAnimationCompletionParams) => {
  const didComplete = useRef(false);

  useEffect(() => {
    if (!animationStarted) return;

    const timer = setTimeout(() => {
      if (!didComplete.current) {
        didComplete.current = true;
        onAnimationComplete?.();
      }
    }, ANIMATION_DURATION_MS - ANIMATION_COMPLETE_OFFSET_MS);

    return () => clearTimeout(timer);
  }, [animationStarted, onAnimationComplete]);
};
