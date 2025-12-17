"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { LoadingScreen, LoadingScreenMode } from "@/widgets/LoadingScreen";
import { VideoBackground } from "@/widgets/VideoBackground";
import { Highlights } from "@/widgets/Highlights";
import styles from "./HomePage.module.scss";

interface HomePageProps {}

export const HomePage = memo((props: HomePageProps) => {
  const {} = props;
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [videoShouldStart, setVideoShouldStart] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pageRef = useRef<HTMLElement>(null);
  const loadingScreenElementRef = useRef<HTMLElement | null>(null);
  const backgroundOverlayElementRef = useRef<HTMLElement | null>(null);

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

    // Slide-out transform values (matching CSS variables)
    // Desktop values
    const DESKTOP_TRANSLATE_X = -30; // percentage
    const DESKTOP_TRANSLATE_Y = -120; // percentage
    const DESKTOP_ROTATION = -8; // degrees

    // Mobile values (breakpoint typically 768px, but check window width)
    const MOBILE_TRANSLATE_X = -100; // percentage
    const MOBILE_TRANSLATE_Y = -150; // percentage
    const MOBILE_ROTATION = -15; // degrees

    let rafId: number | null = null;
    let isScheduled = false;
    let lastStateUpdateTime = 0;

    const handleScroll = () => {
      if (isScheduled) return;
      isScheduled = true;

      rafId = requestAnimationFrame(() => {
        isScheduled = false;

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

        // Apply transform directly to LoadingScreen (bypasses CSS calc() entirely)
        // Use cached ref to avoid querySelector on every frame
        if (loadingScreenElementRef.current) {
          loadingScreenElementRef.current.style.transform = transformString;
        }

        // Apply same transform to backgroundOverlay (also bypasses CSS calc())
        if (backgroundOverlayElementRef.current) {
          backgroundOverlayElementRef.current.style.transform = transformString;
        }

        // Throttle React state updates to prevent excessive re-renders
        // Only update state every 100ms (instead of every scroll event ~16ms)
        // This allows LoadingScreen's will-change logic to work, but with 6x fewer re-renders
        const now = performance.now();
        if (now - lastStateUpdateTime > 100) {
          setScrollProgress(progress);
          lastStateUpdateTime = now;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true }); // Recalculate on resize (mobile/desktop switch)
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [animationsComplete]);

  // Only use will-change while actively transforming
  const shouldUseWillChange = useMemo(
    () => animationsComplete && scrollProgress > 0 && scrollProgress < 1,
    [animationsComplete, scrollProgress]
  );

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
        ref={backgroundOverlayElementRef}
        className={styles.backgroundOverlay}
        style={{
          willChange: shouldUseWillChange ? "transform" : undefined,
        }}
      />

      <LoadingScreen
        onAnimationComplete={handleLoadingComplete}
        animationsComplete={animationsComplete}
        mode={LoadingScreenMode.HOMEPAGE}
        scrollProgress={scrollProgress}
      />

      <div className={styles.videoSpacer} />

      <Highlights />
    </main>
  );
});
