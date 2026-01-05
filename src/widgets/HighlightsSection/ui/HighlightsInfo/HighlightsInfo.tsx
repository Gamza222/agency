"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

import styles from "./HighlightsInfo.module.scss";

gsap.registerPlugin(ScrollTrigger);

export const HighlightsInfo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ===== ENTRANCE =====
      gsap.fromTo(
        el,
        {
          xPercent: -10,
          yPercent: 0,
          rotate: 8,
          transformOrigin: "0% 50%",
        },
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          transformOrigin: "0% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 55%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      // ===== EXIT =====
      gsap.fromTo(
        el,
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          transformOrigin: "100% 50%",
        },
        {
          xPercent: -10,
          yPercent: -5,
          rotate: -4,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 37%",
            end: "top -100%", // 👈 растянули далеко вниз
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.highlightsInfo}>
      <div className={styles.highlightsInfo__content}>
        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.MD}
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
    </div>
  );
};

HighlightsInfo.displayName = "HighlightsInfo";
