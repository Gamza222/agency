"use client";

import { memo, useEffect, useState } from "react";
import { classNames, Mods } from "@/shared/lib/utils/classNames/classNames";
import {
  NAVBAR_ANIMATION,
  NAVBAR_LINKS,
} from "../../../model/types/constants/constants";
import styles from "./NavbarMobileLinks.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import {
  AnimatedLink,
  AnimatedLinkVariant,
} from "@/shared/ui/AnimatedLink/AnimatedLink";
import { AnimatedLinkSize } from "@/shared/ui/AnimatedLink/AnimatedLink.types";
import { useActiveSection } from "../../../lib/useActiveSection";
import TgIcon from "@/shared/assets/icons/media/tg.svg?react";


interface NavbarMobileLinksProps {
  isOpen: boolean;
  onLinkClick?: () => void;
  className?: string;
}

const NavbarMobileLinks = memo(
  ({ isOpen, onLinkClick, className }: NavbarMobileLinksProps) => {
    const activeSection = useActiveSection();
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
      [styles.navbarMobileLinks_closing]: isClosing,
    };

    return (
      <div className={classNames(styles.navbarMobileLinks, mods, [className])}>
       <div className={styles.NavbarWrapper}>
       <nav className={styles.navbarMobileLinks__nav}>
          {NAVBAR_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={onLinkClick}
                className={classNames(styles.navbarMobileLinks__linkWrapper, {
                  [styles.navbarMobileLinks__linkWrapper_active]:
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
              </a>
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
                href="https://t.me/thewarpmedia"
                title="Telegram"
                
                size={AnimatedLinkSize.XL3}
                variant={AnimatedLinkVariant.NAVBAR}

                // fontWeight={AnimatedLinkFontWeight.XL2}
                className={styles.navbarMobileLinks__bottomLink}

                icon={<TgIcon className={styles.iconTg} />}
              />
        </div>
       </div>
      </div>
    );
  }
);

export default NavbarMobileLinks;
