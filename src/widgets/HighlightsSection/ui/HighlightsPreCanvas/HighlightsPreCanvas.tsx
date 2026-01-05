"use client";

import React from "react";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";
import { AnimatedLink } from "@/shared/ui/AnimatedLink/AnimatedLink";
import {
  AnimatedLinkFontWeight,
  AnimatedLinkSize,
  AnimatedLinkVariant,
} from "@/shared/ui/AnimatedLink/AnimatedLink.types";
import type { HighlightsPreCanvasProps } from "../../types/types";
import styles from "./HighlightsPreCanvas.module.scss";
import Box from "./Box/Box";

/**
 * HighlightsPreCanvas - PreCanvas section with title + main box
 *
 * Refs:
 * - containerRef: shared container (for ScrollTrigger trigger)
 * - transformRef: element to apply GSAP transforms to
 */
export const HighlightsPreCanvas: React.FC<HighlightsPreCanvasProps> = (
  props
) => {
  const { title, href = "/", containerRef } = props;

  return (
    <div className={styles.highlightsPreCanvas__content} ref={containerRef}>
      {/* Title section */}
      <div className={styles.highlightsPreCanvas__titleWrapper}>
        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.XL5}
          fontWeight={TextFontWeight.XL}
          as="h3"
          className={styles.highlightsPreCanvas__title}
        >
          {title}
        </Text>
        <AnimatedLink
          href={href}
          title="View Project"
          variant={AnimatedLinkVariant.DEFAULT}
          size={AnimatedLinkSize.LG}
          fontWeight={AnimatedLinkFontWeight.XL}
          className={styles.highlightsPreCanvas__link}
        />
      </div>

      {/* Main box (OVERSCAN) */}
      <div className={styles.highlightsPreCanvas__Box}>
        <Box />
      </div>
    </div>
  );
};

HighlightsPreCanvas.displayName = "HighlightsPreCanvas";
