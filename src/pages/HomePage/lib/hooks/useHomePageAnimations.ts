import { useEffect, MutableRefObject } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";

interface UseHomePageAnimationsParams {
  animationsComplete: boolean;
  loadingScreenRef: MutableRefObject<HTMLElement | null>;
}

/**
 * Hook to manage HomePage animation-related side effects:
 * - Scroll lock while animations are running (works with ScrollSmoother)
 * - Sync animation state to body attributes for navbar
 * - Cache element reference for scroll transform
 */
export const useHomePageAnimations = ({
  animationsComplete,
  loadingScreenRef,
}: UseHomePageAnimationsParams) => {
  // Disable scroll while animations are running
  // Works with both native scroll and ScrollSmoother
  useEffect(() => {
    if (!animationsComplete) {
      // Lock scroll using ScrollSmoother if available, otherwise use overflow
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.paused(true);
      } else {
        // Fallback for when ScrollSmoother isn't initialized yet
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
    } else {
      // Unlock scroll
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.paused(false);
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }

    return () => {
      // Cleanup: ensure scroll is unlocked
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.paused(false);
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
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

  // Cache element reference for transform application
  useEffect(() => {
    if (animationsComplete && !loadingScreenRef.current) {
      loadingScreenRef.current = document.querySelector(
        '[class*="loadingScreen_scrollAnimated"]'
      ) as HTMLElement | null;
    }
  }, [animationsComplete, loadingScreenRef]);
};
