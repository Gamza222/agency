import { useEffect, useState, useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { NAVBAR_LINKS } from "../model/types/constants/constants";

/**
 * Hook to track which section is currently active based on scroll position
 * Returns the href of the active section (e.g., "#works", "#aboutsection")
 * Works with ScrollSmoother to detect which section is in view
 *
 * Features:
 * - Instant activation on anchor link clicks
 * - Respects loading state (no active state during loading)
 * - Prevents switching during programmatic scroll
 * - Corrects active section if scroll is interrupted
 */
export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState<string>("#");
  const [isLoading, setIsLoading] = useState(true);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    // Check initial loading state
    const checkLoadingState = () => {
      const loadingAttr = document.body.getAttribute("data-is-loading");
      const isLoading = loadingAttr === "true"; // "true" means NOT loading (inverted)
      setIsLoading(isLoading); // Invert: true means loading
    };

    checkLoadingState();

    // Watch for loading state changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-is-loading"
        ) {
          checkLoadingState();
        }
      })
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-is-loading"],
    });

    const smoother = ScrollSmoother.get();
    if (!smoother) {
      return () => {
        observer.disconnect();
      };
    }

    // Map of section IDs to their hrefs
    const sectionMap: Record<string, string> = {};
    NAVBAR_LINKS.forEach((link) => {
      if (link.href !== "#") {
        const sectionId = link.href.substring(1); // Remove #
        sectionMap[sectionId] = link.href;
      }
    });

    const triggers: ScrollTrigger[] = [];
    let currentActiveSection: string | null = null;

    // Function to check actual scroll position and update active section
    const checkActualScrollPosition = () => {
      if (!smoother) return;

      const scrollTop = smoother.scrollTop();

      // Check which section is actually in view
      if (scrollTop < 100) {
        setActiveSection("#");
        currentActiveSection = "#";
        return;
      }

      let foundActive = false;
      Object.keys(sectionMap).forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        const viewportCenter = scrollTop + window.innerHeight / 2;

        if (viewportCenter >= elementTop && viewportCenter <= elementBottom) {
          setActiveSection(sectionMap[sectionId]);
          currentActiveSection = sectionMap[sectionId];
          foundActive = true;
        }
      });

      // If no section found, find closest
      if (!foundActive) {
        let closestSection: string | null = null;
        let closestDistance = Infinity;

        Object.keys(sectionMap).forEach((sectionId) => {
          const element = document.getElementById(sectionId);
          if (!element) return;

          const elementTop = element.offsetTop;
          const distance = Math.abs(scrollTop - elementTop);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = sectionMap[sectionId];
          }
        });

        if (closestSection) {
          setActiveSection(closestSection);
          currentActiveSection = closestSection;
        }
      }
    };

    // Listen for user scroll during programmatic scroll - if detected, correct active section
    const handleUserScrollDuringProgrammatic = () => {
      if (isProgrammaticScrollRef.current) {
        // User scrolled during programmatic scroll - tween was likely killed
        // Clear the programmatic flag immediately
        isProgrammaticScrollRef.current = false;

        // Clear timeout
        if (programmaticScrollTimeoutRef.current) {
          clearTimeout(programmaticScrollTimeoutRef.current);
          programmaticScrollTimeoutRef.current = null;
        }

        // Check actual scroll position after a brief delay to let scroll settle
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            checkActualScrollPosition();
          });
        });
      }
    };

    // Listen for anchor link clicks to activate instantly
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Don't activate during loading
      if (isLoading) return;

      // Activate instantly on click
      setActiveSection(href);
      currentActiveSection = href;

      // Mark that we're programmatically scrolling
      isProgrammaticScrollRef.current = true;

      // Clear any existing timeout
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }

      // Re-enable ScrollTrigger updates after scroll animation completes
      // Scroll animation duration is 1.2s, add buffer
      programmaticScrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        programmaticScrollTimeoutRef.current = null;

        // Verify we actually reached the target, if not, correct it
        checkActualScrollPosition();
      }, 1500); // 1.2s animation + 300ms buffer
    };

    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("wheel", handleUserScrollDuringProgrammatic, {
      passive: true,
    });
    window.addEventListener("touchmove", handleUserScrollDuringProgrammatic, {
      passive: true,
    });

    // Create ScrollTrigger for each section
    Object.keys(sectionMap).forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top center", // Section enters when its top reaches center of viewport
        end: "bottom center", // Section leaves when its bottom reaches center of viewport
        onEnter: () => {
          // Ignore during programmatic scroll
          if (isProgrammaticScrollRef.current) return;
          if (!isLoading) {
            currentActiveSection = sectionMap[sectionId];
            setActiveSection(sectionMap[sectionId]);
          }
        },
        onEnterBack: () => {
          // Ignore during programmatic scroll
          if (isProgrammaticScrollRef.current) return;
          if (!isLoading) {
            currentActiveSection = sectionMap[sectionId];
            setActiveSection(sectionMap[sectionId]);
          }
        },
        onLeave: () => {
          // Only clear if this was the active section and not during programmatic scroll
          if (isProgrammaticScrollRef.current) return;
          if (currentActiveSection === sectionMap[sectionId]) {
            currentActiveSection = null;
          }
        },
        onLeaveBack: () => {
          // Ignore during programmatic scroll
          if (isProgrammaticScrollRef.current) return;
          // When scrolling back up past a section
          if (currentActiveSection === sectionMap[sectionId]) {
            currentActiveSection = null;
          }
        },
      });

      triggers.push(trigger);
    });

    // Handle "home" section (top of page)
    // This should be active when we're at the top or above the first section
    const content = smoother.content();
    if (content) {
      const homeTrigger = ScrollTrigger.create({
        trigger: content,
        start: "top top",
        end: "100px top",
        onEnter: () => {
          // Ignore during programmatic scroll
          if (isProgrammaticScrollRef.current) return;
          if (!isLoading) {
            setActiveSection("#");
          }
        },
        onEnterBack: () => {
          // Ignore during programmatic scroll
          if (isProgrammaticScrollRef.current) return;
          if (!isLoading) {
            setActiveSection("#");
          }
        },
        onLeave: () => {
          // Will be handled by section triggers
        },
        onLeaveBack: () => {
          // Ignore during programmatic scroll
          if (isProgrammaticScrollRef.current) return;
          if (!isLoading) {
            setActiveSection("#");
          }
        },
      });

      triggers.push(homeTrigger);
    }

    // Initial check - determine which section should be active on mount
    const checkInitialSection = () => {
      // Don't set active section during loading
      if (isLoading) {
        setActiveSection("#"); // Default to home, but won't show as active
        return;
      }

      const scrollTop = smoother.scrollTop();

      // If at top, home is active
      if (scrollTop < 100) {
        setActiveSection("#");
        return;
      }

      // Check which section is in view
      let foundActive = false;
      Object.keys(sectionMap).forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        const viewportCenter = scrollTop + window.innerHeight / 2;

        // If viewport center is within section bounds
        if (viewportCenter >= elementTop && viewportCenter <= elementBottom) {
          setActiveSection(sectionMap[sectionId]);
          foundActive = true;
        }
      });

      // If no section found and not at top, find the closest one
      if (!foundActive && scrollTop >= 100) {
        let closestSection: string | null = null;
        let closestDistance = Infinity;

        Object.keys(sectionMap).forEach((sectionId) => {
          const element = document.getElementById(sectionId);
          if (!element) return;

          const elementTop = element.offsetTop;
          const distance = Math.abs(scrollTop - elementTop);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = sectionMap[sectionId];
          }
        });

        if (closestSection) {
          setActiveSection(closestSection);
        }
      }
    };

    // Wait for ScrollSmoother to be ready, then check initial section
    requestAnimationFrame(() => {
      checkInitialSection();
    });

    // Cleanup
    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("wheel", handleUserScrollDuringProgrammatic);
      window.removeEventListener("touchmove", handleUserScrollDuringProgrammatic);
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }
      triggers.forEach((trigger) => trigger.kill());
      observer.disconnect();
    };
  }, [isLoading]);

  // Return empty string during loading (no active state)
  return isLoading ? "" : activeSection;
};
