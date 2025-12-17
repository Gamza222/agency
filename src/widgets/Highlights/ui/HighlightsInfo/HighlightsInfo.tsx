"use client";

import React, { memo, forwardRef } from "react";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import { ScrollSection } from "@/widgets/ScrollSection";
import type { HighlightsInfoProps } from "../../types/types";
import styles from "./HighlightsInfo.module.scss";

export const HighlightsInfo = memo(
  forwardRef<HTMLDivElement, HighlightsInfoProps>((props, ref) => {
    const { className, children, entranceProgress, exitProgress } = props;

    return (
      <div ref={ref}>
        <ScrollSection
          className={classNames(styles.highlightsInfo, {}, [className])}
          height="100vh"
          zIndex={100}
          entranceProgress={entranceProgress ?? 0}
          exitProgress={exitProgress ?? 0}
        >
          <div className={styles.highlightsInfo__content}>
            {children || (
              <>
                <h2>Highlights Info</h2>
                <p>
                  First section - slides in, then out after next section enters
                </p>
              </>
            )}
          </div>
        </ScrollSection>
      </div>
    );
  })
);

HighlightsInfo.displayName = "HighlightsInfo";
