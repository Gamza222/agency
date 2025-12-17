"use client";

import { useState, useLayoutEffect } from "react";
import { NAVBAR_BREAKPOINTS } from "../model/types/constants/constants";

/**
 * Hook to detect mobile viewport
 * Returns boolean: true for mobile, false for desktop
 * Uses useLayoutEffect to determine screen size synchronously before browser paint
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    // On server, default to false (will be corrected on client)
    if (typeof window === "undefined") {
      return false;
    }
    // On client, check immediately if possible
    return window.matchMedia(`(max-width: ${NAVBAR_BREAKPOINTS.MOBILE_MAX}px)`)
      .matches;
  });

  useLayoutEffect(() => {
    // This runs synchronously before browser paint
    const mediaQuery = window.matchMedia(
      `(max-width: ${NAVBAR_BREAKPOINTS.MOBILE_MAX}px)`
    );

    // Set the correct value immediately
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  return isMobile;
}
