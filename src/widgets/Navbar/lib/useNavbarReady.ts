"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "./useIsMobile";
import {
  NAVBAR_ANIMATION,
  NAVBAR_LINKS,
} from "../model/types/constants/constants";

/**
 * Hook to track when navbar animations are fully complete
 * Returns boolean: true when all animations (brand, dividers, links/hamburger) are done
 *
 * Desktop: Brand → Dividers → Links (cascading)
 * Mobile: Brand → Hamburger
 */
export function useNavbarReady(): boolean {
  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Reset ready state when mobile/desktop changes
    setIsReady(false);

    // Calculate total animation duration based on mobile/desktop
    let totalDuration: number;

    if (isMobile) {
      // Mobile: Brand + Hamburger
      // Brand: BRAND_FADE_DURATION
      // Hamburger: starts at HAMBURGER_DELAY, duration = FLICKER_DURATION * FLICKER_COUNT
      const hamburgerStart = NAVBAR_ANIMATION.HAMBURGER_DELAY;
      const hamburgerDuration =
        NAVBAR_ANIMATION.FLICKER_DURATION * NAVBAR_ANIMATION.FLICKER_COUNT;
      totalDuration = hamburgerStart + hamburgerDuration;
    } else {
      // Desktop: Brand + Dividers + Last Link
      // Brand: BRAND_FADE_DURATION
      // Last divider finishes: BRAND_FADE_DURATION + (dividers-count * DIVIDER_DELAY) + DIVIDER_FADE_DURATION
      const dividersCount = NAVBAR_LINKS.length - 1;
      const dividersFinish =
        NAVBAR_ANIMATION.BRAND_FADE_DURATION +
        dividersCount * NAVBAR_ANIMATION.DIVIDER_DELAY +
        NAVBAR_ANIMATION.DIVIDER_FADE_DURATION;

      // Last link (index = NAVBAR_LINKS.length - 1)
      const lastLinkIndex = NAVBAR_LINKS.length - 1;
      const linkFlickerDuration = NAVBAR_ANIMATION.FLICKER_DURATION * 2; // 2 flicks per link
      const lastLinkDelay =
        dividersFinish +
        NAVBAR_ANIMATION.FLICKER_DURATION * 0.8 * lastLinkIndex;
      const lastLinkFinish = lastLinkDelay + linkFlickerDuration;

      totalDuration = lastLinkFinish;
    }

    // Set ready state after animations complete
    const timer = setTimeout(() => {
      setIsReady(true);
    }, totalDuration * 1000); // Convert to milliseconds

    return () => {
      clearTimeout(timer);
    };
  }, [isMobile]);

  return isReady;
}
