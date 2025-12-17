"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { LoadingScreen, LoadingScreenMode } from "@/widgets/LoadingScreen";
import { VideoBackground } from "@/widgets/VideoBackground";
// import { Highlights } from "@/widgets/Highlights";
import styles from "./HomePage.module.scss";

interface HomePageProps {}

export const HomePage = memo((props: HomePageProps) => {
  const {} = props;
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [videoShouldStart, setVideoShouldStart] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pageRef = useRef<HTMLElement>(null);
  const loadingScreenElementRef = useRef<HTMLElement | null>(null);
  const backgroundOverlayElementRef = useRef<HTMLDivElement | null>(null);

  // Track which animations have completed
  const animationStatus = useRef({ background: false, loading: false });

  // Always start at top on page load/reload
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const checkAllComplete = useCallback(() => {
    const { background, loading } = animationStatus.current;
    if (background && loading) {
      setAnimationsComplete(true);
    }
  }, []);

  const handleBackgroundComplete = useCallback(() => {
    animationStatus.current.background = true;
    checkAllComplete();
  }, [checkAllComplete]);

  const handleLoadingComplete = useCallback(() => {
    animationStatus.current.loading = true;
    setVideoShouldStart(true);
    checkAllComplete();
  }, [checkAllComplete]);

  // Disable scroll while animations are running
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

  // Cache element references to avoid querySelector on every RAF frame
  // Update refs when animations complete (elements become available)
  useEffect(() => {
    if (animationsComplete) {
      // Cache LoadingScreen element reference
      if (!loadingScreenElementRef.current) {
        loadingScreenElementRef.current = document.querySelector(
          '[class*="loadingScreen_scrollAnimated"]'
        ) as HTMLElement | null;
      }
    }
  }, [animationsComplete]);

  useEffect(() => {
    if (!animationsComplete) return;

    // Slide-out transform values
    // Desktop values
    const DESKTOP_TRANSLATE_X = -30; // percentage
    const DESKTOP_TRANSLATE_Y = -120; // percentage
    const DESKTOP_ROTATION = -8; // degrees

    // Mobile values
    const MOBILE_TRANSLATE_X = -100; // percentage
    const MOBILE_TRANSLATE_Y = -150; // percentage
    const MOBILE_ROTATION = -15; // degrees

    let rafId: number | null = null;
    let isScheduled = false;
    let lastStateUpdateTime = 0;
    let lastTransformString = ""; // Cache last transform to avoid unnecessary updates
    let rafCallbackCount = 0; // Track how many RAF callbacks have executed

    const handleScroll = () => {
      if (isScheduled) return;
      isScheduled = true;

      rafId = requestAnimationFrame(() => {
        rafCallbackCount++;
        isScheduled = false;

        const rafStart = performance.now();
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const progress = Math.min(1, Math.max(0, scrollTop / viewportHeight));

        // Determine if mobile based on viewport width
        const isMobile = window.innerWidth < 768;

        // Calculate transform values in JavaScript (no CSS calc())
        const translateX = isMobile ? MOBILE_TRANSLATE_X : DESKTOP_TRANSLATE_X;
        const translateY = isMobile ? MOBILE_TRANSLATE_Y : DESKTOP_TRANSLATE_Y;
        const rotation = isMobile ? MOBILE_ROTATION : DESKTOP_ROTATION;

        const translateXValue = (translateX * progress).toFixed(2);
        const translateYValue = (translateY * progress).toFixed(2);
        const rotationValue = (rotation * progress).toFixed(2);

        const transformString = `translate3d(${translateXValue}%, ${translateYValue}%, 0) rotate(${rotationValue}deg)`;

        // #region agent log - measure transform update cost
        const transformUpdateStart = performance.now();
        const transformChanged = transformString !== lastTransformString;
        // #endregion

        // Only update if transform string actually changed (avoids unnecessary style updates in Safari)
        if (transformChanged) {
          lastTransformString = transformString;

          // Apply transform directly to LoadingScreen (bypasses CSS calc() entirely)
          // Use cached ref to avoid querySelector on every frame
          if (loadingScreenElementRef.current) {
            loadingScreenElementRef.current.style.transform = transformString;
          }

          // Apply same transform to backgroundOverlay (also bypasses CSS calc())
          if (backgroundOverlayElementRef.current) {
            backgroundOverlayElementRef.current.style.transform =
              transformString;
          }
        }

        // #region agent log - THROTTLED to every 100ms to reduce overhead
        const transformUpdateTime = performance.now() - transformUpdateStart;
        const rafTime = performance.now() - rafStart;
        // #endregion

        // Throttle React state updates to prevent excessive re-renders
        // Only update state every 100ms (instead of every scroll event ~16ms)
        // This allows LoadingScreen's will-change logic to work, but with 6x fewer re-renders
        const now = performance.now();
        if (now - lastStateUpdateTime > 100) {
          // Only log every 100ms to reduce console.log/fetch overhead
          const logData = {
            location: "HomePage.tsx:RAF",
            message:
              "Transform update timing (no CSS calc, with change detection, no will-change)",
            data: {
              progress,
              transformUpdateTime: transformUpdateTime.toFixed(2),
              rafTime: rafTime.toFixed(2),
              isMobile,
              transformChanged,
              rafCallbackCount,
            },
            timestamp: Date.now(),
            sessionId: "debug-session-4",
            runId: "run4",
            hypothesisId: "I",
          };
          console.log("[DEBUG]", logData);
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(logData),
            }
          ).catch(() => {});

          setScrollProgress(progress);
          lastStateUpdateTime = now;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true }); // Recalculate on resize (mobile/desktop switch)
    handleScroll(); // Initial call

    return () => {
      // CRITICAL: Cancel any pending RAF before cleanup
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      // Reset state to prevent accumulation
      isScheduled = false;
      lastTransformString = "";
      rafCallbackCount = 0;
    };
  }, [animationsComplete]);

  // TEST: Removed will-change - it might cause Safari to maintain expensive composite layers
  // const shouldUseWillChange = useMemo(
  //   () => animationsComplete && scrollProgress > 0 && scrollProgress < 1,
  //   [animationsComplete, scrollProgress]
  // );

  return (
    <main
      ref={pageRef}
      className={styles.page}
      style={{ ["--scroll-progress" as string]: "0" }}
    >
      <VideoBackground
        onAnimationComplete={handleBackgroundComplete}
        shouldStart={videoShouldStart}
      />
      <div
        ref={backgroundOverlayElementRef as React.RefObject<HTMLDivElement>}
        className={styles.backgroundOverlay}
        // TEST: Removed will-change
        // style={{
        //   willChange: shouldUseWillChange ? "transform" : undefined,
        // }}
      />
      <LoadingScreen
        onAnimationComplete={handleLoadingComplete}
        animationsComplete={animationsComplete}
        mode={LoadingScreenMode.HOMEPAGE}
        scrollProgress={scrollProgress}
      />
      <div className={styles.videoSpacer} />
      <div style={{ height: "100vh" }}></div>
      {/* <Highlights /> */}
    </main>
  );
});
