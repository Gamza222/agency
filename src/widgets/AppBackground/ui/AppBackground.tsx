/**
 * AppBackground Component
 * Merges VideoBackground functionality with AnimatedBackground's WebGL rendering
 * Uses vanta.js FOG effect for animated background with GSAP entrance animation
 */


import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import styles from "./AppBackground.module.scss";
import {
  ANIMATION_DURATION_MS,
  ANIMATION_COMPLETE_OFFSET_MS,
} from "../lib/constants";
import type { AppBackgroundProps } from "../types/types";
import { classNames } from "@/shared/lib/utils/classNames/classNames";

gsap.registerPlugin(CustomEase);

// Vanta.js type declarations
declare global {
  interface Window {
    VANTA: {
      FOG: (options: {
        el: string | HTMLElement;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        highlightColor?: number;
        midtoneColor?: number;
        lowlightColor?: number;
        baseColor?: number;
        blurFactor?: number;
        speed?: number;
        zoom?: number;
      }) => {
        destroy: () => void;
        resize: () => void;
      };
    };
    THREE: any;
  }
}

// Convert hex color string to vanta.js 0x format
function hexToVantaColor(hex: string): number {
  const cleaned = hex.replace("#", "");
  return parseInt(cleaned, 16);
}

// Convert hex color to RGB array (helper function)
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result && result[1] && result[2] && result[3]) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [1, 1, 1];
}

// Calculate a mid-tone color between two colors
function calculateMidtoneColor(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  // Mix colors 50/50 and convert to hex
  const r = Math.round(((rgb1[0] + rgb2[0]) / 2) * 255);
  const g = Math.round(((rgb1[1] + rgb2[1]) / 2) * 255);
  const b = Math.round(((rgb1[2] + rgb2[2]) / 2) * 255);

  return (r << 16) | (g << 8) | b;
}

