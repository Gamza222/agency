"use client";

import React, { memo } from "react";
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
import { useActiveSection } from "../../lib/useActiveSection";
import { useIsOnLightBackground } from "../../lib/useIsOnLightBackground";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";

const NavbarDesktop = memo((props: NavbarProps) => {
  const { className, disabled = false } = props;
  const activeSection = useActiveSection();
  const isOnLightBackground = useIsOnLightBackground();

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
      className={classNames(
        styles.navbarDesktop,
        {
          [styles.navbarDesktop_lightBackground]: isOnLightBackground,
        },
        [className]
      )}
      style={style}
    >
      <div className={styles.navbar__container}>
        <NavbarBrand
          brandText={NAVBAR_STYLING.BRAND_TEXT}
          isOnLightBackground={isOnLightBackground}
        />

        {/* Center: Nav Links with Dividers */}
        <div className={styles.navbar__nav}>
          {NAVBAR_LINKS.map((link, index) => (
            <React.Fragment key={link.href}>
              {index > 0 && (
                <span
                  className={classNames(styles.navbar__divider, {
                    [styles.navbar__divider_lightBackground]:
                      isOnLightBackground,
                  })}
                  style={
                    {
                      "--divider-index": index - 1,
                    } as React.CSSProperties
                  }
                >
                  /
                </span>
              )}
              <a
                href={link.href}
                className={classNames(styles.navbar__link, {
                  [styles.navbar__link_active]:
                    activeSection === link.href,
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
                  size={TextSize.SM}
                  fontWeight={TextFontWeight.XL}
                  className={classNames(styles.navbar__linkText, {
                    [styles.navbar__linkText_lightBackground]:
                      isOnLightBackground,
                  })}
                >
                  {link.label}
                </Text>
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
});

export default NavbarDesktop;
