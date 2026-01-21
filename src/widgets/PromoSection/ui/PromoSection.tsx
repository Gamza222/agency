import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import { PromoInfo } from "./PromoInfo/PromoInfo";
import styles from "./PromoSection.module.scss";
import { AnimatedBackground } from "@/widgets/AnimatedBackground";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";
import ArrowIcon from "@/shared/assets/icons/arrow.svg?react";
import { PromoInformation } from "@/widgets/PromoSection/ui/PromoInformation/PromoInformation";

gsap.registerPlugin(ScrollTrigger);

export const PromoSection = ({ className }: { className?: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  if (!window) return null;
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const getEndPin = () => {
      return `+=${window.innerHeight * 1}`;
    };

    const startPin = () => {
      if (window.innerWidth / window.innerHeight > 2) {
        return "bottom bottom";
      }
      // return "top top-=3";
      return "bottom bottom";
    };

    const endBg = () => {
      return `+=${window.innerHeight * 0.8}`;
    };
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        // gsap.timeline({
        //   scrollTrigger: {
        //     trigger: bgRef.current,
        //     start: startPin, // pin starts when canvas touches top
        //     end: getEndPin,
        //     pin: true,
        //     pinType: "transform",
        //     pinSpacing: false,
        //     anticipatePin: 1,
        //     scrub: true,
        //     invalidateOnRefresh: true,
        //   },
        // });

        const backgroundElement = bgRef.current.querySelector(
          `.${styles.promoSection__background}`
        ) as HTMLElement;

        const secondBgElement =
          backgroundElement?.firstElementChild as HTMLElement;

        const thirdBgElement = bgRef.current.querySelector(
          `.${styles.promoSection__background__text__container}`
        ) as HTMLElement;
        if (!backgroundElement || !secondBgElement || !thirdBgElement) return;
        if (backgroundElement) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: bgRef.current,
                start: "top bottom",
                end: endBg,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              backgroundElement,
              { y: "90%", x: "20%", rotate: 15 },
              { y: "0%", x: "0%", rotate: 0, ease: "inOut", duration: 40 },
              0
            )
            .fromTo(
              secondBgElement,
              { y: "90%", x: "20%", rotate: 15 },
              { y: "0%", x: "0%", rotate: 0, ease: "inOut", duration: 40 },
              8
            )
            .fromTo(
              thirdBgElement,
              { y: "90%", x: "20%", rotate: 15 },
              { y: "0%", x: "0%", rotate: 0, ease: "inOut", duration: 40 },
              8
            );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="promosection"
      className={classNames(styles.promoSection, {}, [className])}
    >
      <Text
        variant={TextVariant.SECONDARY}
        size={TextSize.MD}
        as="h3"
        fontWeight={TextFontWeight.LG}
        className={styles.aboutSection__content__text__paragraph__title}
      >
        / TRY US BEFORE YOU COMMIT
      </Text>
      {/* <PromoLine
        items={["One Free Video", "Up to 45 Seconds", "No Obligation"]}
        speed={9}
        direction={true}
      />
      <PromoLine
        items={["Promotional", "Advertising", "Social Content"]}
        speed={10}
      />
      */}
      <PromoInfo />
      <div ref={bgRef}>
        <AnimatedBackground
          id="promobg"
          className={styles.promoSection__background}
        >
          <div className={styles.promoSection__background__text__container}>
            <div className={styles.promoSection__background__textTopContainer}>
              <Text
                className={styles.promoSection__background__textTop}
                variant={TextVariant.PRIMARY}
                size={TextSize.SM}
                fontWeight={TextFontWeight.XL}
                as="span"
              >
                REALLY?
              </Text>
              <Text
                className={styles.promoSection__background__textTop}
                variant={TextVariant.PRIMARY}
                size={TextSize.SM}
                fontWeight={TextFontWeight.XL}
                as="span"
              >
                3:15
              </Text>
              <Text
                className={styles.promoSection__background__textTop}
                variant={TextVariant.PRIMARY}
                size={TextSize.SM}
                fontWeight={TextFontWeight.XL}
                as="span"
              >
                THE WARP © MXBELY
              </Text>
            </div>
            <Text
              className={styles.promoSection__background__text}
              variant={TextVariant.PRIMARY}
              size={TextSize.XL6}
              fontWeight={TextFontWeight.XL}
              as="span"
            >
              Literally Free
            </Text>
            <PromoInformation />
            <div className={styles.promoSection__background__textBottom}>
              <ArrowIcon className={styles.Arrow} name="arrow-down" />
            </div>
          </div>
        </AnimatedBackground>
      </div>
    </section>
  );
};

PromoSection.displayName = "PromoSection";

// We offer a one-time free video edit (up to 45 seconds) for anyone
//             considering working with us. You can use it for a promotion,
//             advertisement, social media post, or any short-form content you
//             need. This allows you to evaluate our editing quality, pacing, and
//             creative direction using your own material. If you like the result,
//             we continue with a paid collaboration. If not, there’s no
//             obligation.
