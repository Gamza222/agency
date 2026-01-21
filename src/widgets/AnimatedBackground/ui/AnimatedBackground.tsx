/**
 * Animated Background Component
 * Uses vanta.js FOG effect for animated background
 * Preserves loading animations and entrance animations
 */

"use client";

import React, { useEffect, useRef } from "react";
import styles from "./AnimatedBackground.module.scss";
import { ANIMATION_DURATION_MS, ANIMATION_DURATION_S } from "../lib/constants";
import { classNames } from "@/shared/lib/utils/classNames";

// Import vanta.js types (we'll declare them since vanta.js doesn't have perfect TypeScript support)
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
    THREE: any; // THREE.js needs to be available globally for vanta.js
  }
}

// Convert hex color string to vanta.js 0x format
function hexToVantaColor(hex: string): number {
  const cleaned = hex.replace("#", "");
  return parseInt(cleaned, 16);
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

interface AnimatedBackgroundProps {
  onAnimationComplete?: () => void;
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  onAnimationComplete,
  className,
  children,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<{
    destroy: () => void;
    resize: () => void;
  } | null>(null);
  const animationCompleteRef = useRef(false);
  const isInitializingRef = useRef(false); // Guard to prevent multiple initializations

  // Custom colors from your design
  const color2 = "#fcf8ed"; // bone color (light)
  const color1 = "#14100c"; // black color (dark)

  useEffect(() => {
    // Prevent multiple initializations (React.StrictMode double render)
    // Check if effect already exists first - if it does, we're done
    if (vantaEffectRef.current) {
      // Removed console.log to reduce frame time variance
      return () => {
        // Cleanup function - effect already exists, so don't destroy it
      };
    }

    // Check guard - but allow initialization if guard is stuck (e.g., from failed init)
    // Reset guard if it's been stuck for more than 5 seconds (indicates failed init)
    if (isInitializingRef.current) {
      // If guard is true but no effect exists, it means initialization failed or was stuck
      // Reset guard and allow initialization to proceed
      if (!vantaEffectRef.current) {
        // Removed console.warn and fetch to reduce frame time variance
        isInitializingRef.current = false;
      } else {
        // Removed console.log to reduce frame time variance
        return () => {
          // Cleanup function - but don't reset guard here as init might still be in progress
        };
      }
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Set guard immediately to prevent React.StrictMode double render
    isInitializingRef.current = true;

    // Use a cleanup flag to track if this effect was cleaned up
    let wasCleanedUp = false;
    let cleanupFn: (() => void) | undefined;

    // Dynamically import vanta.js - defer to avoid blocking main thread
    const initVanta = async () => {
      // Check if this effect was cleaned up (React.StrictMode cleanup)
      if (wasCleanedUp) {
        // Removed console.log to reduce frame time variance
        isInitializingRef.current = false;
        return;
      }

      // Re-check guard in case another instance started
      if (vantaEffectRef.current) {
        // Removed console.log to reduce frame time variance
        isInitializingRef.current = false;
        return;
      }

      // Re-check container in case it was unmounted
      const container = containerRef.current;
      if (!container) {
        isInitializingRef.current = false;
        return;
      }

      // Ensure container is actually in the DOM
      if (!container.isConnected) {
        isInitializingRef.current = false;
        return;
      }

      // Remove any existing canvas elements before initializing (prevent duplicates)
      const existingCanvases = container.querySelectorAll("canvas");
      if (existingCanvases.length > 0) {
        existingCanvases.forEach((canvas) => {
          try {
            canvas.remove();
          } catch (e) {
            // Silently handle removal errors
          }
        });
      }

      try {
        // Ensure container has dimensions before initializing vanta.js
        const containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) {
          // Wait for next frame to allow layout to settle
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }

        // Defer THREE.js import to avoid blocking main thread (causes frame time spikes)
        // Use requestIdleCallback to load during idle periods
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

        // THREE.js is imported as a namespace module
        // @ts-expect-error - THREE module structure
        const THREE = THREE_MODULE.default || THREE_MODULE;

        // Make THREE available globally for vanta.js (it expects window.THREE)
        if (!window.THREE) {
          (window as any).THREE = THREE;
        }

        // Removed console.log to reduce frame time variance
        // console.log("THREE loaded:", {
        //   hasTHREE: !!THREE,
        //   hasColor: !!(THREE && THREE.Color),
        //   windowTHREE: !!window.THREE,
        //   windowTHREEColor: !!(window.THREE && window.THREE.Color),
        //   THREEKeys: THREE ? Object.keys(THREE).slice(0, 10) : null,
        // });

        // Defer vanta.js import to avoid blocking main thread
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
              // @ts-expect-error - vanta.js doesn't have perfect TypeScript support
              const vantaModule = await import("vanta/dist/vanta.fog.min.js");
              resolve(vantaModule);
            });
          });
        };

        // vanta.js doesn't have perfect TypeScript support
        const vantaModule: any = await loadVanta();

        // Removed console.log to reduce frame time variance
        // console.log("Vanta module structure:", {
        //   module: vantaModule,
        //   default: vantaModule.default,
        //   defaultType: typeof vantaModule.default,
        //   hasFOG: !!(vantaModule.default && vantaModule.default.FOG),
        //   moduleKeys: Object.keys(vantaModule),
        // });

        // vanta.js exports FOG as default, which might be the function itself or an object
        // The default export should be the FOG function directly
        const FOG = vantaModule.default;

        if (!FOG) {
          isInitializingRef.current = false;
          return;
        }

        // If FOG is a function, use it directly
        // If it's an object with FOG property, use that
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

        // Removed console.log to reduce frame time variance
        // console.log("FOG function found:", {
        //   functionType: typeof fogFunction,
        //   functionLength: fogFunction.length, // Number of expected parameters
        // });

        // Convert colors to vanta.js format (0x hex)
        const baseColor = hexToVantaColor(color1); // Light bone color
        const highlightColor = hexToVantaColor(color2); // Dark color
        const lowlightColor = hexToVantaColor(color2); // Dark color
        const midtoneColor = calculateMidtoneColor(color1, color2); // Mid-tone between the two

        // Removed console.log to reduce frame time variance
        // console.log("Initializing vanta.js FOG with colors:", {
        //   baseColor: `0x${baseColor.toString(16)}`,
        //   highlightColor: `0x${highlightColor.toString(16)}`,
        //   midtoneColor: `0x${midtoneColor.toString(16)}`,
        //   containerSize: {
        //     width: container.offsetWidth,
        //     height: container.offsetHeight,
        //   },
        // });

        // Initialize vanta.js FOG effect - call the function directly
        // Some versions of vanta.js accept THREE as first parameter
        // Optimized for 60 FPS: reduced settings for Safari and mobile devices
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        // Detect mobile devices for additional optimizations
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) || window.innerWidth <= 768;
        // Detect low-end devices (heuristic based on hardware concurrency and device memory)
        const nav = navigator as Navigator & { deviceMemory?: number };
        const isLowEndDevice =
          (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
          (nav.deviceMemory && nav.deviceMemory <= 4) ||
          isMobile;

        const fogOptions = {
          el: container,
          // Disable controls on Safari and mobile for better performance
          mouseControls: !isSafari && !isMobile,
          touchControls: !isSafari && !isMobile,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor,
          midtoneColor,
          lowlightColor,
          baseColor,
          // Progressive quality reduction: Desktop > Safari > Mobile > Low-end
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

        // Try calling with THREE as first parameter if function signature supports it
        // Ensure we don't create multiple instances
        const existingEffect = vantaEffectRef.current;
        if (existingEffect) {
          try {
            // Type assertion needed because TypeScript can't infer the type correctly
            (existingEffect as { destroy: () => void }).destroy();
          } catch (e) {
            // Silently handle destroy errors
          }
          vantaEffectRef.current = null;
        }

        // Remove any existing canvas elements from container to prevent duplicates
        // vanta.js appends canvas elements directly to the container
        if (container) {
          const existingCanvases = container.querySelectorAll("canvas");
          existingCanvases.forEach((canvas) => {
            try {
              canvas.remove();
            } catch (e) {
              // Silently handle removal errors
            }
          });
        }

        // Verify container is still valid and in DOM before initializing
        if (!container || !container.isConnected) {
          isInitializingRef.current = false;
          return;
        }

        // Removed console.log to reduce frame time variance
        // console.log("Initializing vanta.js with options:", {
        //   hasEl: !!fogOptions.el,
        //   elType: typeof fogOptions.el,
        //   elIsElement: fogOptions.el instanceof HTMLElement,
        //   elNodeType: fogOptions.el?.nodeType,
        //   containerIsConnected: container.isConnected,
        // });

        // Double-check we haven't been cleaned up or another instance was created
        if (wasCleanedUp || vantaEffectRef.current) {
          isInitializingRef.current = false;
          return;
        }

        // Try calling vanta.js FOG - check function length to determine signature
        // If function.length === 1, it expects only options (uses window.THREE)
        // If function.length === 2, it expects (THREE, options)
        try {
          let result: any;
          if (fogFunction.length === 2) {
            // Function expects (THREE, options)
            // Removed console.log to reduce frame time variance
            result = fogFunction(THREE, fogOptions);
          } else {
            // Function expects only options (uses window.THREE)
            // Removed console.log to reduce frame time variance
            result = fogFunction(fogOptions);
          }

          // Final check before assigning - prevent race conditions
          if (wasCleanedUp || vantaEffectRef.current) {
            // Another instance was created or we were cleaned up
            try {
              if (result && typeof result === "object" && result.destroy) {
                result.destroy();
              }
            } catch (e) {
              // Silently handle destroy errors
            }
            isInitializingRef.current = false;
            return;
          }

          if (result && typeof result === "object" && result.resize) {
            vantaEffectRef.current = result;
            // Removed console.log to reduce frame time variance
            // console.log("Vanta.js initialized successfully");
          } else {
            throw new Error(
              `Invalid result from fogFunction: ${typeof result}`
            );
          }
        } catch (e) {
          isInitializingRef.current = false;
          return; // Don't throw, just return to prevent crash
        }

        // Verify the effect was created successfully
        if (!vantaEffectRef.current) {
          isInitializingRef.current = false;
          return;
        }

        // Vanta.js initialized successfully
      } catch (error) {
        isInitializingRef.current = false; // Reset guard on error
        return;
      }

      // Track animation completion (2000ms animation + 1000ms delay = 3000ms total)
      const animationDuration = ANIMATION_DURATION_MS + 1000; // 2000ms + 1000ms delay
      const animationTimer = setTimeout(() => {
        if (!animationCompleteRef.current && onAnimationComplete) {
          animationCompleteRef.current = true;
          onAnimationComplete();
        }
      }, animationDuration);

      // Handle window resize - optimized for 60 FPS during active resizing
      // Use requestAnimationFrame throttling during active resize + debounce for final resize
      let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
      let resizeRafId: number | null = null;
      let lastResizeTime = 0;
      let isResizing = false;
      const RESIZE_THROTTLE_MS = 100; // Throttle to max once per 100ms during active resize
      const RESIZE_DEBOUNCE_MS = 300; // Debounce final resize after resize stops

      const handleResize = () => {
        const now = performance.now();
        isResizing = true;

        // Cancel any pending debounced resize
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
          resizeTimeout = null;
        }

        // Cancel any pending RAF resize
        if (resizeRafId !== null) {
          cancelAnimationFrame(resizeRafId);
          resizeRafId = null;
        }

        // Throttle resize calls during active resizing (max once per 100ms)
        const timeSinceLastResize = now - lastResizeTime;
        if (timeSinceLastResize < RESIZE_THROTTLE_MS) {
          // Too soon since last resize - schedule for later
          resizeRafId = requestAnimationFrame(() => {
            if (vantaEffectRef.current && isResizing) {
              vantaEffectRef.current.resize();
              lastResizeTime = performance.now();
            }
            resizeRafId = null;
          });
        } else {
          // Enough time has passed - resize immediately
          if (vantaEffectRef.current) {
            vantaEffectRef.current.resize();
            lastResizeTime = performance.now();
          }
        }

        // Debounce final resize after resize stops (for final cleanup)
        resizeTimeout = setTimeout(() => {
          isResizing = false;
          if (vantaEffectRef.current) {
            // Final resize after resize stops
            vantaEffectRef.current.resize();
          }
        }, RESIZE_DEBOUNCE_MS);
      };

      window.addEventListener("resize", handleResize);

      // Handle visibility changes (tab switching) to pause/resume vanta.js
      // This prevents FPS drops when switching tabs
      const handleVisibilityChange = () => {
        if (!vantaEffectRef.current) return;

        // When tab becomes hidden, browsers throttle requestAnimationFrame
        // vanta.js will automatically pause, but we can help by not calling resize
        // When tab becomes visible, vanta.js will resume automatically
        // No action needed - vanta.js handles this internally
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        if (resizeRafId !== null) {
          cancelAnimationFrame(resizeRafId);
        }
        clearTimeout(animationTimer);
      };
    };

    // Defer vanta.js initialization to avoid blocking main thread
    // Use requestAnimationFrame for more reliable timing than requestIdleCallback
    // requestIdleCallback can be delayed indefinitely when tab is inactive
    const scheduleVantaInit = (callback: () => void) => {
      // Use requestAnimationFrame for immediate next frame execution
      // This is more reliable than requestIdleCallback which can be delayed
      requestAnimationFrame(() => {
        // Double-check we're still in a valid state
        if (!wasCleanedUp && !vantaEffectRef.current) {
          callback();
        }
      });

      // Fallback: if requestAnimationFrame is throttled (tab inactive), use setTimeout
      // This ensures initialization happens even if tab starts inactive
      setTimeout(() => {
        if (!wasCleanedUp && !vantaEffectRef.current) {
          // Only execute if not already initialized by requestAnimationFrame
          callback();
        }
      }, 200); // 200ms fallback ensures initialization happens
    };

    let initExecuted = false; // Prevent double execution from both requestIdleCallback and setTimeout

    scheduleVantaInit(() => {
      if (initExecuted) {
        // Already executed from another callback
        return;
      }
      initExecuted = true;

      if (!wasCleanedUp && !vantaEffectRef.current) {
        // Only initialize if not cleaned up and not already initialized
        initVanta().then((cleanupFromInit) => {
          if (!wasCleanedUp && cleanupFromInit) {
            cleanupFn = cleanupFromInit;
          }
        });
      }
    });

    return () => {
      // Mark as cleaned up to prevent async initialization from continuing
      wasCleanedUp = true;

      // Cleanup vanta.js effect - properly destroy it to remove canvas
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (e) {
          // Silently handle destroy errors
        }
        vantaEffectRef.current = null;
      }

      // Remove any remaining canvas elements from container (safety cleanup)
      const container = containerRef.current;
      if (container) {
        const existingCanvases = container.querySelectorAll("canvas");
        existingCanvases.forEach((canvas) => {
          try {
            canvas.remove();
          } catch (e) {
            // Silently handle removal errors
          }
        });
      }

      // Reset guard immediately on cleanup - if initialization is still in progress,
      // it will check wasCleanedUp and abort itself
      // Don't wait for timeout - reset immediately to allow re-initialization
      isInitializingRef.current = false;

      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [onAnimationComplete, color1, color2]);

  return (
    <div
      ref={containerRef}
      className={classNames(styles.background, {}, [className])}
      style={{
        // Set CSS custom properties for animation duration
        // These can be accessed from other components via getComputedStyle
        ["--animation-duration" as string]: `${ANIMATION_DURATION_S}s`,
      }}
      aria-hidden="true"
      id={id ? id : ""}
    >
      <div className={styles.backgroundOverlay} />
      {children}
    </div>
  );
};
