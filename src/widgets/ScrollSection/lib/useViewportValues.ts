"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Shared state for viewport values - ensures single calculation across all consumers
 */
const sharedState = {
  viewportHeight: 0,
  scrollTop: 0,
  listeners: new Set<() => void>(),
};

/**
 * Safe window access helper
 */
function getWindowValue<T>(getter: () => T, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    return getter();
  } catch {
    return fallback;
  }
}

/**
 * Updates shared state and notifies all listeners
 */
function updateSharedState() {
  const newViewportHeight = getWindowValue(() => window.innerHeight, 0);
  const newScrollTop = getWindowValue(() => window.scrollY, 0);

  if (
    sharedState.viewportHeight !== newViewportHeight ||
    sharedState.scrollTop !== newScrollTop
  ) {
    sharedState.viewportHeight = newViewportHeight;
    sharedState.scrollTop = newScrollTop;
    sharedState.listeners.forEach((listener) => listener());
  }
}

/**
 * Lightweight hook for viewport and scroll values
 * Uses shared state - multiple calls = single calculation
 * Perfect for accessing default values used in scroll calculations
 *
 * @example
 * ```tsx
 * const { viewportHeight, scrollTop } = useViewportValues();
 * const infoProgress = useScrollChoreography({
 *   entranceDistance: viewportHeight / 2,
 * });
 * ```
 */
export function useViewportValues() {
  const [viewportHeight, setViewportHeight] = useState(
    sharedState.viewportHeight
  );
  const [scrollTop, setScrollTop] = useState(sharedState.scrollTop);

  // Memoized update function
  const update = useCallback(() => {
    setViewportHeight(sharedState.viewportHeight);
    setScrollTop(sharedState.scrollTop);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Register this component as a listener
    sharedState.listeners.add(update);

    // Initial update
    updateSharedState();
    update();

    // Set up listeners
    window.addEventListener("scroll", updateSharedState, { passive: true });
    window.addEventListener("resize", updateSharedState, { passive: true });

    return () => {
      sharedState.listeners.delete(update);
      window.removeEventListener("scroll", updateSharedState);
      window.removeEventListener("resize", updateSharedState);
    };
  }, [update]);

  // Memoize return value
  return useMemo(
    () => ({
      viewportHeight,
      scrollTop,
    }),
    [viewportHeight, scrollTop]
  );
}
