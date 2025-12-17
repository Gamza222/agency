"use client";

import React, { memo } from "react";
import { usePathname } from "next/navigation";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import type { NavbarProps } from "../../types/types";
import {
  NAVBAR_ANIMATION,
  NAVBAR_LINKS,
  NAVBAR_STYLING,
} from "../../model/types/constants/constants";
import NavbarBrand from "../NavbarBrand/NavbarBrand";
import styles from "./NavbarDesktop.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import Link from "next/link";

const NavbarDesktop = memo((props: NavbarProps) => {
  const { className, disabled = false } = props;
  const pathname = usePathname();

  const style = {
    "--brand-fade-duration": `${NAVBAR_ANIMATION.BRAND_FADE_DURATION}s`,
    "--divider-fade-duration": `${NAVBAR_ANIMATION.DIVIDER_FADE_DURATION}s`,
    "--divider-delay-step": `${NAVBAR_ANIMATION.DIVIDER_DELAY}s`,
    "--link-flicker-duration": `${NAVBAR_ANIMATION.FLICKER_DURATION}s`,
    "--dividers-total-count": NAVBAR_LINKS.length - 1,
    "--navbar-z-index": NAVBAR_STYLING.Z_INDEX,
    pointerEvents: disabled ? "none" : "auto",
  } as React.CSSProperties;

  return (
    <nav
      className={classNames(styles.navbarDesktop, {}, [className])}
      style={style}
    >
      <div className={styles.navbar__container}>
        <NavbarBrand brandText={NAVBAR_STYLING.BRAND_TEXT} />

        {/* Center: Nav Links with Dividers */}
        <div className={styles.navbar__nav}>
          {NAVBAR_LINKS.map((link, index) => (
            <React.Fragment key={link.href}>
              {index > 0 && (
                <span
                  className={styles.navbar__divider}
                  style={
                    {
                      "--divider-index": index - 1,
                    } as React.CSSProperties
                  }
                >
                  /
                </span>
              )}
              <Link
                href={link.href}
                className={classNames(styles.navbar__link, {
                  [styles.navbar__link_active as string]:
                    pathname === link.href,
                })}
                style={
                  {
                    "--link-index": index,
                  } as React.CSSProperties
                }
              >
                <span className={styles.navbar__linkIndicator}></span>
                <Text
                  as="span"
                  variant={TextVariant.PRIMARY}
                  size={TextSize.MD}
                  className={styles.navbar__linkText}
                >
                  {link.label}
                </Text>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
});

export default NavbarDesktop;
