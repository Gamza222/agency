"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./PromoInfo.module.scss";

gsap.registerPlugin(ScrollTrigger);

export const PromoInfo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Additional animations can be added here if needed
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.promoInfo}>
      <div className={styles.promoInfo__content}>
        {/* Content will be added here */}
      </div>
    </div>
  );
};

PromoInfo.displayName = "PromoInfo";

