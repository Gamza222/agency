import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";

/**
 * Hook to handle smooth anchor scrolling with ScrollSmoother
 * Uses offsetTop for accurate position calculation in original layout coordinates
 */
export const useSmoothAnchorScroll = () => {
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    // Kill animation if user scrolls during animation (reactive approach - no blocking)
    const handleUserScroll = () => {
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const smoother = ScrollSmoother.get();
      if (!smoother) return
      e.preventDefault();

      // Kill any existing scroll animation FIRST
      // This ensures we get accurate current scroll position
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }

      // Wait one frame to ensure ScrollSmoother has settled after killing animation
      requestAnimationFrame(() => {
        const currentScroll = smoother.scrollTop();

        // Handle "#" (home) - scroll to top
        if (href === "#") {
          const scrollObj = { value: currentScroll };

          scrollTweenRef.current = gsap.to(scrollObj, {
            value: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate () {
              smoother.scrollTo(scrollObj.value, false);
            },
            onComplete: () => {
              scrollTweenRef.current = null;
            },
          });
          return;
        }

        // Extract ID from href
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (!targetElement) return;

        const content = smoother.content();

        // Calculate element's position using offsetTop (original layout, not transformed)
        // This gives us the position in the content's original coordinate system
        // which matches ScrollSmoother's scrollTop() coordinate system
        let elementTop = 0;
        let element: HTMLElement | null = targetElement;
        let foundContent = false;

        // Traverse up the DOM tree to calculate offsetTop relative to content
        while (element && element.offsetParent) {
          if (element === content) {
            foundContent = true;
            break;
          }
          elementTop += element.offsetTop;
          element = element.offsetParent as HTMLElement | null;
        }

        // If we successfully found content in the chain, use offsetTop calculation
        if (foundContent) {
          const scrollObj = { value: currentScroll };

          scrollTweenRef.current = gsap.to(scrollObj, {
            value: elementTop,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate () {
              smoother.scrollTo(scrollObj.value, false);
            },
            onComplete: () => {
              scrollTweenRef.current = null;
            },
          });
        } else {
          // Fallback: If offsetTop traversal failed, use getBoundingClientRect
          // but we need to measure at scroll position 0 to get accurate position
          const savedScroll = smoother.scrollTop();
          smoother.scrollTo(0, false);

          // Wait for layout to update after scrolling to 0
          requestAnimationFrame(() => {
            const elementRect = targetElement.getBoundingClientRect();
            const contentRect = content.getBoundingClientRect();
            const elementTopAtZero = elementRect.top - contentRect.top;

            // Restore original scroll position
            smoother.scrollTo(savedScroll, false);

            // Wait another frame, then animate
            requestAnimationFrame(() => {
              const scrollObj = { value: savedScroll };

              scrollTweenRef.current = gsap.to(scrollObj, {
                value: elementTopAtZero,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate () {
                  smoother.scrollTo(scrollObj.value, false);
                },
                onComplete: () => {
                  scrollTweenRef.current = null;
                },
              });
            });
          });
        }
      });
    };

    // Listen for user scroll during animation - if user scrolls, kill the tween
    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });
    document.addEventListener("click", handleAnchorClick);

    return () => {
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchmove", handleUserScroll);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
};
