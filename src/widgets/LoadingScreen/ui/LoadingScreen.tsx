"use client";

import React, { memo, useCallback, useMemo, useState, useEffect } from "react";
import { classNames, Mods } from "@/shared/lib/utils/classNames/classNames";
import WarpLogo from "@/shared/assets/icons/logo-bg-01.svg?react";
import { LoadingScreenMode } from "../types/types";
import type { LoadingScreenProps } from "../types/types";
import {
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_STROKE_DURATION_MS,
  DEFAULT_STROKE_DELAY_MS,
  DEFAULT_FLICKER_DURATION_S,
} from "../lib/constants/animation.constants";
import { useNavbarMountCheck } from "../lib/hooks/useNavbarMountCheck";
import { usePercentageAnimation } from "../lib/hooks/usePercentageAnimation";
import { useAnimationEndHandlers } from "../lib/hooks/useAnimationEndHandlers";
import styles from "./LoadingScreen.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";

const LoadingScreen = memo((props: LoadingScreenProps) => {
  const {
    className,
    duration = DEFAULT_ANIMATION_DURATION_MS,
    strokeDuration = DEFAULT_STROKE_DURATION_MS,
    strokeDelay = DEFAULT_STROKE_DELAY_MS,
    flickerDuration = DEFAULT_FLICKER_DURATION_S,
    onAnimationComplete,
    animationsComplete = false,
    mode = LoadingScreenMode.DEFAULT,
    scrollProgress: _scrollProgress = 0, // Prefixed with _ to indicate intentionally unused
    externalContainerRef,
  } = props;

  const navbarMounted = useNavbarMountCheck();
  const [loadingBarComplete, setLoadingBarComplete] = useState(false);
  const [percentageGoalComplete, setPercentageGoalComplete] = useState(false);
  const [svgKey, setSvgKey] = useState(0);

  const handlePercentageGoalComplete = useCallback(() => {
    setPercentageGoalComplete(true);
  }, []);

  const { progressRef, percentageComplete } = usePercentageAnimation({
    enabled: percentageGoalComplete,
    duration,
    strokeDuration,
    strokeDelay,
    flickerDuration,
  });

  const { percentageRef, containerRef, exitAnimationStarted, isHidden } =
    useAnimationEndHandlers({
      mode,
      onAnimationComplete,
      percentageHideAnimationName: styles.percentageHide || "",
      slideOutRotateAnimationName: styles.slideOutRotate || "",
      externalContainerRef, // Pass external ref directly
    });

  // Force SVG re-mount on resize to prevent blur
  // Runs AFTER ScrollSmootherProvider's resize handler (200ms debounce)
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      // Use 250ms debounce to run AFTER ScrollSmootherProvider's 200ms handler
      resizeTimer = setTimeout(() => {
        // Force re-mount by changing key
        setSvgKey((prev) => prev + 1);
      }, 250);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

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
      [styles.loadingScreen__loadingBarStart]: navbarMounted,
      [styles.loadingScreen__loadingBarHidden]: loadingBarComplete,
    }),
    [navbarMounted, loadingBarComplete]
  );

  const strokeMods: Mods = useMemo(
    () => ({
      [styles.loadingScreen__logoStrokeHidden]: !loadingBarComplete,
      [styles.loadingScreen__logoStrokeAnimate]: loadingBarComplete,
    }),
    [loadingBarComplete]
  );

  const percentageMods: Mods = useMemo(
    () => ({
      [styles.loadingScreen__percentageStart]: navbarMounted,
      [styles.loadingScreen__percentageHidden]: percentageComplete,
    }),
    [navbarMounted, percentageComplete]
  );

  const handleLoadingBarComplete = useCallback(() => {
    setLoadingBarComplete(true);
  }, []);

  // Memoized computed values
  const isHomepage = mode === LoadingScreenMode.HOMEPAGE;
  const isScrollAnimated = isHomepage && animationsComplete;

  // TEST: Removed will-change to test if it's causing accumulating lag
  // const shouldUseWillChange = useMemo(
  //   () => isScrollAnimated && scrollProgress > 0 && scrollProgress < 1,
  //   [isScrollAnimated, scrollProgress]
  // );

  const containerMods: Mods = useMemo(
    () => ({
      [styles.loadingScreen_homepage]: isHomepage,
      [styles.loadingScreen_scrollAnimated]: isScrollAnimated,
      [styles.loadingScreen_exitAnimation]:
        exitAnimationStarted && !isHomepage,
    }),
    [isHomepage, isScrollAnimated, exitAnimationStarted]
  );

  if (isHidden) return null;

  return (
    <div
      ref={containerRef}
      className={classNames(styles.loadingScreen, containerMods, [className])}
      style={
        {
          // DO NOT set --scroll-progress here - it's updated directly via DOM in HomePage
          // Setting it here would cause React to overwrite direct DOM updates on every render
          // CSS variable inherits from parent (pageRef in HomePage)
          // TEST: Removed will-change to test if it's causing accumulating lag
          // willChange: shouldUseWillChange ? "transform" : undefined,
        }
      }
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
            size={TextSize.PERCENTAGE}
            fontWeight={TextFontWeight.XL2}
            as="p"
          >
            <span ref={progressRef}>0</span>
          </Text>
          <Text
            className={styles.loadingScreen__percentageSpan}
            size={TextSize.PERCENTAGE}
            fontWeight={TextFontWeight.XL2}
            as="span"
          >
            /
          </Text>
          <Text
            className={styles.loadingScreen__percentageGoal}
            variant={TextVariant.PRIMARY}
            size={TextSize.PERCENTAGE}
            fontWeight={TextFontWeight.XL2}
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
            <WarpLogo key={svgKey} />
          </div>
        </div>
      </div>
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";

export default LoadingScreen;
