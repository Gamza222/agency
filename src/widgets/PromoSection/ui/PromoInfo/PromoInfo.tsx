import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AfterEffectsIcon from "@/shared/assets/tech/afterEffects.svg?react";
import PremierProIcon from "@/shared/assets/tech/premierPro.svg?react";
import IllustratorIcon from "@/shared/assets/tech/illustrator.svg?react";
import PhotoshopIcon from "@/shared/assets/tech/photoshop.svg?react";
import AserpriteIcon from "@/shared/assets/tech/aserprite.svg?react";
import BlenderIcon from "@/shared/assets/tech/blender.svg?react";
import FigmaIcon from "@/shared/assets/tech/figma.svg?react";
import Cinema4DIcon from "@/shared/assets/tech/cinema.svg?react";
import AffinityIcon from "@/shared/assets/icons/affinity.svg?react";
import ProcreateIcon from "@/shared/assets/tech/procreate.svg?react";
import styles from "./PromoInfo.module.scss";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    icon: <PremierProIcon className={styles.promoInfo__icon} />,
    title: "Adobe Premiere Pro",
  },
  {
    icon: <FigmaIcon className={styles.promoInfo__iconFigma} />,
    title: "Figma",
  },

  {
    icon: <BlenderIcon className={styles.promoInfo__icon} />,
    title: "Blender",
  },

  {
    icon: <Cinema4DIcon className={styles.promoInfo__icon} />,
    title: "Cinema 4D",
  },

  {
    icon: <AserpriteIcon className={styles.promoInfo__icon} />,
    title: "Aseprite",
  },
  {
    icon: <AfterEffectsIcon className={styles.promoInfo__icon} />,
    title: "After Effects",
  },
  {
    icon: <AffinityIcon className={styles.promoInfo__iconAffinity} />,
  },
  {
    icon: <PhotoshopIcon className={styles.promoInfo__icon} />,
    title: "Adobe Photoshop",
  },

  {
    icon: <ProcreateIcon className={styles.promoInfo__iconProcreate} />,
  },
  {
    icon: <IllustratorIcon className={styles.promoInfo__icon} />,
    title: "Adobe illustrator",
  },
];

export const PromoInfo = () => {
  const containerRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Get all separators and titles
      const separators = el.querySelectorAll(`.${styles.promoInfo__separator}`);
      const titles = el.querySelectorAll(`.${styles.promoInfo__title}`);

      if (separators.length === 0 && titles.length === 0) return;

      // Create a paused timeline that will auto-play when triggered
      const timeline = gsap.timeline({ paused: true });

      // Animate separators with stagger
      if (separators.length > 0) {
        const separatorCount = separators.length;
        const separatorStagger = 0.1; // Delay between each separator
        const itemStagger = 0.06; // Delay between each separator
        const separatorDuration = 0.001; // Duration for each separator animation

        // Total time for separators to complete
        const totalSeparatorTime =
          separatorCount * separatorStagger + separatorDuration;

        timeline.fromTo(
          separators,
          { opacity: 0 },
          {
            opacity: 1,
            duration: separatorDuration,
            ease: "power2.out",
            stagger: separatorStagger,
          },
          0
        );

        // Animate titles starting at 60% of separator animation
        if (titles.length > 0) {
          const titleStartTime = totalSeparatorTime * 0.6; // 60% progress

          timeline.fromTo(
            titles,
            { opacity: 0 },
            {
              opacity: 1,
              duration: separatorDuration,
              ease: "power2.out",
              stagger: itemStagger,
            },
            titleStartTime
          );
        }
      }

      // Use ScrollTrigger to play the timeline when section reaches 90% from top
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%", // When section top is at 90% of viewport height
        onEnter: () => {
          timeline.play();
        },
        once: true,
        invalidateOnRefresh: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <ul ref={containerRef} className={styles.promoInfo}>
      {items.map((item, index) => (
        <React.Fragment key={`${item.title}-${index}`}>
          <li className={styles.promoInfo__item}>
            {index > 0 && (
              <span className={styles.promoInfo__separator}>/</span>
            )}
            <div className={styles.promoInfo__title}>
              {item.icon}
              {item.title && (
                <Text
                  variant={TextVariant.SECONDARY}
                  size={TextSize.XL4}
                  fontWeight={TextFontWeight.XL}
                >
                  {item.title}
                </Text>
              )}
            </div>
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
};

PromoInfo.displayName = "PromoInfo";
