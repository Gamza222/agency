import { classNames } from "@/shared/lib/utils/classNames/classNames";
import styles from "./Contact.module.scss";
import { AnimatedLink } from "@/shared/ui/AnimatedLink/AnimatedLink";
import { ContactInfo } from "./ContactInfo/ContactInfo";
import {
  TextFontWeight,
  TextSize,
  TextVariant,
} from "@/shared/ui/Text/Text.types";
import { Text } from "@/shared/ui/Text";
import {
  AnimatedLinkFontWeight,
  AnimatedLinkSize,
} from "@/shared/ui/AnimatedLink/AnimatedLink.types";

import TgIcon from "@/shared/assets/icons/media/tg.svg?react";
import YoutubeIcon from "@/shared/assets/icons/media/youtube.svg?react";
import XIcon from "@/shared/assets/icons/media/x.svg?react";
import MailIcon from "@/shared/assets/icons/media/mail.svg?react";

import Logo from "@/shared/assets/icons/logo-bg-01.svg?react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Contact = ({ className }: { className?: string }) => {
  return (
    <section className={classNames(styles.Contact, {}, [className])}>
      <ContactInfo />
      <div className={styles.ContactContentWrapper}>
        <div className={styles.ContactContent}>
          <Text
            variant={TextVariant.SECONDARY}
            size={TextSize.MD}
            as="h3"
            fontWeight={TextFontWeight.LG}
            className={styles.ContactInfo__content__info}
          >
            / CHIEF MANAGER
          </Text>
          <nav className={styles.ContactContent__list}>
            <li className={styles.ContactContent__list__item}>
              {/* <div className={styles.ContactContent__list__item__content}>
                <TgIcon className={styles.icon} />
                <Text
                  variant={TextVariant.SECONDARY}
                  size={TextSize.XL3}
                  as="h3"
                  fontWeight={TextFontWeight.XL2}
                  className={styles.ContactInfo__content__info}
                >
                  Telegram:
                </Text>
              </div> */}
              <AnimatedLink
                href="https://t.me/thewarpmedia"
                title="Telegram"
                // title="@TheWarpMedia"
                size={AnimatedLinkSize.XL3}
                fontWeight={AnimatedLinkFontWeight.XL2}
                className={styles.link}
                icon={<TgIcon className={styles.iconTg} />}
              />
            </li>
            <li className={styles.ContactContent__list__item}>
              {/* <div className={styles.ContactContent__list__item__content}>
                <TgIcon className={styles.icon} />
                <Text
                  variant={TextVariant.SECONDARY}
                  size={TextSize.XL3}
                  as="h3"
                  fontWeight={TextFontWeight.XL2}
                  className={styles.ContactInfo__content__info}
                >
                  Telegram:
                </Text>
              </div> */}
              <AnimatedLink
                href="mailto:thewarpmedia@proton.me"
                title={"Mail"}
                mailto={true}
                // title="@TheWarpMedia"
                size={AnimatedLinkSize.XL3}
                fontWeight={AnimatedLinkFontWeight.XL2}
                className={styles.link}
                icon={<MailIcon className={styles.iconMail} />}
              />
            </li>
          </nav>
        </div>
        <div className={styles.ContactContent}>
          <Text
            variant={TextVariant.SECONDARY}
            size={TextSize.MD}
            as="h3"
            fontWeight={TextFontWeight.LG}
            className={styles.ContactInfo__content__info}
          >
            / SOCIALS
          </Text>
          <nav className={styles.ContactContent__list}>
            <li className={styles.ContactContent__list__item}>
              <AnimatedLink
                href="https://www.youtube.com/@TheWarpProduction"
                title="YouTube"
                size={AnimatedLinkSize.XL3}
                fontWeight={AnimatedLinkFontWeight.XL2}
                className={styles.link}
                icon={<YoutubeIcon className={styles.iconYoutube} />}
              />
            </li>
            <li className={styles.ContactContent__list__item}>
              <AnimatedLink
                href="https://x.com/TheWarpMedia"
                title="TheWarpMedia"
                size={AnimatedLinkSize.XL3}
                fontWeight={AnimatedLinkFontWeight.XL2}
                className={styles.link}
                icon={<XIcon className={styles.iconX} />}
              />
            </li>
          </nav>
        </div>
      </div>
      <div className={styles.LogoWrapper}>
        <Logo className={styles.logo} />
      </div>
    </section>
  );
};
