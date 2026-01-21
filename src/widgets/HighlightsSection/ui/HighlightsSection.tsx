"use client";

import { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import { HighlightsInfo } from "./HighlightsInfo/HighlightsInfo";
import { HighlightsPreCanvas } from "./HighlightsPreCanvas/HighlightsPreCanvas";
import { HighlightProject } from "./HighlightProject/HighlightProject";
import styles from "./HighlightsSection.module.scss";
import video1 from "@/shared/assets/icons/video-test.mp4";

gsap.registerPlugin(ScrollTrigger);

export const HighlightsSection = ({ className }: { className?: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  // Store GSAP context in a ref for cleanup
  const ctxRef = useRef<gsap.Context | null>(null);

  // Create refs outside useMemo to prevent re-creation
  const set1Ref = useRef<HTMLDivElement>(null);
  const canvas1Ref = useRef<HTMLDivElement>(null);
  const project1Ref = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);

  const set2Ref = useRef<HTMLDivElement>(null);
  const canvas2Ref = useRef<HTMLDivElement>(null);
  const project2Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);

  const set3Ref = useRef<HTMLDivElement>(null);
  const canvas3Ref = useRef<HTMLDivElement>(null);
  const project3Ref = useRef<HTMLDivElement>(null);
  const bg3Ref = useRef<HTMLDivElement>(null);

  // Memoize sets array to prevent unnecessary re-renders - refs are stable
  const sets = useMemo(
    () => [
      {
        setRef: set1Ref,
        canvasRef: canvas1Ref,
        projectRef: project1Ref,
        bgRef: bg1Ref,
        color: "red",
        title: "BRAND NAME / CREATIVE CAMPAIGN",
        href: "/works/project-1",
        video: video1,
      },
      {
        setRef: set2Ref,
        canvasRef: canvas2Ref,
        projectRef: project2Ref,
        bgRef: bg2Ref,
        color: "blue",
        title: "Armyane",
        href: "/works/project-2",
        video: video1,
      },
      {
        setRef: set3Ref,
        canvasRef: canvas3Ref,
        projectRef: project3Ref,
        bgRef: bg3Ref,
        color: "red",
        title: "Makan RomanProject",
        href: "/works/project-3",
        video: video1,
      },
    ],
    []
  ); // Empty dependency array - sets never change

  if (!window) return null;

  useLayoutEffect(() => {
    if (!sectionRef.current || !window) return;

    // Resize handling is now done by ScrollSmootherProvider
    // This reduces duplicate resize handlers and improves performance

    const ctx = gsap.context(() => {
      sets.forEach(({ setRef, canvasRef, projectRef, bgRef }, index) => {
        const set = setRef.current;
        const canvas = canvasRef.current;
        const project = projectRef.current;
        const bg = bgRef.current;
        if (!set || !canvas || !project || !bg) return;

        // Use function callbacks that read window.innerHeight directly
        // These are only called during ScrollTrigger.refresh() which is already debounced by ScrollSmootherProvider
        // This is more performant than maintaining a separate resize handler
        const getEndPin = () => {
          return `+=${window.innerHeight * 1.5}`;
        };

        const getEndTimeline = () => {
          return `+=${window.innerHeight * 2.5}`;
        };

        // ===== PIN TIMELINE =====
        gsap.timeline({
          scrollTrigger: {
            trigger: set,
            start: "top top-=3", // pin starts when canvas touches top
            end: getEndPin,
            pin: true,
            pinSpacing: false,
            scrub: true,
            pinType: "transform",
            invalidateOnRefresh: true, // Re-enable so ScrollTrigger can recalculate when needed
          },
        });

        // ===== CANVAS + PROJECT TIMELINE =====
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: set,
            start: "top bottom",
            end: getEndTimeline,
            scrub: true,
            invalidateOnRefresh: true, // Re-enable so ScrollTrigger can recalculate when needed
          },
        });

        // Canvas entrance
        timeline.fromTo(
          canvas,
          {
            y: "360%",
            x: "25%",
            rotate: 20,
            transformOrigin: "0% 0%",
            ease: "none",
          },
          { y: "0%", x: "0%", rotate: 0, ease: "none", duration: 40 },
          0
        );

        // Project entrance starts **right after canvas finishes**
        timeline.fromTo(
          project,
          { y: "90%", x: "20%", rotate: 15, ease: "none" },
          { y: "0%", x: "0%", rotate: 0, ease: "none", duration: 40 },
          16
        );
        timeline.fromTo(
          set,
          {
            backgroundColor: "transparent",
            ease: "none",
          },
          { backgroundColor: "#dddee2", duration: 16 },
          40
        );

        timeline.to(
          canvas,
          {
            y: index === 2 ? "-200%" : "-400%",

            // y: "0",
            x: index === 2 ? "-4.5%" : "-15%",
            // x: "0",
            rotate: index === 2 ? -2 : -6,
            // rotate: 0,
            ease: "power1.out",
            immediateRender: false,
            duration: 44,
          },
          56
        );
        timeline.to(
          project,
          {
            y: index === 2 ? "-100%" : "-125%",
            // y: 0,
            x: index === 2 ? "-2.5%" : "-7%",
            // x: 0,
            rotate: index === 2 ? -2 : -6,
            // rotate: 0,
            immediateRender: false,
            duration: 44,
            ease: "none",
          },
          56
        );
      });
    }, sectionRef);

    // Store context for cleanup
    ctxRef.current = ctx;

    return () => {
      // Resize handling is now done by ScrollSmootherProvider - no cleanup needed
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={classNames(styles.highlightsSection, {}, [className])}
      id="works"
    >
      <HighlightsInfo />
      {/* <div style={{ height: "4dvh" }} /> */}
      {sets.map((set, i) => (
        <div
          key={i}
          ref={set.setRef}
          className={styles.highlightsSection__container}
        >
          <div
            ref={set.bgRef}
            className={styles.highlightsSection__containerBg}
          />
          <HighlightsPreCanvas
            title={set.title}
            href={set.href}
            containerRef={set.canvasRef}
          />
          <HighlightProject
            containerRef={set.projectRef}
            color={set.color}
            video={set.video}
            href={set.href}
          />
        </div>
      ))}
    </section>
  );
};
