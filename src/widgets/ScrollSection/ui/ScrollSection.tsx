"use client";

import React, { useMemo, memo } from "react";
import { classNames, Mods } from "@/shared/lib/utils/classNames/classNames";
import type { ScrollSectionProps } from "../types/types";
import styles from "./ScrollSection.module.scss";

/**
 * ScrollSection - Pure presentational component
 * All scroll calculations should be done via useScrollChoreography hook
 * This component only handles rendering based on provided progress values
 */
export const ScrollSection = memo((props: ScrollSectionProps) => {
  const {
    children,
    className,
    height = "100vh",
    background,
    zIndex = 9999,
    entranceProgress,
    exitProgress,
  } = props;

  // Only use will-change while actively animating
  const isAnimating = useMemo(() => {
    const entranceActive = entranceProgress > 0 && entranceProgress < 1;
    const exitActive = exitProgress > 0 && exitProgress < 1;
    return entranceActive || exitActive;
  }, [entranceProgress, exitProgress]);

  // CSS class mods
  const mods: Mods = useMemo(
    () => ({
      [styles.scrollSection_animated as string]: true,
    }),
    []
  );

  // CSS variables - JS only sets progress (0-1), CSS does all the math
  const cssVariables = useMemo((): React.CSSProperties => {
    return {
      "--entrance-progress": entranceProgress,
      "--exit-progress": exitProgress,
    } as React.CSSProperties;
  }, [entranceProgress, exitProgress]);

  return (
    <div
      className={classNames(styles.scrollSection, mods, [className])}
      style={{
        minHeight: height,
        background: background,
        zIndex: zIndex,
        willChange: isAnimating ? "transform" : undefined,
        ...cssVariables,
      }}
    >
      {children}
    </div>
  );
});

ScrollSection.displayName = "ScrollSection";
