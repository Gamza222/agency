import { useLayoutEffect, type FC, type PropsWithChildren } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useSmoothAnchorScroll } from "../lib/useSmoothAnchorScroll";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

const RESIZE_DEBOUNCE_DELAY = 200;

const ScrollSmootherProvider: FC<PropsWithChildren> = ({ children }) => {
  // Handle smooth anchor scrolling
  useSmoothAnchorScroll();

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.6,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // --- Global resize handler ---
    // This will refresh ALL ScrollTrigger instances across the entire app
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollSmoother.refresh();

        // Clamp scroll position if it exceeds the new maximum after resize
        // This prevents overscroll when viewport height shrinks
        // requestAnimationFrame(() => {
        //   const scrollTop = smoother.scrollTop();
        //   const maxScroll =
        //     smoother.content().offsetHeight - smoother.wrapper().clientHeight;
        //   if (scrollTop > maxScroll && maxScroll > 0) {
        //     smoother.scrollTo(maxScroll, true);
        //   }
        // });
      }, RESIZE_DEBOUNCE_DELAY);
    };
    window.addEventListener("resize", handleResize);

    // --- Visibility change handler ---
    // This will refresh ALL ScrollTrigger instances when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          requestAnimationFrame(() => {
            ScrollSmoother.refresh();
            ScrollTrigger.refresh();
          });
        }, 100);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      smoother.kill();
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
};

export default ScrollSmootherProvider;
