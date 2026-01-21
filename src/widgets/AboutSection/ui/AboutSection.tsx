"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import { Text, TextSize, TextVariant } from "@/shared/ui/Text";
import { TextFontWeight } from "@/shared/ui/Text/Text.types";
import { AboutInfo } from "./AboutInfo/AboutInfo";
import { PhotosContainer } from "./photos/PhotosContainer";
import styles from "./AboutSection.module.scss";

gsap.registerPlugin(ScrollTrigger);

interface ParagraphData {
  title: string;
  content: string[];
  content2?: string[];
}

export const AboutSection = ({ className }: { className?: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);
  const textBottomRef = useRef<HTMLDivElement>(null);

  // Paragraph data - can be moved to props or constants
  const paragraphs: ParagraphData[] = [
    {
      title: "Who We Are",
      content: [
        "The Warp is a creative video studio producing high-impact short and long-form content for crypto brands, influencers, and companies worldwide.",
        // "We specialize in cinematic storytelling, performance-driven edits, and scalable production systems built for fast-moving digital culture.",
      ],
    },
  ];

  const whatWeDo: ParagraphData[] = [
    {
      title: "What We Do",
      content: [
        "Video creation & editing",
        "Short-form & long-form content",
        "High-end post-production",
        "Crypto & Web3 media",
        "Platform-native delivery for YouTube, X, TikTok, Reels, and ads",
      ],
      content2: [
        "Influencer & personal brand content",
        "Campaign & launch videos",
        "Motion graphics & visual effects",
      ],
    },
  ];

  // useLayoutEffect(() => {
  //   if (!sectionRef.current) return;

  //   const ctx = gsap.context(() => {
  //     // Animate topText child elements separately
  //     if (topTextRef.current) {
  //       const paragraphs = topTextRef.current.querySelectorAll(
  //         `.${styles.aboutSection__content__text__paragraph}`
  //       );

  //       paragraphs.forEach((paragraph) => {
  //         const title = paragraph.querySelector(
  //           `.${styles.aboutSection__content__text__paragraph__title}`
  //         );
  //         const contentItems = paragraph.querySelectorAll(
  //           `.${styles.aboutSection__content__text__paragraph__content}, .${styles.whatwedoList__Item}`
  //         );

  //         // Animate title - each title has its own trigger
  //         if (title) {
  //           gsap.fromTo(
  //             title,
  //             { opacity: 0 },
  //             {
  //               opacity: 1,
  //               ease: "none",
  //               scrollTrigger: {
  //                 trigger: title as Element,
  //                 start: "bottom bottom",
  //                 end: "bottom 85%",
  //                 scrub: true,
  //                 invalidateOnRefresh: true,
  //               },
  //             }
  //           );
  //         }

  //         // Animate each content item individually - each item has its own trigger
  //         contentItems.forEach((item) => {
  //           gsap.fromTo(
  //             item,
  //             { opacity: 0 },
  //             {
  //               opacity: 1,
  //               ease: "none",
  //               scrollTrigger: {
  //                 trigger: item as Element,
  //                 start: "bottom bottom",
  //                 end: "bottom 85%",
  //                 scrub: true,
  //                 invalidateOnRefresh: true,
  //               },
  //             }
  //           );
  //         });
  //       });
  //     }

  //     // Animate textBottom elements separately - each text element has its own trigger
  //     if (textBottomRef.current) {
  //       const textElements = textBottomRef.current.querySelectorAll("p");

  //       textElements.forEach((textEl) => {
  //         gsap.fromTo(
  //           textEl,
  //           { opacity: 0 },
  //           {
  //             opacity: 1,
  //             ease: "none",
  //             scrollTrigger: {
  //               trigger: textEl as Element,
  //               start: "bottom bottom",
  //               end: "bottom 85%",
  //               scrub: true,
  //               invalidateOnRefresh: true,
  //             },
  //           }
  //         );
  //       });
  //     }
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <section
      ref={sectionRef}
      id="aboutsection"
      className={classNames(styles.aboutSection, {}, [className])}
    >
      <AboutInfo />
      <div className={styles.aboutSection__content} ref={contentRef}>
        <div className={styles.aboutSection__content__photos}>
          <PhotosContainer />
        </div>
        <div className={styles.aboutSection__content__text}>
          <div className={styles.aboutSection__topText} ref={topTextRef}>
            {paragraphs.map((paragraph, index) => (
              <div
                key={index}
                className={styles.aboutSection__content__text__paragraph}
              >
                <Text
                  variant={TextVariant.SECONDARY}
                  size={TextSize.MD}
                  as="h3"
                  fontWeight={TextFontWeight.LG}
                  className={
                    styles.aboutSection__content__text__paragraph__title
                  }
                >
                  / {paragraph.title}
                </Text>
                <div
                  className={
                    styles.aboutSection__content__text__paragraph__content__list
                  }
                >
                  {paragraph.content.map((item, index) => (
                    <Text
                      key={index}
                      variant={TextVariant.SECONDARY}
                      size={TextSize.LG}
                      as="p"
                      fontWeight={TextFontWeight.LG}
                      className={
                        styles.aboutSection__content__text__paragraph__content
                      }
                    >
                      {item}
                    </Text>
                  ))}
                </div>
              </div>
            ))}
            {whatWeDo.map((paragraph, index) => (
              <div
                key={index}
                className={styles.aboutSection__content__text__paragraph}
              >
                <Text
                  variant={TextVariant.SECONDARY}
                  size={TextSize.MD}
                  as="h3"
                  fontWeight={TextFontWeight.LG}
                  className={
                    styles.aboutSection__content__text__paragraph__title
                  }
                >
                  / {paragraph.title}
                </Text>
                <div className={styles.whatwedoList}>
                  <ul className={styles.whatwedoList__ItemList}>
                    {paragraph.content.map((item, index) => (
                      <li
                        key={index}
                        className={styles.whatwedoList__ItemWrapper}
                      >
                        {/* <span className={styles.whatwedoList__Item__bullet}>
                          -
                        </span> */}
                        <Text
                          variant={TextVariant.SECONDARY}
                          size={TextSize.SM}
                          as="p"
                          fontWeight={TextFontWeight.XL}
                          className={styles.whatwedoList__Item}
                        >
                          {item}
                        </Text>
                      </li>
                    ))}
                  </ul>
                  <ul className={styles.whatwedoList__ItemList}>
                    {paragraph.content2?.map((item, index) => (
                      <li
                        key={index}
                        className={styles.whatwedoList__ItemWrapper}
                      >
                        {/* <span className={styles.whatwedoList__Item__bullet}>
                          -
                        </span> */}
                        <Text
                          key={index}
                          variant={TextVariant.SECONDARY}
                          size={TextSize.SM}
                          as="p"
                          fontWeight={TextFontWeight.XL}
                          className={styles.whatwedoList__Item}
                        >
                          {item}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.aboutSection__textBottom} ref={textBottomRef}>
            <Text
              variant={TextVariant.SECONDARY}
              size={TextSize.XL}
              as="p"
              fontWeight={TextFontWeight.XL2}
            >
              "Visual pleasure"
            </Text>
            <Text
              variant={TextVariant.SECONDARY}
              size={TextSize.MD}
              as="p"
              fontWeight={TextFontWeight.XL}
            >
              – STANLEY KUBRICK
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

AboutSection.displayName = "AboutSection";
