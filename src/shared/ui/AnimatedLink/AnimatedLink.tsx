"use client";

import React, { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
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
    title,
    size = AnimatedLinkSize.MD,
    variant = AnimatedLinkVariant.DEFAULT,
    fontWeight = AnimatedLinkFontWeight.MD,
    className,
    onClick,
    ...props
  }: AnimatedLinkProps) => {
    const [isClicked, setIsClicked] = useState(false);
    const [isUnhovering, setIsUnhovering] = useState(false);

    const hasHover = useMemo(() => {
      if (typeof window === "undefined") return true;
      return window.matchMedia("(hover: hover)").matches;
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
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (hasHover) {
          // Desktop: trigger unhover effect immediately (even if hover animation not finished)
          setIsUnhovering(true);
        } else {
          // Mobile: trigger flicker and stay hidden
          setIsClicked(true);
        }

        onClick?.(e);
      },
      [hasHover, onClick]
    );

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
        [styles.animatedLink_clicked as string]: isClicked,
        [styles.animatedLink_unhovering as string]: isUnhovering,
      },
      [className]
    );

    return (
      <Link
        href={href}
        className={classes}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span className={styles.animatedLink__arrowClone}>
          <ArrowIcon />
        </span>
        <p className={styles.animatedLink__text}>{title}</p>
        <span className={styles.animatedLink__arrow}>
          <ArrowIcon />
        </span>
      </Link>
    );
  }
);

AnimatedLink.displayName = "AnimatedLink";
