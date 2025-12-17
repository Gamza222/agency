"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { classNames, Mods } from "@/shared/lib/utils/classNames/classNames";
import WarpLogo from "@/shared/assets/icons/logo-bg-01.svg";
import { LoadingScreenMode } from "../types/types";
import type { LoadingScreenProps } from "../types/types";
import styles from "./LoadingScreen.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";

const LoadingScreen = memo((props: LoadingScreenProps) => {
  const {
    className,
    duration = 2000,
    strokeDuration = 600,
    strokeDelay = 100,
    flickerDuration = 0.15,
    onAnimationComplete,
    animationsComplete = false,
    mode = LoadingScreenMode.DEFAULT,
    scrollProgress = 0,
  } = props;
  const [navbarMounted, setNavbarMounted] = useState(false);
  const [loadingBarComplete, setLoadingBarComplete] = useState(false);
  const [percentageGoalComplete, setPercentageGoalComplete] = useState(false);
  const [percentageComplete, setPercentageComplete] = useState(false);
  const [exitAnimationStarted, setExitAnimationStarted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const progressRef = useRef<HTMLParagraphElement>(null);
  const percentageRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoized CSS animation timing variables
  const animationStyle = useMemo(
    () =>
      ({
        "--animation-duration": `${duration}ms`,
        "--stroke-duration": `${strokeDuration}ms`,
        "--stroke-delay": `${strokeDelay}ms`,
        "--flicker-duration": `${flickerDuration}s`,
      }) as React.CSSProperties,
    [duration, strokeDuration, strokeDelay, flickerDuration]
  );

  // Memoized CSS class modifiers
  const loadingBarMods: Mods = useMemo(
    () => ({
      [styles.loadingScreen__loadingBarStart as string]: navbarMounted,
      [styles.loadingScreen__loadingBarHidden as string]: loadingBarComplete,
    }),
    [navbarMounted, loadingBarComplete]
  );

  const strokeMods: Mods = useMemo(
    () => ({
      [styles.loadingScreen__logoStrokeHidden as string]: !loadingBarComplete,
      [styles.loadingScreen__logoStrokeAnimate as string]: loadingBarComplete,
    }),
    [loadingBarComplete]
  );

  const percentageMods: Mods = useMemo(
    () => ({
      [styles.loadingScreen__percentageStart as string]: navbarMounted,
      [styles.loadingScreen__percentageHidden as string]: percentageComplete,
    }),
    [navbarMounted, percentageComplete]
  );

  // Memoized callbacks for animation handlers
  const handleLoadingBarComplete = useCallback(() => {
    setLoadingBarComplete(true);
  }, []);

  const handlePercentageGoalComplete = useCallback(() => {
    setPercentageGoalComplete(true);
  }, []);

  // Wait for navbar to mount before starting animations
  useEffect(() => {
    const isNavbarMounted = () =>
      document.body.getAttribute("data-navbar-mounted") === "true";

    if (isNavbarMounted()) {
      setNavbarMounted(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (isNavbarMounted()) {
        setNavbarMounted(true);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-navbar-mounted"],
    });

    return () => observer.disconnect();
  }, []);

  // Animate percentage counter (0 -> 100)
  useEffect(() => {
    if (!percentageGoalComplete || !progressRef.current) return;

    const totalDuration =
      duration + strokeDuration + strokeDelay - flickerDuration * 6000 + 600;
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
  }, [
    percentageGoalComplete,
    duration,
    strokeDuration,
    strokeDelay,
    flickerDuration,
  ]);

  // Handle percentage hide animation end
  useEffect(() => {
    if (!percentageRef.current) return;

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === styles.percentageHide) {
        if (mode === LoadingScreenMode.HOMEPAGE) {
          onAnimationComplete?.();
        } else {
          setTimeout(() => setExitAnimationStarted(true), 100);
        }
      }
    };

    const el = percentageRef.current;
    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
  }, [mode, onAnimationComplete]);

  // Handle exit animation end (DEFAULT mode only)
  useEffect(() => {
    if (!containerRef.current || mode !== LoadingScreenMode.DEFAULT) return;

    const handleExitEnd = (event: AnimationEvent) => {
      if (event.animationName === styles.slideOutRotate) {
        setIsHidden(true);
        onAnimationComplete?.();
      }
    };

    const el = containerRef.current;
    el.addEventListener("animationend", handleExitEnd);
    return () => el.removeEventListener("animationend", handleExitEnd);
  }, [mode, onAnimationComplete]);

  // Memoized computed values
  const isHomepage = mode === LoadingScreenMode.HOMEPAGE;
  const isScrollAnimated = isHomepage && animationsComplete;

  const shouldUseWillChange = useMemo(
    () => isScrollAnimated && scrollProgress > 0 && scrollProgress < 1,
    [isScrollAnimated, scrollProgress]
  );

  const containerMods: Mods = useMemo(
    () => ({
      [styles.loadingScreen_homepage as string]: isHomepage,
      [styles.loadingScreen_scrollAnimated as string]: isScrollAnimated,
      [styles.loadingScreen_exitAnimation as string]:
        exitAnimationStarted && !isHomepage,
    }),
    [isHomepage, isScrollAnimated, exitAnimationStarted]
  );

  if (isHidden) return null;

  return (
    <div
      ref={containerRef}
      className={classNames(styles.loadingScreen, containerMods, [className])}
      style={{
        // DO NOT set --scroll-progress here - it's updated directly via DOM in HomePage
        // Setting it here would cause React to overwrite direct DOM updates on every render
        // CSS variable inherits from parent (pageRef in HomePage)
        willChange: shouldUseWillChange ? "transform" : undefined,
      }}
    >
      <div
        className={styles.loadingScreen__brandWrapper}
        style={animationStyle}
      >
        {/* Percentage display */}
        <div
          ref={percentageRef}
          className={classNames(
            styles.loadingScreen__percentage,
            percentageMods
          )}
        >
          <Text
            className={styles.loadingScreen__percentageProgress}
            variant={TextVariant.PRIMARY}
            size={TextSize.PERCENTAGE}
            as="p"
          >
            <span ref={progressRef}>0</span>
          </Text>
          <Text
            className={styles.loadingScreen__percentageSpan}
            variant={TextVariant.PRIMARY}
            size={TextSize.PERCENTAGE}
            as="span"
          >
            /
          </Text>
          <Text
            className={styles.loadingScreen__percentageGoal}
            variant={TextVariant.PRIMARY}
            size={TextSize.PERCENTAGE}
            as="p"
            onAnimationEnd={handlePercentageGoalComplete}
          >
            100%
          </Text>
        </div>

        {/* Logo with loading animation */}
        <div className={styles.loadingScreen__logoContainer}>
          <div
            className={classNames(
              styles.loadingScreen__loadingBar,
              loadingBarMods
            )}
            onAnimationEnd={handleLoadingBarComplete}
          />
          <div
            className={classNames(styles.loadingScreen__logoStroke, strokeMods)}
          >
            <WarpLogo />
          </div>
        </div>
      </div>
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";

export default LoadingScreen;
