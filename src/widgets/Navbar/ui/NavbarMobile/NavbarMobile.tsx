"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
import { classNames, Mods } from "@/shared/lib/utils/classNames/classNames";
import type { NavbarProps } from "../../types/types";
import {
  NAVBAR_ANIMATION,
  NAVBAR_STYLING,
} from "../../model/types/constants/constants";
import NavbarBrand from "../NavbarBrand/NavbarBrand";
import NavbarMobileLinks from "./NavbarMobileLinks/NavbarMobileLinks";
import styles from "./NavbarMobile.module.scss";
import { Button, ButtonVariant } from "@/shared/ui/Button";
import { useIsOnLightBackground } from "../../lib/useIsOnLightBackground";

const NavbarMobile = memo((props: NavbarProps) => {
  const { className, disabled = false } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const isOnLightBackgroundFromScroll = useIsOnLightBackground();
  
  // Override: when navbar is open, always use white colors (override scroll-based logic)
  const isOnLightBackground = isOpen ? true : isOnLightBackgroundFromScroll;

  // Track if hamburger has been opened at least once (to prevent closing animation on first load)
  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  const style = {
    "--brand-fade-duration": `${NAVBAR_ANIMATION.BRAND_FADE_DURATION}s`,
    "--hamburger-flicker-duration": `${NAVBAR_ANIMATION.FLICKER_DURATION - 0.1}s`,
    "--hamburger-delay": `${NAVBAR_ANIMATION.HAMBURGER_DELAY}s`,
    "--navbar-z-index": NAVBAR_STYLING.Z_INDEX,
    pointerEvents: disabled ? "none" : "auto",
  } as React.CSSProperties;

  const toggleNavbar = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
  }, [isOpen, disabled]);

  const closeNavbar = useCallback(() => {
    if (disabled) return;
    setIsOpen(false);
  }, [disabled]);

  const hamburgerMods: Mods = {
    [styles.navbar__hamburger_open]: isOpen,
    [styles.navbar__hamburger_hasBeenOpened]: hasBeenOpened,
  };

  return (
    <>
      <nav
        className={classNames(
          styles.navbarMobile,
          {
            [styles.navbarMobile_open]: isOpen,
            [styles.navbarMobile_lightBackground]: isOnLightBackground,
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

          {/* Right: Hamburger */}
          <Button
            className={classNames(styles.navbar__hamburger, {
              ...hamburgerMods,
            })}
            variant={ButtonVariant.CLEAR}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            type="button"
            onClick={toggleNavbar}
          >
            <span
              className={classNames(styles.navbar__hamburgerLine, {
                [styles.navbar__hamburgerLine_lightBackground]:
                  isOnLightBackground,
              })}
            ></span>
            <span
              className={classNames(styles.navbar__hamburgerLine, {
                [styles.navbar__hamburgerLine_lightBackground]:
                  isOnLightBackground,
              })}
            ></span>
          </Button>
        </div>
      </nav>
      <NavbarMobileLinks isOpen={isOpen} onLinkClick={closeNavbar} />
    </>
  );
});

export default NavbarMobile;
