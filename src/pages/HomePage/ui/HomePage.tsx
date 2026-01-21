"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useLayoutEffect,
} from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoadingScreen, LoadingScreenMode } from "@/widgets/LoadingScreen";
import { AppBackground } from "@/widgets/AppBackground";
import styles from "./HomePage.module.scss";
import { HighlightsSection } from "@/widgets/HighlightsSection";
import { AboutSection } from "@/widgets/AboutSection";
import { PromoSection } from "@/widgets/PromoSection";
import { ContactSection } from "@/widgets/ContactSection";
import {
  SCROLL_ANIMATION_TRANSFORMS,
  SCROLL_ANIMATION_BREAKPOINT,
} from "@/widgets/LoadingScreen/lib/constants/scroll-animation.constants";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

interface HomePageProps {}

export const HomePage = memo((props: HomePageProps) => {
  const {} = props;
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [videoShouldStart, setVideoShouldStart] = useState(false);
  const [refsReady, setRefsReady] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const loadingScreenRef = useRef<HTMLDivElement | null>(null);
  const backgroundOverlayRef = useRef<HTMLDivElement>(null);
  const videoBackgroundRef = useRef<HTMLDivElement>(null);

  // Track which animations have completed
  const animationStatus = useRef({ background: false, loading: false });

  // Always start at top on page load/reload
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Set body background color after component mounts
  useEffect(() => {
    document.getElementById('red')!.style.display = "none";
    
    return () => {
      // Optionally reset on unmount if needed
      // document.body.style.backgroundColor = "";
    };
  }, []);

  const checkAllComplete = useCallback(() => {
    const { background, loading } = animationStatus.current;
    if (background && loading) {
      setAnimationsComplete(true);
    }
  }, []);

  const handleLoadingComplete = useCallback(() => {
    animationStatus.current.loading = true;
    setVideoShouldStart(true); // Start VideoBackground after LoadingScreen completes
    checkAllComplete();
  }, [checkAllComplete]);

  const handleBackgroundComplete = useCallback(() => {
    animationStatus.current.background = true;
    checkAllComplete();
  }, [checkAllComplete]);

  // Disable scroll while animations are running
  useEffect(() => {
    if (!animationsComplete) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // Prevent scroll with touch events on mobile
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [animationsComplete]);

  // Sync animation state to body for navbar
  useEffect(() => {
    document.body.setAttribute(
      "data-animations-complete",
      String(animationsComplete)
    );
    document.body.setAttribute("data-is-loading", String(!animationsComplete));
  }, [animationsComplete]);

  // Check when refs are ready (for production timing fix)
  useEffect(() => {
    if (
      animationsComplete &&
      loadingScreenRef.current &&
      backgroundOverlayRef.current &&
      pageRef.current
    ) {
      setRefsReady(true);
    } else {
      setRefsReady(false);
    }
  }, [animationsComplete]);

  // Check when refs are ready (for production timing fix)
  // Ensures HighlightsSection and first set are loaded before setting up ScrollTrigger
  useEffect(() => {
    const highlightsSection = document.querySelector('#works') as HTMLElement;
    const firstSet = highlightsSection?.querySelector('[class*="highlightsSection__container"]') as HTMLElement;
    
    if (
      animationsComplete &&
      loadingScreenRef.current &&
      backgroundOverlayRef.current &&
      pageRef.current &&
      videoBackgroundRef.current &&
      highlightsSection &&
      firstSet
    ) {
      setRefsReady(true);
    } else {
      setRefsReady(false);
    }
  }, [animationsComplete]);

  // GSAP ScrollTrigger animation for loading screen, background overlay, and VideoBackground pinning
  useLayoutEffect(() => {
    if (!animationsComplete || !refsReady) return; // Wait for refs to be ready

    const loadingScreenEl = loadingScreenRef.current;
    const backgroundOverlayEl = backgroundOverlayRef.current;
    const videoBackgroundEl = videoBackgroundRef.current;
    const pageEl = pageRef.current;

    if (
      !loadingScreenEl ||
      !backgroundOverlayEl ||
      !videoBackgroundEl ||
      !pageEl
    )
      return;

    const ctx = gsap.context(() => {
      // Helper function to get transform values based on viewport width
      const getTransformValues = () => {
        const isMobile = window.innerWidth < SCROLL_ANIMATION_BREAKPOINT;
        return isMobile
          ? SCROLL_ANIMATION_TRANSFORMS.MOBILE
          : SCROLL_ANIMATION_TRANSFORMS.DESKTOP;
      };

      CustomEase.create("scrollCurve", "M0,0 C0.482,0 0.717,-0.016 0.836,0.108 0.972,0.251 0.972,0.518 1,1");

      const createScrollAnimation = (element: HTMLElement) => {
        const values = getTransformValues();
        
        return gsap.fromTo(
          element,
          {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            transformOrigin: "0% 100%",
          },
          {
            xPercent: values.TRANSLATE_X,
            yPercent: values.TRANSLATE_Y,
            rotation: values.ROTATION,
            transformOrigin: "0% 100%",
            // THIS IS THE KEY:
            ease: "power1.in", 
            scrollTrigger: {
              trigger: pageEl,
              start: "top top",
              end: () => `+=${window.innerHeight * 1.1}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      };


      // Animate loading screen and background overlay
      createScrollAnimation(loadingScreenEl);
      createScrollAnimation(backgroundOverlayEl);

      // Pin VideoBackground until first pre-canvas finishes entrance
      // Use endTrigger to coordinate with HighlightsSection's first set
      // refsReady ensures HighlightsSection and first set exist
      const highlightsSection = document.querySelector("#works") as HTMLElement;
      const firstSet = highlightsSection.querySelector(
        '[class*="highlightsSection__container"]'
      ) as HTMLElement;

      gsap.timeline({
        scrollTrigger: {
          trigger: pageEl,
          start: "top top",
          endTrigger: firstSet, // Use first set as end trigger
          end: "top top+=200", // End when first set reaches top, plus 200px safety margin
          pin: videoBackgroundEl,
          pinSpacing: false,
          pinType: "transform",
          invalidateOnRefresh: true, // Handles resizes automatically
        },
      });
    }, pageRef);

    return () => {
      ctx.revert(); // Cleanup all GSAP animations and ScrollTriggers
    };
  }, [animationsComplete, refsReady]); // Wait for refs to be ready

  return (
    <main
      ref={pageRef}
      className={styles.page}
      style={{ ["--scroll-progress" as string]: "0" }}
    >
      <section id="home">
        <div ref={videoBackgroundRef}>
          <AppBackground
            onAnimationComplete={handleBackgroundComplete}
            onLoadComplete={() => {
              // Handle load complete if needed
            }}
            shouldStart={videoShouldStart}
          />
        </div>
        <div ref={backgroundOverlayRef} className={styles.backgroundOverlay} />

        <LoadingScreen
          externalContainerRef={loadingScreenRef}
          onAnimationComplete={handleLoadingComplete}
          animationsComplete={animationsComplete}
          mode={LoadingScreenMode.HOMEPAGE}
        />
      </section>
      <div className={styles.videoSpacer} />
      <HighlightsSection />
      <div style={{ height: "43dvh" }} />
      <AboutSection />
      <PromoSection />
      <ContactSection />
    </main>
  );
});
