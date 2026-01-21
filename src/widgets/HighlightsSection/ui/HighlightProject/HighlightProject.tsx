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
  const { containerRef, color, video, href } = props;

  return (
    <div className={styles.highlightProject__content} ref={containerRef}>
      {/* Project content - image/video will go here */}
      <a
        href={href || "#"}
        className={styles.highlightProject__link}
        onClick={(e) => {
          if (!href) {
            e.preventDefault();
          }
        }}
      >
        <div
          style={{ background: color }}
          className={styles.highlightProject__placeholder}
        >
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            className={styles.highlightProject__video}
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
          />
        </div>
      </a>
    </div>
  );
};

HighlightProject.displayName = "HighlightProject";
