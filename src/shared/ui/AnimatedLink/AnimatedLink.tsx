"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import ArrowIcon from "@/shared/assets/icons/arrow.svg?react";
import type { AnimatedLinkProps } from "./AnimatedLink.types";
import {
  AnimatedLinkFontWeight,
  AnimatedLinkSize,
  AnimatedLinkVariant,
} from "./AnimatedLink.types";

export { AnimatedLinkVariant } from "./AnimatedLink.types";
export type { AnimatedLinkProps } from "./AnimatedLink.types";
import styles from "./AnimatedLink.module.scss";
import { cva } from "@/shared/lib/utils/cva/cva";

const linkVariants = cva({
  base: styles.animatedLink || "",
  variants: {
    variant: {
      [AnimatedLinkVariant.DEFAULT]: styles.default || "",
      [AnimatedLinkVariant.NAVBAR]: styles.navbar || "",
    },
    size: {
      [AnimatedLinkSize.SM]: styles.sm || "",
      [AnimatedLinkSize.MD]: styles.md || "",
      [AnimatedLinkSize.LG]: styles.lg || "",
      [AnimatedLinkSize.XL]: styles.xl || "",
      [AnimatedLinkSize.XL2]: styles.xl2 || "",
      [AnimatedLinkSize.XL3]: styles.xl3 || "",
      [AnimatedLinkSize.XL4]: styles.xl4 || "",
      [AnimatedLinkSize.XL5]: styles.xl5 || "",
    },
    fontWeight: {
      [AnimatedLinkFontWeight.XM]: styles.xmFontWeight || "",
      [AnimatedLinkFontWeight.SM]: styles.smFontWeight || "",
      [AnimatedLinkFontWeight.MD]: styles.mdFontWeight || "",
      [AnimatedLinkFontWeight.LG]: styles.lgFontWeight || "",
      [AnimatedLinkFontWeight.XL]: styles.xlFontWeight || "",
      [AnimatedLinkFontWeight.XL2]: styles.xl2FontWeight || "",
      [AnimatedLinkFontWeight.XL3]: styles.xl3FontWeight || "",
      [AnimatedLinkFontWeight.XL4]: styles.xl4FontWeight || "",
      [AnimatedLinkFontWeight.XL5]: styles.xl5FontWeight || "",
    },
  },
  defaultVariants: {
    variant: AnimatedLinkVariant.DEFAULT,
    size: AnimatedLinkSize.MD,
    fontWeight: AnimatedLinkFontWeight.MD,
  },
});

export const AnimatedLink = memo(
  ({
    href,
    mailto,
    title,
    size = AnimatedLinkSize.MD,
    variant = AnimatedLinkVariant.DEFAULT,
    fontWeight = AnimatedLinkFontWeight.MD,
    className,
    icon,
    onClick,
    ...props
  }: AnimatedLinkProps) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isUnhovering, setIsUnhovering] = useState(false);
    const [hasHover, setHasHover] = useState(() => {
      if (typeof window === "undefined") return true;
      return window.matchMedia("(hover: hover)").matches;
    });

    // Handle hover capability changes (e.g., resize from mobile to desktop)
    useEffect(() => {
      if (typeof window === "undefined") return;

      const mediaQuery = window.matchMedia("(hover: hover)");

      const handleHoverChange = (e: MediaQueryListEvent | MediaQueryList) => {
        const currentlyHasHover = e.matches;
        setHasHover(currentlyHasHover);

        // Reset states when transitioning from no-hover to hover
        if (currentlyHasHover) {
          setIsUnhovering(false);
          setIsClicked(false);
        }
      };

      // Check initial state and set up listener
      handleHoverChange(mediaQuery);

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleHoverChange);
        return () => {
          mediaQuery.removeEventListener("change", handleHoverChange);
        };
      }
      // Fallback for older browsers
      else {
        mediaQuery.addListener(handleHoverChange);
        return () => {
          mediaQuery.removeListener(handleHoverChange);
        };
      }
    }, []);

    // Handle hover enter
    const handleMouseEnter = useCallback(() => {
      if (hasHover) {
        setIsUnhovering(false);
      }
    }, [hasHover]);

    // Handle hover leave - trigger unhover immediately
    const handleMouseLeave = useCallback(() => {
      if (hasHover) {
        setIsUnhovering(true);
        // Reset after animation completes
        setTimeout(() => {
          setIsUnhovering(false);
        }, 800);
      }
    }, [hasHover]);

    // Handle click

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        setIsClicked(false);
        setIsUnhovering(false);
      };
    }, []);

    const classes = classNames(
      linkVariants({
        variant,
        size: size || AnimatedLinkSize.MD,
        fontWeight,
      }).join(" "),
      {
        [styles.animatedLink_clicked]: isClicked,
        [styles.animatedLink_unhovering]: isUnhovering,
      },
      [className]
    );

    return (
      <a
        href={href || undefined}
        target={mailto ? "_self" : "_blank"}
        // mailto={mailto || undefined}
        className={classes}
        // onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span className={styles.animatedLink__arrowClone}>
          <ArrowIcon />
        </span>
        <p className={styles.animatedLink__text}>
          {icon && icon}
          {title && title}
        </p>
        <span className={styles.animatedLink__arrow}>
          <ArrowIcon />
        </span>
      </a>
    );
  }
);

AnimatedLink.displayName = "AnimatedLink";
