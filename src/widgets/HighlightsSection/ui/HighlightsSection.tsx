"use client";

import { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import { HighlightsInfo } from "./HighlightsInfo/HighlightsInfo";
import { HighlightsPreCanvas } from "./HighlightsPreCanvas/HighlightsPreCanvas";
import { HighlightProject } from "./HighlightProject/HighlightProject";
import styles from "./HighlightsSection.module.scss";

gsap.registerPlugin(ScrollTrigger);

export const HighlightsSection = ({ className }: { className?: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  // Cache height in ref - functions will read from this to avoid excessive window.innerHeight calls
  const heightRef = useRef(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
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
      },
      {
        setRef: set2Ref,
        canvasRef: canvas2Ref,
        projectRef: project2Ref,
        bgRef: bg2Ref,
        color: "blue",
        title: "Armyane",
        href: "/works/project-2",
      },
      {
        setRef: set3Ref,
        canvasRef: canvas3Ref,
        projectRef: project3Ref,
        bgRef: bg3Ref,
        color: "red",
        title: "Makan RomanProject",
        href: "/works/project-3",
      },
    ],
    []
  ); // Empty dependency array - sets never change

  if (!window) return null;

  useLayoutEffect(() => {
    if (!sectionRef.current || !window) return;

    const effectStartTime = performance.now();

    // Initialize height ref
    heightRef.current = window.innerHeight;

    // #region agent log - HighlightsSection effect start
    fetch("http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "HighlightsSection.tsx:useLayoutEffect-start",
        message: "useLayoutEffect start",
        data: {
          windowInnerHeight: heightRef.current,
          setsCount: sets.length,
          scrollTriggerCount: ScrollTrigger.getAll().length,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "fps-optimization-v4",
        hypothesisId: "FPS",
      }),
    }).catch(() => {});
    // #endregion

    // Update cached height on resize (debounced for 60 FPS optimization)
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastHeight = window.innerHeight;
    const debouncedUpdateHeight = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newHeight = window.innerHeight;
        // Only update if height changed significantly (50px threshold for 60 FPS)
        if (Math.abs(newHeight - lastHeight) < 50) {
          return;
        }
        lastHeight = newHeight;
        if (newHeight !== heightRef.current) {
          heightRef.current = newHeight;
          // #region agent log - height updated
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "HighlightsSection.tsx:78",
                message: "Height updated",
                data: { height: newHeight },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "post-fix-v3",
                hypothesisId: "C",
              }),
            }
          ).catch(() => {});
          // #endregion
          // Use requestAnimationFrame to batch ScrollTrigger refresh for 60 FPS
          requestAnimationFrame(() => {
            const refreshStart = performance.now();
            ScrollTrigger.refresh();
            const refreshTime = performance.now() - refreshStart;

            // #region agent log - HighlightsSection ScrollTrigger refresh
            if (refreshTime > 10) {
              // Only log if refresh takes > 10ms
              fetch(
                "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    location: "HighlightsSection.tsx:refresh",
                    message: "ScrollTrigger refresh (slow)",
                    data: {
                      refreshTime: Math.round(refreshTime * 100) / 100,
                      windowHeight: newHeight,
                      scrollTriggerCount: ScrollTrigger.getAll().length,
                    },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "fps-optimization-v4",
                    hypothesisId: "FPS",
                  }),
                }
              ).catch(() => {});
            }
            // #endregion
          });
        }
      }, 500); // Increased debounce to 500ms for 60 FPS optimization
    };

    // Track last activity time to detect idle periods
    let lastActivityTime = performance.now();
    let isIdleSimulated = false;

    // Update lastActivityTime on user interactions to track real idle periods
    const updateActivityTime = () => {
      lastActivityTime = performance.now();
    };
    // Track scroll, mousemove, and resize events as activity
    window.addEventListener("scroll", updateActivityTime, { passive: true });
    window.addEventListener("mousemove", updateActivityTime, { passive: true });
    window.addEventListener("resize", updateActivityTime, { passive: true });

    // Simulate idle condition for testing (dev mode only)
    if (process.env.NODE_ENV === "development") {
      // Add global function to simulate idle state
      (window as any).__simulateIdle = () => {
        isIdleSimulated = true;
        lastActivityTime = performance.now() - 300000; // Simulate 5 minutes idle
        // #region agent log - idle simulation
        fetch(
          "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "HighlightsSection.tsx:simulateIdle",
              message: "Idle state simulated for testing",
              data: {
                simulatedIdleTime: 300000,
                currentTime: performance.now(),
                lastActivityTime,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "idle-fix-test",
              hypothesisId: "IDLE",
            }),
          }
        ).catch(() => {});
        // #endregion
        console.log("Idle state simulated. Try resizing now to test the fix.");
      };
    }

    // Enhanced resize handler that detects idle periods
    // Optimized for 60 FPS: only check idle on significant time gaps
    const enhancedResizeHandler = () => {
      // Fast path: if not simulated idle and recent activity, skip idle check
      if (!isIdleSimulated) {
        const timeSinceLastActivity = performance.now() - lastActivityTime;
        // Only check for idle if it's been more than 30 seconds (optimization)
        if (timeSinceLastActivity < 30000) {
          lastActivityTime = performance.now();
          debouncedUpdateHeight();
          return;
        }
      }

      // Slow path: idle detected - handle immediately
      const timeSinceLastActivity = performance.now() - lastActivityTime;
      const isIdle = timeSinceLastActivity > 60000 || isIdleSimulated;

      // #region agent log - resize after idle detection
      // Defer logging to avoid blocking resize handler (60 FPS optimization)
      if (isIdle) {
        requestAnimationFrame(() => {
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "HighlightsSection.tsx:resize-after-idle",
                message: "Resize detected after idle period",
                data: {
                  timeSinceLastActivity: Math.round(timeSinceLastActivity),
                  isIdleSimulated,
                  windowHeight: window.innerHeight,
                  cachedHeight: heightRef.current,
                  scrollTriggerCount: ScrollTrigger.getAll().length,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "idle-fix-test",
                hypothesisId: "IDLE",
              }),
            }
          ).catch(() => {});
        });
      }
      // #endregion

      lastActivityTime = performance.now();
      isIdleSimulated = false; // Reset after first resize

      // If idle, force immediate refresh without debounce
      if (isIdle) {
        const newHeight = window.innerHeight;
        // Update height immediately - this is critical for function callbacks
        heightRef.current = newHeight;

        // Force immediate ScrollTrigger refresh after idle
        // Single RAF is sufficient - height is already updated synchronously
        requestAnimationFrame(() => {
          // Verify height is still correct before refresh (window might have changed again)
          const currentHeight = window.innerHeight;
          if (currentHeight !== heightRef.current) {
            heightRef.current = currentHeight;
          }

          // #region agent log - forced refresh after idle
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "HighlightsSection.tsx:forced-refresh-after-idle",
                message: "Forced ScrollTrigger refresh after idle",
                data: {
                  windowHeight: currentHeight,
                  cachedHeight: heightRef.current,
                  scrollTriggerCount: ScrollTrigger.getAll().length,
                  heightsMatch: currentHeight === heightRef.current,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "idle-fix-test",
                hypothesisId: "IDLE",
              }),
            }
          ).catch(() => {});
          // #endregion

          // Refresh ScrollTrigger - this will call getEndPin/getEndTimeline which read heightRef.current
          ScrollTrigger.refresh();
        });

        // Don't call debouncedUpdateHeight if we're handling it immediately
        return;
      }

      // Call normal debounced handler for non-idle resizes
      debouncedUpdateHeight();
    };

    // Use enhanced resize handler instead of direct debounced handler
    window.addEventListener("resize", enhancedResizeHandler);

    // Handle visibility changes - force refresh when tab becomes visible after being hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab became visible - check if we need to refresh
        const timeSinceLastActivity = performance.now() - lastActivityTime;
        if (timeSinceLastActivity > 10000) {
          // Tab was hidden for more than 10 seconds
          // #region agent log - visibility change
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "HighlightsSection.tsx:visibility-change",
                message: "Tab became visible after being hidden",
                data: {
                  timeSinceLastActivity: Math.round(timeSinceLastActivity),
                  windowHeight: window.innerHeight,
                  cachedHeight: heightRef.current,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "idle-fix-test",
                hypothesisId: "IDLE",
              }),
            }
          ).catch(() => {});
          // #endregion
          // Update cached height and refresh ScrollTrigger
          heightRef.current = window.innerHeight;
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        }
        lastActivityTime = performance.now();
      } else {
        // Tab became hidden - record the time
        lastActivityTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const ctx = gsap.context(() => {
      sets.forEach(({ setRef, canvasRef, projectRef, bgRef }, index) => {
        const set = setRef.current;
        const canvas = canvasRef.current;
        const project = projectRef.current;
        const bg = bgRef.current;
        if (!set || !canvas || !project || !bg) return;

        // Use function callbacks that read from cached ref - this prevents excessive window.innerHeight calls
        // but still allows ScrollTrigger to recalculate correctly
        const getEndPin = () => {
          const result = `+=${heightRef.current * 1.5}`;
          // #region agent log - getEndPin called (throttled)
          // Only log occasionally to reduce overhead
          if (Math.random() < 0.01) {
            fetch(
              "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  location: "HighlightsSection.tsx:105",
                  message: "getEndPin called",
                  data: { index, height: heightRef.current, result },
                  timestamp: Date.now(),
                  sessionId: "debug-session",
                  runId: "post-fix-v3",
                  hypothesisId: "C",
                }),
              }
            ).catch(() => {});
          }
          // #endregion
          return result;
        };

        const getEndTimeline = () => {
          const result = `+=${heightRef.current * 2.5}`;
          // #region agent log - getEndTimeline called (throttled)
          // Only log occasionally to reduce overhead
          if (Math.random() < 0.01) {
            fetch(
              "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  location: "HighlightsSection.tsx:125",
                  message: "getEndTimeline called",
                  data: { index, height: heightRef.current, result },
                  timestamp: Date.now(),
                  sessionId: "debug-session",
                  runId: "post-fix-v3",
                  hypothesisId: "C",
                }),
              }
            ).catch(() => {});
          }
          // #endregion
          return result;
        };

        // ===== PIN TIMELINE =====
        gsap.timeline({
          scrollTrigger: {
            trigger: set,
            start: "top top", // pin starts when canvas touches top
            end: getEndPin,
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true, // Re-enable so ScrollTrigger can recalculate when needed
            anticipatePin: 1,
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

    const effectEndTime = performance.now();
    const effectDuration = effectEndTime - effectStartTime;

    // #region agent log - HighlightsSection effect complete
    if (effectDuration > 50) {
      // Only log if effect takes > 50ms
      fetch(
        "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "HighlightsSection.tsx:useLayoutEffect-complete",
            message: "useLayoutEffect complete (slow)",
            data: {
              effectDuration: Math.round(effectDuration * 100) / 100,
              scrollTriggerCount: ScrollTrigger.getAll().length,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "fps-optimization-v4",
            hypothesisId: "FPS",
          }),
        }
      ).catch(() => {});
    }
    // #endregion

    console.log(window.innerHeight);

    return () => {
      const cleanupStartTime = performance.now();
      window.removeEventListener("resize", enhancedResizeHandler);
      window.removeEventListener("scroll", updateActivityTime);
      window.removeEventListener("mousemove", updateActivityTime);
      // Note: resize listener for updateActivityTime is already removed above
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
      const cleanupDuration = performance.now() - cleanupStartTime;

      // #region agent log - HighlightsSection cleanup
      if (cleanupDuration > 10) {
        // Only log if cleanup takes > 10ms
        fetch(
          "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "HighlightsSection.tsx:cleanup",
              message: "useLayoutEffect cleanup (slow)",
              data: {
                cleanupDuration: Math.round(cleanupDuration * 100) / 100,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "fps-optimization-v4",
              hypothesisId: "FPS",
            }),
          }
        ).catch(() => {});
      }
      // #endregion
    };
  }, [sets]);

  return (
    <section
      ref={sectionRef}
      className={classNames(styles.highlightsSection, {}, [className])}
    >
      <HighlightsInfo />
      {/* <div style={{ height: "4vh" }} /> */}
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
          <HighlightProject containerRef={set.projectRef} color={set.color} />
        </div>
      ))}
    </section>
  );
};
