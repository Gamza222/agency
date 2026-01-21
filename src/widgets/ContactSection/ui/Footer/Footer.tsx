import { classNames } from "@/shared/lib/utils/classNames/classNames";
import styles from "./Footer.module.scss";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlobeIcon from "@/shared/assets/icons/globe.png";
gsap.registerPlugin(ScrollTrigger);

export const Footer = ({ className }: { className?: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  if (!window) return null;
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const getEndPin = () => {
      return `bottom bottom`;
    };

    const startPin = () => {
      if (window.innerWidth / window.innerHeight > 2) {
        return "top top";
      }
      // return "top top-=3";
      return "top top";
    };

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: startPin, // pin starts when canvas touches top
          end: getEndPin,
          pin: contentRef.current,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(sectionRef.current, {
        opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", // Match ContactInfo animation end point
          end: "top 69%", // Give it some scroll distance to fade in
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();
  return (
    <div
      className={classNames(styles.Footer, {}, [className])}
      ref={sectionRef}
    >
      <section className={styles.FooterContent} ref={contentRef}>
        <img src={GlobeIcon} alt="Globe Icon" className={styles.GlobeIcon} />
        <div className={styles.FooterBottom}>
          <div className={styles.FooterBottom__left}>
            <span>© {year} The Warp Studio</span>
          </div>
          <nav className={styles.FooterBottom__right}>
            <a className={styles.link} href="#home">
              <span>/</span>
              <span>Up</span>
            </a>
            <a className={styles.link} href="#about">
              <span>/</span>
              <span>About</span>
            </a>
            <a className={styles.link} href="#works">
              <span>/</span>
              <span>Works</span>
            </a>
            <a className={styles.link} href="#promo">
              <span>/</span>
              <span>Promo</span>
            </a>
            <a className={styles.link} href="#contact">
              <span>/</span>
              <span>Contact</span>
            </a>
          </nav>
        </div>
      </section>
    </div>
  );
};
