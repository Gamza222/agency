"use client";

import React, { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { classNames, Mods } from "@/shared/lib/utils/classNames/classNames";
import {
  NAVBAR_ANIMATION,
  NAVBAR_LINKS,
} from "../../../model/types/constants/constants";
import styles from "./NavbarMobileLinks.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { Link } from "react-router-dom";
import {
  AnimatedLink,
  AnimatedLinkVariant,
} from "@/shared/ui/AnimatedLink/AnimatedLink";
import { AnimatedLinkSize } from "@/shared/ui/AnimatedLink/AnimatedLink.types";

interface NavbarMobileLinksProps {
  isOpen: boolean;
  className?: string;
}

const NavbarMobileLinks = memo(
  ({ isOpen, className }: NavbarMobileLinksProps) => {
    const location = useLocation();
    const pathname = location.pathname;
    const [shouldRender, setShouldRender] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
      if (isOpen) {
        // When opening, render immediately and reset closing state
        setShouldRender(true);
        setIsClosing(false);
        return undefined;
      } else if (shouldRender) {
        // When closing, start closing animation
        setIsClosing(true);
        // Unmount after animation completes
        const timer = setTimeout(() => {
          setShouldRender(false);
          setIsClosing(false);
        }, NAVBAR_ANIMATION.MOBILE_LINKS_SLIDE_DURATION * 1000);

        return () => clearTimeout(timer);
      }
      return undefined;
    }, [isOpen, shouldRender]);

    if (!shouldRender) return null;

    const mods: Mods = {
      [styles.navbarMobileLinks_closing as string]: isClosing,
    };

    return (
      <div className={classNames(styles.navbarMobileLinks, mods, [className])}>
        <nav className={styles.navbarMobileLinks__nav}>
          {NAVBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={classNames(styles.navbarMobileLinks__linkWrapper, {
                  [styles.navbarMobileLinks__linkWrapper_active as string]:
                    isActive,
                })}
              >
                <span
                  className={styles.navbarMobileLinks__linkIndicator}
                ></span>
                <Text
                  variant={TextVariant.PRIMARY}
                  size={TextSize.XL5}
                  as="span"
                  className={styles.navbarMobileLinks__link}
                >
                  {link.label}
                </Text>
              </Link>
            );
          })}
        </nav>
        <div className={styles.navbarMobileLinks__bottom}>
          <Text
            variant={TextVariant.PRIMARY}
            size={TextSize.MD}
            as="span"
            className={styles.navbarMobileLinks__bottomText}
          >
            / let's talk
          </Text>
          <AnimatedLink
            href="/contact"
            title="@the_warp_agency"
            variant={AnimatedLinkVariant.NAVBAR}
            size={AnimatedLinkSize.XL3}
            className={styles.navbarMobileLinks__bottomLink}
          />
        </div>
      </div>
    );
  }
);

export default NavbarMobileLinks;
