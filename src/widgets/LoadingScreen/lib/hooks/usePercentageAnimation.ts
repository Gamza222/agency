import { useEffect, useRef, useState } from "react";
import { PERCENTAGE_ANIMATION_OFFSET_MS } from "../constants/animation.constants";

interface UsePercentageAnimationParams {
  enabled: boolean;
  duration: number;
  strokeDuration: number;
  strokeDelay: number;
  flickerDuration: number;
}

/**
 * Hook to animate percentage counter from 0 to 100
 * Returns ref for progress element and completion state
 */
export const usePercentageAnimation = ({
  enabled,
  duration,
  strokeDuration,
  strokeDelay,
  flickerDuration,
}: UsePercentageAnimationParams) => {
  const progressRef = useRef<HTMLParagraphElement>(null);
  const [percentageComplete, setPercentageComplete] = useState(false);

  useEffect(() => {
    if (!enabled || !progressRef.current) return;

    const totalDuration =
      duration +
      strokeDuration +
      strokeDelay -
      flickerDuration * 6000 +
      PERCENTAGE_ANIMATION_OFFSET_MS;
    const startTime = Date.now();
    let frameId: number;

    const easeOutQuad = (t: number): number => t * (2 - t);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalDuration);
      const value = Math.floor(easeOutQuad(progress) * 100);

      if (progressRef.current) {
        progressRef.current.textContent = String(value);
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        if (progressRef.current) progressRef.current.textContent = "100";
        setPercentageComplete(true);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, duration, strokeDuration, strokeDelay, flickerDuration]);

  return { progressRef, percentageComplete };
};
