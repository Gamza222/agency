"use client";

import React, { memo, forwardRef } from "react";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import { ScrollSection } from "@/widgets/ScrollSection";
import type { HighlightsShowcaseProps } from "../../types/types";
import styles from "./HighlightsShowcase.module.scss";

export const HighlightsShowcase = memo(
  forwardRef<HTMLDivElement, HighlightsShowcaseProps>((props, ref) => {
    const { className, children, entranceProgress, exitProgress } = props;

    return (
      <div ref={ref}>
        <ScrollSection
          className={classNames(styles.highlightsShowcase, {}, [className])}
          height="100vh"
          zIndex={101}
          entranceProgress={entranceProgress ?? 0}
          exitProgress={exitProgress ?? 0}
        >
          <div className={styles.highlightsShowcase__content}>
            {children || (
              <>
                <h2>Highlights Showcase</h2>
                <p>Second section - anchored to first section&apos;s line</p>
              </>
            )}
          </div>
        </ScrollSection>
      </div>
    );
  })
);

HighlightsShowcase.displayName = "HighlightsShowcase";
