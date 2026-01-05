"use client";

import React from "react";
import type { HighlightProjectProps } from "../../types/types";
import styles from "./HighlightProject.module.scss";

/**
 * HighlightProject - Project card
 *
 * Refs:
 * - containerRef: shared container (for ScrollTrigger trigger)
 * - transformRef: element to apply GSAP transforms to
 */
export const HighlightProject: React.FC<HighlightProjectProps> = (props) => {
  const { containerRef, color } = props;

  return (
    <div className={styles.highlightProject__content} ref={containerRef}>
      {/* Project content - image/video will go here */}
      <div
        style={{ background: color }}
        className={styles.highlightProject__placeholder}
      >
        Project Media
      </div>
    </div>
  );
};

HighlightProject.displayName = "HighlightProject";
