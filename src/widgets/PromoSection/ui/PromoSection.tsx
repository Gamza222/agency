import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import { PromoInfo } from "./PromoInfo/PromoInfo";
import { PromoContainer } from "./promo/PromoContainer";
import styles from "./PromoSection.module.scss";
import { AnimatedBackground } from "@/widgets/AnimatedBackground";
import { PromoLine } from "./PromoLine/PromoLine";

gsap.registerPlugin(ScrollTrigger);

export const PromoSection = ({ className }: { className?: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Additional animations can be added here if needed
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="promosection"
      className={classNames(styles.promoSection, {}, [className])}
    >
      <PromoLine
        items={["ONE FREE VIDEO", "UP TO 45 SECONDS", "NO OBLIGATION"]}
        speed={120}
      />
      {/* <PromoLine
        items={["PROMOTIONAL", "ADVERTISING", "SOCIAL CONTENT"]}
        speed={125}
        direction={true}
      /> */}
      <AnimatedBackground className={styles.promoSection__background} />
    </section>
  );
};

PromoSection.displayName = "PromoSection";

{
  /* <PromoInfo /> */
}
//   <div className={styles.promoSection__content} ref={contentRef}>
//     <div className={styles.promoSection__content__promo}>
//       <PromoContainer />
//     </div>
//     <div className={styles.promoSection__content__text}>
//       <div className={styles.promoSection__topText}>
//         {/* Content will be added here */}
//       </div>
//       <div className={styles.promoSection__textBottom}>
//         {/* Content will be added here */}
//       </div>
//     </div>
//   </div>
