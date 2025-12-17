"use client";

import React, { memo, useCallback, useState } from "react";
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

const NavbarMobile = memo((props: NavbarProps) => {
  const { className, disabled = false } = props;
  const [isOpen, setIsOpen] = useState(false);

  const style = {
    "--brand-fade-duration": `${NAVBAR_ANIMATION.BRAND_FADE_DURATION}s`,
    "--hamburger-flicker-duration": `${NAVBAR_ANIMATION.FLICKER_DURATION - 0.03}s`,
    "--hamburger-delay": `${NAVBAR_ANIMATION.HAMBURGER_DELAY}s`,
    "--navbar-z-index": NAVBAR_STYLING.Z_INDEX,
    pointerEvents: disabled ? "none" : "auto",
  } as React.CSSProperties;

  const toggleNavbar = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
    console.log(isOpen);
  }, [isOpen, disabled]);

  const hamburgerMods: Mods = {
    [styles.navbar__hamburger_open as string]: isOpen,
  };

  return (
    <>
      <nav
        className={classNames(
          styles.navbarMobile,
          { [styles.navbarMobile_open as string]: isOpen },
          [className]
        )}
        style={style}
      >
        <div className={styles.navbar__container}>
          <NavbarBrand brandText={NAVBAR_STYLING.BRAND_TEXT} />

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
            <span className={styles.navbar__hamburgerLine}></span>
            <span className={styles.navbar__hamburgerLine}></span>
          </Button>
        </div>
      </nav>
      <NavbarMobileLinks isOpen={isOpen} />
    </>
  );
});

export default NavbarMobile;
