"use client";

import React from "react";
import { ScrollableSection } from "@/widgets/ScrollableSection";
import type { ScrollConfig } from "@/widgets/ScrollableSection";
import {
  AnimatedLink,
  AnimatedLinkVariant,
} from "@/shared/ui/AnimatedLink/AnimatedLink";
import {
  AnimatedLinkFontWeight,
  AnimatedLinkSize,
} from "@/shared/ui/AnimatedLink/AnimatedLink.types";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";
import type { HighlightsInfoProps } from "../../types/types";
import styles from "./HighlightsInfo.module.scss";

export const HighlightsInfo: React.FC<HighlightsInfoProps> = () => {
  // Calculate scroll config with relative positioning
  // Entrance: from bottom of viewport to 50% from top
  // Stable period: from 50% to 20% from top (normal scroll)
  // Exit starts when section top reaches 20% from top
  const scrollConfig = React.useMemo<ScrollConfig>(() => {
    if (typeof window === "undefined") {
      return {
        entrance: {
          translateX: -10,
          translateY: 0,
          rotation: 8,
          transformOrigin: "0% 50%",
          start: "top bottom",
          end: "50% top",
          ease: "power2.out",
        },
        exit: {
          translateX: -10,
          translateY: 5,
          rotation: -4,
          start: "20% top",
          end: 1000,
          ease: "power3.in",
        },
        enabled: false,
      };
    }

    const viewportHeight = window.innerHeight;
    const exitDistance = viewportHeight * 0.5;

    return {
      entrance: {
        translateX: -10,
        translateY: 0,
        rotation: 8,
        transformOrigin: "0% 50%",
        start: "top bottom",
        end: "50% top",
        ease: "power1.inOut",
      },
      exit: {
        translateX: -10,
        translateY: 5,
        rotation: -4,
        start: "20% top",
        end: exitDistance,
      },
      enabled: true,
    };
  }, []);

  return (
    <ScrollableSection
      config={scrollConfig}
      className={styles.highlightsInfo}
      zIndex={100}
    >
      <div className={styles.highlightsInfo__content}>
        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.SM}
          as="h3"
          fontWeight={TextFontWeight.LG}
          className={styles.highlightsInfo__content__info}
        >
          / The warp agency
        </Text>
        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.XL6}
          as="h2"
          fontWeight={TextFontWeight.XL2}
          className={styles.highlightsInfo__content__title}
        >
          Highlights
        </Text>
        <nav className={styles.highlightsInfo__content__nav}>
          <AnimatedLink
            href="/works"
            title="Works"
            variant={AnimatedLinkVariant.DEFAULT}
            size={AnimatedLinkSize.XL}
            fontWeight={AnimatedLinkFontWeight.XL}
            className={styles.highlightsInfo__content__nav__link}
          />
          <AnimatedLink
            href="/about"
            title="About us"
            variant={AnimatedLinkVariant.DEFAULT}
            size={AnimatedLinkSize.XL}
            fontWeight={AnimatedLinkFontWeight.XL}
            className={styles.highlightsInfo__content__nav__link}
          />
        </nav>
      </div>
    </ScrollableSection>
  );
};

HighlightsInfo.displayName = "HighlightsInfo";
