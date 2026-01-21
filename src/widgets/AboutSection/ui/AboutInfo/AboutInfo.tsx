"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";

import styles from "./AboutInfo.module.scss";

gsap.registerPlugin(ScrollTrigger);

export const AboutInfo = () => {
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
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 70%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );


    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.aboutInfo}>
      <div className={styles.aboutInfo__content}>
        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.MD}
          as="h3"
          fontWeight={TextFontWeight.LG}
          className={styles.aboutInfo__content__info}
        >
          / The warp agency
        </Text>

        <Text
          variant={TextVariant.SECONDARY}
          size={TextSize.XL6}
          as="h2"
          fontWeight={TextFontWeight.XL2}
          className={styles.aboutInfo__content__title}
        >
          Information
        </Text>
      </div>
    </div>
  );
};

AboutInfo.displayName = "AboutInfo";
