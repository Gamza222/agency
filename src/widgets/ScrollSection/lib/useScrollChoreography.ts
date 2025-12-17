"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { RefObject } from "react";
import { useViewportValues } from "./useViewportValues";

interface UseScrollChoreographyOptions {
  /** Ref to the section element (wrapper div, not the transformed element) */
  sectionRef: RefObject<HTMLElement>;
  /** Whether choreography is enabled */
  enabled?: boolean;
  /** Custom entrance start scroll position (overrides default calculation) */
  entranceStartScroll?: number;
  /** Custom entrance distance (overrides default calculation) */
  entranceDistance?: number;
  /** Custom exit start scroll position (overrides default calculation) */
  exitStartScroll?: number;
  /** Custom exit distance (overrides default calculation) */
  exitDistance?: number;
}

interface UseScrollChoreographyResult {
  /** Entrance progress (0-1) */
  entrance: number;
  /** Exit progress (0-1) */
  exit: number;
  /** Calculated entrance start scroll position */
  entranceStartScroll: number;
  /** Calculated entrance distance */
  entranceDistance: number;
  /** Calculated exit start scroll position */
  exitStartScroll: number;
  /** Calculated exit distance */
  exitDistance: number;
  /** Current viewport height (from shared useViewportValues) */
  viewportHeight: number;
  /** Current scroll position (from shared useViewportValues) */
  scrollTop: number;
  /** Section's absolute top position in document (calculated from sectionRef) */
  sectionTopAbsolute: number;
  /** Section's height (calculated from sectionRef) */
  sectionHeight: number;
}

// Removed unused getWindowValue helper - similar function exists in useViewportValues.ts

/**
 * Hook for calculating scroll-based animation progress
 * Uses useViewportValues internally for shared viewport calculations
 * All window/document access is safe for SSR
 * Section-specific values (sectionTopAbsolute, sectionHeight) are calculated and exposed
 *
 * @example
 * ```tsx
 * const sectionRef = useRef<HTMLDivElement>(null);
 * const { entrance, exit, viewportHeight, sectionTopAbsolute, ... } = useScrollChoreography({
 *   sectionRef,
 *   enabled: true,
 *   entranceDistance: viewportHeight / 2,
 * });
 *
 * // Use values from first hook in second hook
 * const secondProgress = useScrollChoreography({
 *   sectionRef: secondRef,
 *   entranceStartScroll: sectionTopAbsolute, // Use from first hook!
 * });
 * ```
 */
export function useScrollChoreography(
  options: UseScrollChoreographyOptions
): UseScrollChoreographyResult {
  const {
    sectionRef,
    enabled = true,
    entranceStartScroll: customEntranceStartScroll,
    entranceDistance: customEntranceDistance,
    exitStartScroll: customExitStartScroll,
    exitDistance: customExitDistance,
  } = options;

  // Use shared viewport values - single calculation for all hooks
  const { viewportHeight, scrollTop } = useViewportValues();

  const [entrance, setEntrance] = useState(0);
  const [exit, setExit] = useState(0);
  const [calculatedEntranceStartScroll, setCalculatedEntranceStartScroll] =
    useState(0);
  const [calculatedEntranceDistance, setCalculatedEntranceDistance] =
    useState(0);
  const [calculatedExitStartScroll, setCalculatedExitStartScroll] = useState(0);
  const [calculatedExitDistance, setCalculatedExitDistance] = useState(0);
  const [sectionTopAbsolute, setSectionTopAbsolute] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

  // Memoized calculation function - only recalculates when dependencies change
  const calculateProgress = useCallback(() => {
    if (!enabled) {
      return;
    }

    // Use viewport values from shared state (already updated)
    const currentScrollTop = scrollTop;

    // Safe element access
    if (!sectionRef.current) {
      return;
    }

    // Safe getBoundingClientRect access - calculate section position
    let rect: DOMRect;
    try {
      rect = sectionRef.current.getBoundingClientRect();
    } catch {
      return;
    }

    // Calculate section-specific values
    const currentSectionTopAbsolute = currentScrollTop + rect.top;
    const currentSectionHeight = rect.height;

    // ENTRANCE calculation
    const defaultEntranceStartScroll =
      currentSectionTopAbsolute - viewportHeight;
    const defaultEntranceDistance = viewportHeight;

    const finalEntranceStartScroll =
      customEntranceStartScroll ?? defaultEntranceStartScroll;
    const finalEntranceDistance =
      customEntranceDistance ?? defaultEntranceDistance;

    const entranceProgress = Math.min(
      1,
      Math.max(
        0,
        finalEntranceDistance > 0
          ? (currentScrollTop - finalEntranceStartScroll) /
              finalEntranceDistance
          : 0
      )
    );

    // EXIT calculation
    const defaultExitStartScroll = currentSectionTopAbsolute;
    const defaultExitDistance = viewportHeight;

    const finalExitStartScroll =
      customExitStartScroll ?? defaultExitStartScroll;
    const finalExitDistance = customExitDistance ?? defaultExitDistance;

    const exitProgress = Math.min(
      1,
      Math.max(
        0,
        finalExitDistance > 0
          ? (currentScrollTop - finalExitStartScroll) / finalExitDistance
          : 0
      )
    );

    // Update state - batch updates for performance
    setEntrance(entranceProgress);
    setExit(exitProgress);
    setCalculatedEntranceStartScroll(finalEntranceStartScroll);
    setCalculatedEntranceDistance(finalEntranceDistance);
    setCalculatedExitStartScroll(finalExitStartScroll);
    setCalculatedExitDistance(finalExitDistance);
    setSectionTopAbsolute(currentSectionTopAbsolute);
    setSectionHeight(currentSectionHeight);
  }, [
    enabled,
    sectionRef,
    viewportHeight,
    scrollTop,
    customEntranceStartScroll,
    customEntranceDistance,
    customExitStartScroll,
    customExitDistance,
  ]);

  // Use requestAnimationFrame for scroll throttling (critical for Safari performance)
  useEffect(() => {
    if (!enabled) return;

    if (typeof window === "undefined") {
      return;
    }

    let rafId: number | null = null;
    let isScheduled = false;

    const handleScroll = () => {
      // If a frame is already scheduled, skip
      if (isScheduled) {
        return;
      }

      // Mark as scheduled
      isScheduled = true;

      // Schedule for next animation frame
      rafId = requestAnimationFrame(() => {
        isScheduled = false;
        calculateProgress();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    calculateProgress(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);

      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isScheduled = false;
    };
  }, [enabled, calculateProgress]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      entrance,
      exit,
      entranceStartScroll: calculatedEntranceStartScroll,
      entranceDistance: calculatedEntranceDistance,
      exitStartScroll: calculatedExitStartScroll,
      exitDistance: calculatedExitDistance,
      viewportHeight,
      scrollTop,
      sectionTopAbsolute,
      sectionHeight,
    }),
    [
      entrance,
      exit,
      calculatedEntranceStartScroll,
      calculatedEntranceDistance,
      calculatedExitStartScroll,
      calculatedExitDistance,
      viewportHeight,
      scrollTop,
      sectionTopAbsolute,
      sectionHeight,
    ]
  );
}
