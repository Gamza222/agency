"use client";

import React, { memo, useRef, useMemo } from "react";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import {
  useScrollChoreography,
  useViewportValues,
} from "@/widgets/ScrollSection";
import type { HighlightsProps } from "../types/types";
import { HighlightsInfo } from "./HighlightsInfo/HighlightsInfo";
import { HighlightsShowcase } from "./HighlightsShowcase/HighlightsShowcase";
import styles from "./Highlights.module.scss";

export const Highlights = memo((props: HighlightsProps) => {
  const { className } = props;

  const infoRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const viewportValues = useViewportValues();

  // First hook call - exposes viewportHeight
  const infoProgress = useScrollChoreography({
    sectionRef: infoRef,
    enabled: true,
    entranceDistance: viewportValues.viewportHeight / 2,
    exitDistance: viewportValues.viewportHeight / 2,
    entranceStartScroll: viewportValues.scrollTop,
  });

  // Second hook call - uses viewportHeight from first hook
  const showcaseProgress = useScrollChoreography({
    sectionRef: showcaseRef,
    enabled: true,
    entranceDistance: viewportValues.viewportHeight / 2,
    exitDistance: viewportValues.viewportHeight / 2,
  });

  // Memoize props to prevent unnecessary re-renders
  const infoProps = useMemo(
    () => ({
      entranceProgress: infoProgress.entrance,
      exitProgress: infoProgress.exit,
    }),
    [infoProgress.entrance, infoProgress.exit]
  );

  const showcaseProps = useMemo(
    () => ({
      entranceProgress: showcaseProgress.entrance,
      exitProgress: showcaseProgress.exit,
    }),
    [showcaseProgress.entrance, showcaseProgress.exit]
  );

  return (
    <section className={classNames(styles.highlights, {}, [className])}>
      <HighlightsInfo ref={infoRef} {...infoProps} />
      <HighlightsShowcase ref={showcaseRef} {...showcaseProps} />
    </section>
  );
});

Highlights.displayName = "Highlights";
