"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PromoContainer.module.scss";

gsap.registerPlugin(ScrollTrigger);

export const PromoContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      // Additional animations can be added here if needed
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.promoContainer}>
      {/* Content will be added here */}
    </div>
  );
};

PromoContainer.displayName = "PromoContainer";