export const AppBackground: React.FC<AppBackgroundProps> = memo(
  ({
    className,
    onAnimationComplete,
    onLoadComplete,
    shouldStart = false,
    children,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasWrapperRef = useRef<HTMLDivElement>(null);

    // Refs from VideoBackground - animation state
    const hasStartedRef = useRef(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const onAnimationCompleteRef = useRef(onAnimationComplete);
    const onLoadCompleteRef = useRef(onLoadComplete);

    // Refs from AnimatedBackground - vanta.js state
    const vantaEffectRef = useRef<{
      destroy: () => void;
      resize: () => void;
    } | null>(null);
    const isInitializingRef = useRef(false);
    const vantaInitializedRef = useRef(false);

    // Track load state (similar to VideoBackground's useImageLoad)
    const [isVantaLoaded, setIsVantaLoaded] = useState(false);
    const didCompleteLoadRef = useRef(false);

    // Keep callback refs up to date
    useEffect(() => {
      onAnimationCompleteRef.current = onAnimationComplete;
    }, [onAnimationComplete]);

    useEffect(() => {
      onLoadCompleteRef.current = onLoadComplete;
    }, [onLoadComplete]);

    // Handle vanta.js load complete (replaces image load)
    const handleVantaLoadComplete = useCallback(() => {
      if (didCompleteLoadRef.current) return;
      didCompleteLoadRef.current = true;
      setIsVantaLoaded(true);
      onLoadCompleteRef.current?.();
    }, []);

    // Initialize vanta.js (from AnimatedBackground)
    useEffect(() => {
      if (vantaEffectRef.current || isInitializingRef.current) {
        return;
      }

      const container = containerRef.current;
      const canvasWrapper = canvasWrapperRef.current;
      if (!container || !canvasWrapper) {
        return;
      }

      isInitializingRef.current = true;
      let wasCleanedUp = false;

      const initVanta = async () => {
        if (wasCleanedUp || vantaEffectRef.current) {
          isInitializingRef.current = false;
          return;
        }

        const container = containerRef.current;
        const canvasWrapper = canvasWrapperRef.current;
        if (!container || !canvasWrapper || !container.isConnected) {
          isInitializingRef.current = false;
          return;
        }

        // Remove existing canvases from wrapper
        const existingCanvases = canvasWrapper.querySelectorAll("canvas");
        existingCanvases.forEach((canvas) => {
          try {
            canvas.remove();
          } catch (e) {
            // Silent
          }
        });

        try {
          // Wait for canvasWrapper dimensions
          const wrapperRect = canvasWrapper.getBoundingClientRect();
          if (wrapperRect.width === 0 || wrapperRect.height === 0) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
          }

          // Load THREE.js
          const loadTHREE = () => {
            return new Promise((resolve) => {
              const scheduleLoad = (callback: () => void) => {
                if (typeof requestIdleCallback !== "undefined") {
                  requestIdleCallback(callback, { timeout: 200 });
                } else {
                  setTimeout(callback, 0);
                }
              };
              scheduleLoad(async () => {
                const THREE_MODULE = await import("three");
                resolve(THREE_MODULE);
              });
            });
          };

          const THREE_MODULE = (await loadTHREE()) as typeof import("three");
          const THREE = THREE_MODULE.default || THREE_MODULE;

          if (!window.THREE) {
            (window as any).THREE = THREE;
          }

          // Load vanta.js
          const loadVanta = () => {
            return new Promise((resolve) => {
              const scheduleLoad = (callback: () => void) => {
                if (typeof requestIdleCallback !== "undefined") {
                  requestIdleCallback(callback, { timeout: 200 });
                } else {
                  setTimeout(callback, 0);
                }
              };
              scheduleLoad(async () => {
                const vantaModule = await import("vanta/dist/vanta.fog.min.js");
                resolve(vantaModule);
              });
            });
          };

          const vantaModule: any = await loadVanta();
          const FOG = vantaModule.default;

          if (!FOG) {
            isInitializingRef.current = false;
            return;
          }

          let fogFunction: any;
          if (typeof FOG === "function") {
            fogFunction = FOG;
          } else if (FOG && typeof (FOG).FOG === "function") {
            fogFunction = (FOG).FOG;
          } else if (FOG && typeof (FOG).default?.FOG === "function") {
            fogFunction = (FOG).default.FOG;
          } else {
            isInitializingRef.current = false;
            return;
          }

          // Color setup (from AnimatedBackground)
          // const color1 = "#fcf8ed";
          // const color2 = "#14100c";

          const color1 = "#14100c";
          const color2 = "#fcf8ed";
          const baseColor = hexToVantaColor(color1);
          const highlightColor = hexToVantaColor(color2);
          const lowlightColor = hexToVantaColor(color2);
          const midtoneColor = calculateMidtoneColor(color1, color2);

          // Performance optimizations (from AnimatedBackground)
          const isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            ) || window.innerWidth <= 768;
          const nav = navigator as Navigator & { deviceMemory?: number };
          const isLowEndDevice =
            (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
            (nav.deviceMemory && nav.deviceMemory <= 4) ||
            isMobile;

          const fogOptions = {
            el: canvasWrapper, // Use wrapper so canvas is inside for GSAP animation
            mouseControls: !isSafari && !isMobile,
            touchControls: !isSafari && !isMobile,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            highlightColor,
            midtoneColor,
            lowlightColor,
            baseColor,
            blurFactor: isLowEndDevice
              ? 0.2
              : isMobile
                ? 0.3
                : isSafari
                  ? 0.4
                  : 0.59,    
            speed: isLowEndDevice ? 0.5 : isMobile ? 0.6 : isSafari ? 0.8 : 1.1,
            zoom: isLowEndDevice ? 0.2 : isMobile ? 0.25 : isSafari ? 0.3 : 0.4,
          };

          // Verify canvasWrapper is still valid before initializing
          const currentCanvasWrapper = canvasWrapperRef.current;
          if (!currentCanvasWrapper || !currentCanvasWrapper.isConnected) {
            isInitializingRef.current = false;
            return;
          }

          // Initialize vanta.js
          if (wasCleanedUp || vantaEffectRef.current) {
            isInitializingRef.current = false;
            return;
          }

          let result: any;
          try {
            if (fogFunction.length === 2) {
              result = fogFunction(THREE, fogOptions);
            } else {
              result = fogFunction(fogOptions);
            }

            if (wasCleanedUp || vantaEffectRef.current) {
              if (result && typeof result === "object" && result.destroy) {
                result.destroy();
              }
              isInitializingRef.current = false;
              return;
            }

            if (result && typeof result === "object" && result.resize) {
              vantaEffectRef.current = result;
              vantaInitializedRef.current = true;

              // Mark as loaded (replaces image load)
              handleVantaLoadComplete();
            } else {
              throw new Error(`Invalid result from fogFunction: ${typeof result}`);
            }
          } catch (e) {
            isInitializingRef.current = false;
            return;
          }
        } catch (error) {
          isInitializingRef.current = false;
          return;
        }
      };

      // Schedule vanta initialization
      const scheduleVantaInit = (callback: () => void) => {
        requestAnimationFrame(() => {
          if (!wasCleanedUp && !vantaEffectRef.current) {
            callback();
          }
        });
        setTimeout(() => {
          if (!wasCleanedUp && !vantaEffectRef.current) {
            callback();
          }
        }, 200);
      };

      scheduleVantaInit(() => {
        if (!wasCleanedUp && !vantaEffectRef.current) {
          initVanta();
        }
      });

      // Handle resize (from AnimatedBackground)
      let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
      let resizeRafId: number | null = null;
      let lastResizeTime = 0;
      let isResizing = false;
      const RESIZE_THROTTLE_MS = 100;
      const RESIZE_DEBOUNCE_MS = 300;

      const handleResize = () => {
        const now = performance.now();
        isResizing = true;

        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
          resizeTimeout = null;
        }

        if (resizeRafId !== null) {
          cancelAnimationFrame(resizeRafId);
          resizeRafId = null;
        }

        const timeSinceLastResize = now - lastResizeTime;
        if (timeSinceLastResize < RESIZE_THROTTLE_MS) {
          resizeRafId = requestAnimationFrame(() => {
            if (vantaEffectRef.current && isResizing) {
              vantaEffectRef.current.resize();
              lastResizeTime = performance.now();
            }
            resizeRafId = null;
          });
        } else {
          if (vantaEffectRef.current) {
            vantaEffectRef.current.resize();
            lastResizeTime = performance.now();
          }
        }

        resizeTimeout = setTimeout(() => {
          isResizing = false;
          if (vantaEffectRef.current) {
            vantaEffectRef.current.resize();
          }
        }, RESIZE_DEBOUNCE_MS);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        wasCleanedUp = true;
        window.removeEventListener("resize", handleResize);

        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        if (resizeRafId !== null) {
          cancelAnimationFrame(resizeRafId);
        }

        if (vantaEffectRef.current) {
          try {
            vantaEffectRef.current.destroy();
          } catch (e) {
            // Silent
          }
          vantaEffectRef.current = null;
        }

        const canvasWrapper = canvasWrapperRef.current;
        if (canvasWrapper) {
          const existingCanvases = canvasWrapper.querySelectorAll("canvas");
          existingCanvases.forEach((canvas) => {
            try {
              canvas.remove();
            } catch (e) {
              // Silent
            }
          });
        }

        isInitializingRef.current = false;
      };
    }, [handleVantaLoadComplete]);

    // GSAP animation (from VideoBackground) - applied to canvas wrapper
    useEffect(() => {
      const canvasWrapper = canvasWrapperRef.current;
      if (!canvasWrapper) return;

      // Only start once when loaded and shouldStart is true
      if (
        isVantaLoaded &&
        shouldStart &&
        !hasStartedRef.current &&
        vantaInitializedRef.current
      ) {
        CustomEase.create("myCustomEase", "M0,0 C0.19,1 0.22,1 1,1");
        hasStartedRef.current = true;

        // Create GSAP timeline
        const timeline = gsap.timeline();
        timelineRef.current = timeline;

        // Animate canvas wrapper - same animation as VideoBackground
        // The canvas inside will be animated along with the wrapper
        timeline.fromTo(
          canvasWrapper,
          {
            x: "-10%",
            y: "120%",
            rotate: 5,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: ANIMATION_DURATION_MS / 1000,
            ease: "myCustomEase",
          },
          0
        );

        // Add callback at specific time
        const callbackTime =
          (ANIMATION_DURATION_MS - ANIMATION_COMPLETE_OFFSET_MS) / 1000;
        timeline.call(
          () => {
            onAnimationCompleteRef.current?.();
          },
          [],
          callbackTime
        );
      }

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }
      };
    }, [isVantaLoaded, shouldStart]);

    return (
      <div
        ref={containerRef}
        className={classNames(styles.appBackground, {}, [className])}
        aria-hidden="true"
      >
        {/* Wrapper for GSAP animation - wraps the canvas that vanta.js creates */}
        <div ref={canvasWrapperRef} className={styles.canvasWrapper}>
          {/* vanta.js will inject canvas here */}
        </div>
        <div className={styles.backgroundOverlay} />
        {children}
      </div>
    );
  }
);

AppBackground.displayName = "AppBackground";
