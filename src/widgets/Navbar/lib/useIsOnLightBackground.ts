"use client";

import { useState, useEffect, useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { NAVBAR_LINKS } from "../model/types/constants/constants";

export function useIsOnLightBackground(): boolean {
  const [isOnLightBackground, setIsOnLightBackground] = useState(true);
  const checkStateRef = useRef<() => void>();
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const logoHeightRef = useRef<number>(0);

  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;

    // Get logo height directly from CSS variable
    // This automatically handles any unit (px, rem, vw, etc.)
    const getLogoHeight = (): number => {
      const logoHeight = getComputedStyle(document.documentElement)
        .getPropertyValue("--logo-height")
        .trim();

      if (!logoHeight) return 0;

      // Parse value - handles rem, px, vw, vh, etc.
      const match = logoHeight.match(/^([\d.]+)(rem|px|vw|vh)$/);
      if (!match) return 0;

      const value = parseFloat(match[1]);
      const unit = match[2];

      let pixels = 0;
      if (unit === "rem") {
        pixels = value * 16; // Assuming 16px base
      } else if (unit === "px") {
        pixels = value;
      } else if (unit === "vw") {
        pixels = (value / 100) * window.innerWidth;
      } else if (unit === "vh") {
        pixels = (value / 100) * window.innerHeight;
      }
      console.log(pixels);

      return pixels; // Return full height, not half
    };

    // Update logo height (needed on resize for vw/vh units)
    const updateLogoHeight = () => {
      logoHeightRef.current = getLogoHeight();
    };

    // Single function that checks the current state - THE SOURCE OF TRUTH
    const checkState = () => {
      const promobgElement = document.getElementById("promobg");
      if (!promobgElement) return;

      const scrollY = smoother.scrollTop();
      const logoHeight = logoHeightRef.current;

      // At top - always light
      if (scrollY < 50) {
        setIsOnLightBackground(true);
        return;
      }

      // Check promobg position first
      // Trigger EARLIER: when promobg top reaches (viewport top - logo height)
      // getBoundingClientRect().top: negative = above viewport, positive = below viewport
      const promobgRect = promobgElement.getBoundingClientRect();
      const promobgTriggerPoint = logoHeight; // Positive offset for earlier trigger
      if (
        promobgRect.top <= promobgTriggerPoint &&
        promobgRect.bottom > promobgTriggerPoint
      ) {
        setIsOnLightBackground(true);
        return;
      }

      // Check other sections
      // Trigger EARLIER: when section top reaches (viewport top - logo height)
      const sections = NAVBAR_LINKS.filter((link) => link.href !== "#");
      for (const link of sections) {
        if (link.href === "#promosection") continue;
        const sectionId = link.href.substring(1);
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const sectionRect = element.getBoundingClientRect();
        // Positive offset = trigger when element is still above viewport (earlier)
        const sectionTriggerPoint = logoHeight;
        if (sectionRect.top <= sectionTriggerPoint) {
          setIsOnLightBackground(false);
          return;
        }
      }

      // Default to light if nothing else matches
      setIsOnLightBackground(true);
    };

    checkStateRef.current = checkState;

    // Wait for promobg element to exist
    const setup = () => {
      const promobgElement = document.getElementById("promobg");
      if (!promobgElement) {
        requestAnimationFrame(setup);
        return;
      }

      // Initialize logo height
      updateLogoHeight();

      // Create ONE ScrollTrigger that continuously updates
      // This is more reliable than multiple triggers interfering
      triggerRef.current = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => {
          // Continuously check state on every scroll
          checkState();
        },
        invalidateOnRefresh: true,
      });

      // Initial check
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          checkState();
        });
      });
    };

    setup();

    // Also check on resize (and update logo height for vw/vh units)
    const handleResize = () => {
      updateLogoHeight(); // Recalculate for vw/vh units
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        if (checkStateRef.current) {
          checkStateRef.current();
        }
      });
    };

    window.addEventListener("resize", handleResize);

    // Check color state when tab becomes visible again (fixes incorrect color after tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab became visible - re-check color state
        requestAnimationFrame(() => {
          if (checkStateRef.current) {
            checkStateRef.current();
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, []);

  return isOnLightBackground;
}
