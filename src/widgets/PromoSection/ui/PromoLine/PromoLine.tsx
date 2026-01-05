import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import styles from "./PromoLine.module.scss";

interface PromoLineProps {
  className?: string;
  items: string[];
  speed?: number; // pixels per second
  direction?: boolean; // false = normal, true = reverse
}

export const PromoLine = ({
  className,
  items,
  speed = 100,
  direction = false,
}: PromoLineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [renderItems, setRenderItems] = useState<string[]>([]);
  const measurementContainerRef = useRef<HTMLDivElement | null>(null);

  // Build repeated items to fill container
  const buildRenderItems = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    // #region agent log - buildRenderItems tracking
    fetch("http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "PromoLine.tsx:25",
        message: "buildRenderItems called",
        data: { containerWidth, itemsCount: items.length },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion

    // Create a persistent off-screen measurement container instead of temp element
    if (!measurementContainerRef.current) {
      const measurementContainer = document.createElement("div");
      measurementContainer.style.cssText = `
        position: absolute;
        visibility: hidden;
        top: -9999px;
        left: -9999px;
        white-space: nowrap;
        display: flex;
      `;
      document.body.appendChild(measurementContainer);
      measurementContainerRef.current = measurementContainer;
    }

    const temp = measurementContainerRef.current;
    temp.innerHTML = ""; // Clear previous content

    items.forEach((text) => {
      const wrapper = document.createElement("div");
      wrapper.className = styles.promoTextWrapper;
      wrapper.style.paddingRight = "0";
      wrapper.innerHTML = `<span class="${styles.promoText}">${text}</span><span class="${styles.separator}">/</span>`;
      temp.appendChild(wrapper);
    });

    const lineWidth = temp.scrollWidth;

    const times = Math.ceil((containerWidth * 2) / lineWidth);
    const finalItems: string[] = [];
    for (let i = 0; i < times; i++) finalItems.push(...items);

    // #region agent log - buildRenderItems result
    fetch("http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "PromoLine.tsx:63",
        message: "buildRenderItems result",
        data: { lineWidth, times, finalItemsCount: finalItems.length },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion

    setRenderItems(finalItems);
    return lineWidth;
  };

  useLayoutEffect(() => {
    if (!lineRef.current) return;

    // #region agent log - PromoLine effect start
    fetch("http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "PromoLine.tsx:66",
        message: "useLayoutEffect start",
        data: {
          containerWidth: containerRef.current?.offsetWidth,
          itemsCount: items.length,
          speed,
          direction,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion

    let gsapCtx: gsap.Context | null = null;
    let lastContainerWidth = containerRef.current?.offsetWidth || 0;
    let activeRafId: number | null = null;
    let isSettingUp = false; // Guard to prevent duplicate setups

    const setupAnimation = () => {
      if (!lineRef.current || isSettingUp) return;
      isSettingUp = true;

      // Defer measurement to avoid interfering with ScrollTrigger refresh
      const rafId1 = requestAnimationFrame(() => {
        const rafId2 = requestAnimationFrame(() => {
          isSettingUp = false; // Reset guard after setup completes
          const currentWidth = containerRef.current?.offsetWidth || 0;

          // #region agent log - container width change detection
          if (currentWidth !== lastContainerWidth) {
            fetch(
              "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  location: "PromoLine.tsx:75",
                  message: "Container width changed",
                  data: {
                    oldWidth: lastContainerWidth,
                    newWidth: currentWidth,
                  },
                  timestamp: Date.now(),
                  sessionId: "debug-session",
                  runId: "run1",
                  hypothesisId: "B",
                }),
              }
            ).catch(() => {});
            lastContainerWidth = currentWidth;
          }
          // #endregion

          if (gsapCtx) {
            gsapCtx.revert();
            gsapCtx = null;
          }

          let lineWidth = buildRenderItems();
          if (!lineWidth) return;

          gsapCtx = gsap.context(() => {
            const setter = gsap.quickSetter(lineRef.current!, "x", "px");
            const obj = { x: direction ? -lineWidth! : 0 };
            const targetX = direction ? 0 : -lineWidth!;

            // #region agent log - GSAP animation creation
            fetch(
              "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  location: "PromoLine.tsx:95",
                  message: "GSAP animation created",
                  data: { lineWidth, duration: lineWidth! / speed, direction },
                  timestamp: Date.now(),
                  sessionId: "debug-session",
                  runId: "run1",
                  hypothesisId: "E",
                }),
              }
            ).catch(() => {});
            // #endregion

            gsap.to(obj, {
              x: targetX,
              duration: lineWidth! / speed,
              ease: "linear",
              repeat: -1,
              onUpdate: () => setter(obj.x),
            });
          }, lineRef);
          isSettingUp = false; // Also reset if setup fails early
        });
        activeRafId = rafId2;
      });
      activeRafId = rafId1;
    };

    setupAnimation();

    // Track resize events to detect when container width changes with aggressive debouncing
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastResizeWidth = containerRef.current?.offsetWidth || 0;
    const handleResize = () => {
      // Debounce resize to prevent excessive recalculations - increased to 500ms for 60 FPS
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        const currentWidth = containerRef.current?.offsetWidth || 0;

        // Only process if width actually changed significantly (increased to 100px for 60 FPS optimization)
        if (Math.abs(currentWidth - lastResizeWidth) < 100) {
          return;
        }

        // #region agent log - PromoLine resize detected
        fetch(
          "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "PromoLine.tsx:115",
              message: "Window resize detected",
              data: {
                containerWidth: currentWidth,
                lastWidth: lastContainerWidth,
                shouldRecalculate: currentWidth !== lastContainerWidth,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "post-fix-v3",
              hypothesisId: "B",
            }),
          }
        ).catch(() => {});
        // #endregion

        lastResizeWidth = currentWidth;

        if (currentWidth !== lastContainerWidth && containerRef.current) {
          setupAnimation();
        }
      }, 300); // Increased debounce delay to 300ms
    };
    window.addEventListener("resize", handleResize);

    return () => {
      // #region agent log - PromoLine cleanup
      fetch(
        "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "PromoLine.tsx:123",
            message: "useLayoutEffect cleanup",
            data: {},
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "post-fix",
            hypothesisId: "E",
          }),
        }
      ).catch(() => {});
      // #endregion
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      if (activeRafId !== null) {
        cancelAnimationFrame(activeRafId);
      }
      if (gsapCtx) {
        gsapCtx.revert();
      }
      if (measurementContainerRef.current) {
        document.body.removeChild(measurementContainerRef.current);
        measurementContainerRef.current = null;
      }
    };
  }, [items, speed, direction]);

  return (
    <div
      ref={containerRef}
      className={classNames(styles.promoLine, {}, [className])}
      style={{ overflow: "hidden" }}
    >
      <div
        ref={lineRef}
        className={styles.lineInner}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        {renderItems.map((text, i) => (
          <div key={i} className={styles.promoTextWrapper}>
            <span className={styles.promoText}>{text}</span>
            <span className={styles.separator}>/</span>
          </div>
        ))}
      </div>
    </div>
  );
};

PromoLine.displayName = "PromoLine";
