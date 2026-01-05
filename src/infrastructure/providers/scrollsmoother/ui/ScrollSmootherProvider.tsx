"use client";

import { useLayoutEffect, type FC, type PropsWithChildren } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const RESIZE_DEBOUNCE_DELAY = 500; // Increased to 500ms for better 60 FPS performance
const MIN_RESIZE_THRESHOLD = 50; // Only refresh if window size changed by at least 50px

const ScrollSmootherProvider: FC<PropsWithChildren> = ({ children }) => {
  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.36,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // --- Global resize handler ---
    // Optimized for 60 FPS: only refresh when size change is significant
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let resizeCallCount = 0;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    // Throttle resize handler to prevent excessive calls during rapid resizing
    let resizeThrottleTimeout: ReturnType<typeof setTimeout> | null = null;
    let isResizing = false;

    const handleResize = () => {
      resizeCallCount++;
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Only proceed if size change is significant
      const widthDiff = Math.abs(currentWidth - lastWidth);
      const heightDiff = Math.abs(currentHeight - lastHeight);

      if (
        widthDiff < MIN_RESIZE_THRESHOLD &&
        heightDiff < MIN_RESIZE_THRESHOLD
      ) {
        return; // Skip refresh for minor size changes
      }

      // Throttle: if already resizing, just update the target size and return
      if (isResizing) {
        lastWidth = currentWidth;
        lastHeight = currentHeight;
        return;
      }

      isResizing = true;

      // #region agent log - ScrollSmootherProvider resize handler
      fetch(
        "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "ScrollSmootherProvider.tsx:26",
            message: "Resize handler called",
            data: {
              resizeCallCount,
              windowWidth: currentWidth,
              windowHeight: currentHeight,
              widthDiff,
              heightDiff,
              hasTimeout: !!resizeTimeout,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "fps-optimization",
            hypothesisId: "FPS",
          }),
        }
      ).catch(() => {});
      // #endregion

      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        lastWidth = currentWidth;
        lastHeight = currentHeight;
        isResizing = false; // Reset flag after debounce completes

        // Use requestAnimationFrame to batch refresh with next frame
        requestAnimationFrame(() => {
          const refreshStart = performance.now();

          // #region agent log - ScrollTrigger refresh start
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "ScrollSmootherProvider.tsx:refresh-start",
                message: "ScrollTrigger refresh starting",
                data: {
                  windowWidth: currentWidth,
                  windowHeight: currentHeight,
                  scrollTriggerCount: ScrollTrigger.getAll().length,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "fps-optimization-v4",
                hypothesisId: "FPS",
              }),
            }
          ).catch(() => {});
          // #endregion

          ScrollTrigger.refresh();
          const scrollTriggerTime = performance.now() - refreshStart;

          ScrollSmoother.refresh();
          const totalRefreshTime = performance.now() - refreshStart;

          // #region agent log - ScrollTrigger refresh complete
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "ScrollSmootherProvider.tsx:refresh-complete",
                message: "ScrollTrigger refresh completed",
                data: {
                  windowWidth: currentWidth,
                  windowHeight: currentHeight,
                  scrollTriggerTime: Math.round(scrollTriggerTime * 100) / 100,
                  scrollSmootherTime:
                    Math.round((totalRefreshTime - scrollTriggerTime) * 100) /
                    100,
                  totalRefreshTime: Math.round(totalRefreshTime * 100) / 100,
                  scrollTriggerCount: ScrollTrigger.getAll().length,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "fps-optimization-v4",
                hypothesisId: "FPS",
              }),
            }
          ).catch(() => {});
          // #endregion
        });
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
      if (resizeThrottleTimeout) {
        clearTimeout(resizeThrottleTimeout);
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
};

export default ScrollSmootherProvider;
