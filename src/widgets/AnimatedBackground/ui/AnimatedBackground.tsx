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
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  onAnimationComplete,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<{
    destroy: () => void;
    resize: () => void;
  } | null>(null);
  const animationCompleteRef = useRef(false);
  const isInitializingRef = useRef(false); // Guard to prevent multiple initializations

  // Custom colors from your design
  const color1 = "#fcf8ed"; // bone color (light)
  const color2 = "#14100c"; // black color (dark)

  useEffect(() => {
    // Prevent multiple initializations (React.StrictMode double render)
    // Use a more robust guard that persists across renders
    if (isInitializingRef.current) {
      console.log("Vanta.js initialization already in progress, skipping...");
      return () => {
        // Cleanup function - but don't reset guard here as init might still be in progress
      };
    }
    if (vantaEffectRef.current) {
      console.log("Vanta.js effect already exists, skipping initialization...");
      return () => {
        // Cleanup function - effect already exists, so don't destroy it
      };
    }

    const container = containerRef.current;
    if (!container) {
      console.warn(
        "Container ref not available, skipping vanta.js initialization"
      );
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
        console.log("Effect was cleaned up, aborting initialization...");
        isInitializingRef.current = false;
        return;
      }

      // Re-check guard in case another instance started
      if (vantaEffectRef.current) {
        console.log("Vanta effect created by another instance, aborting...");
        isInitializingRef.current = false;
        return;
      }

      // Re-check container in case it was unmounted
      const container = containerRef.current;
      if (!container) {
        console.warn("Container ref lost during initialization, aborting...");
        isInitializingRef.current = false;
        return;
      }

      // Ensure container is actually in the DOM
      if (!container.isConnected) {
        console.warn("Container not connected to DOM, aborting...");
        isInitializingRef.current = false;
        return;
      }

      try {
        // #region agent log - vanta.js initialization start
        const initStartTime = performance.now();
        fetch(
          "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "AnimatedBackground.tsx:init-start",
              message: "Vanta.js initialization starting",
              data: {
                containerWidth: container.offsetWidth,
                containerHeight: container.offsetHeight,
                hasExistingEffect: !!vantaEffectRef.current,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "vanta-performance",
              hypothesisId: "FRAME_TIME_VARIANCE",
            }),
          }
        ).catch(() => {});
        // #endregion
        // Ensure container has dimensions before initializing vanta.js
        const containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) {
          console.warn(
            "Container has no dimensions, waiting for next frame..."
          );
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

        console.log("THREE loaded:", {
          hasTHREE: !!THREE,
          hasColor: !!(THREE && THREE.Color),
          windowTHREE: !!window.THREE,
          windowTHREEColor: !!(window.THREE && window.THREE.Color),
          THREEKeys: THREE ? Object.keys(THREE).slice(0, 10) : null,
        });

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

        // Debug: log the module structure to understand it
        console.log("Vanta module structure:", {
          module: vantaModule,
          default: vantaModule.default,
          defaultType: typeof vantaModule.default,
          hasFOG: !!(vantaModule.default && vantaModule.default.FOG),
          moduleKeys: Object.keys(vantaModule),
        });

        // vanta.js exports FOG as default, which might be the function itself or an object
        // The default export should be the FOG function directly
        const FOG = vantaModule.default;

        if (!FOG) {
          console.error("FOG not found in module", vantaModule);
          return;
        }

        // If FOG is a function, use it directly
        // If it's an object with FOG property, use that
        let fogFunction: any;
        if (typeof FOG === "function") {
          fogFunction = FOG;
        } else if (FOG && typeof (FOG as any).FOG === "function") {
          fogFunction = (FOG as any).FOG;
        } else if (FOG && typeof (FOG as any).default?.FOG === "function") {
          fogFunction = (FOG as any).default.FOG;
        } else {
          console.error("FOG function not found", { FOG, type: typeof FOG });
          isInitializingRef.current = false;
          return;
        }

        // Check function signature - vanta.js FOG might expect different parameters
        console.log("FOG function found:", {
          functionType: typeof fogFunction,
          functionLength: fogFunction.length, // Number of expected parameters
        });

        // Convert colors to vanta.js format (0x hex)
        const baseColor = hexToVantaColor(color1); // Light bone color
        const highlightColor = hexToVantaColor(color2); // Dark color
        const lowlightColor = hexToVantaColor(color2); // Dark color
        const midtoneColor = calculateMidtoneColor(color1, color2); // Mid-tone between the two

        console.log("Initializing vanta.js FOG with colors:", {
          baseColor: `0x${baseColor.toString(16)}`,
          highlightColor: `0x${highlightColor.toString(16)}`,
          midtoneColor: `0x${midtoneColor.toString(16)}`,
          containerSize: {
            width: container.offsetWidth,
            height: container.offsetHeight,
          },
        });

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

        // #region agent log - vanta.js initialization
        fetch(
          "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "AnimatedBackground.tsx:init",
              message:
                "Vanta.js FOG initialized with performance optimizations",
              data: {
                isSafari,
                isMobile,
                isLowEndDevice,
                mouseControls: fogOptions.mouseControls,
                touchControls: fogOptions.touchControls,
                blurFactor: fogOptions.blurFactor,
                speed: fogOptions.speed,
                zoom: fogOptions.zoom,
                containerWidth: container.offsetWidth,
                containerHeight: container.offsetHeight,
                hardwareConcurrency: nav.hardwareConcurrency,
                deviceMemory: nav.deviceMemory,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "vanta-performance",
              hypothesisId: "FRAME_TIME_VARIANCE",
            }),
          }
        ).catch(() => {});
        // #endregion

        // Try calling with THREE as first parameter if function signature supports it
        // Ensure we don't create multiple instances
        const existingEffect = vantaEffectRef.current;
        if (existingEffect) {
          console.warn(
            "Vanta effect already exists, destroying old one before creating new"
          );
          try {
            // Type assertion needed because TypeScript can't infer the type correctly
            (existingEffect as { destroy: () => void }).destroy();
          } catch (e) {
            console.warn("Error destroying existing vanta effect:", e);
          }
          vantaEffectRef.current = null;
        }

        // Verify container is still valid and in DOM before initializing
        if (!container || !container.isConnected) {
          console.error("Container invalid before vanta.js initialization");
          isInitializingRef.current = false;
          return;
        }

        // Debug: log the fogOptions to verify el is set
        console.log("Initializing vanta.js with options:", {
          hasEl: !!fogOptions.el,
          elType: typeof fogOptions.el,
          elIsElement: fogOptions.el instanceof HTMLElement,
          elNodeType: fogOptions.el?.nodeType,
          containerIsConnected: container.isConnected,
        });

        // Try calling vanta.js FOG - check function length to determine signature
        // If function.length === 1, it expects only options (uses window.THREE)
        // If function.length === 2, it expects (THREE, options)
        try {
          let result: any;
          if (fogFunction.length === 2) {
            // Function expects (THREE, options)
            console.log(
              "Calling FOG with THREE parameter (function.length === 2)"
            );
            result = fogFunction(THREE, fogOptions);
          } else {
            // Function expects only options (uses window.THREE)
            console.log(
              "Calling FOG without THREE parameter (function.length !== 2)"
            );
            result = fogFunction(fogOptions);
          }

          if (result && typeof result === "object" && result.resize) {
            vantaEffectRef.current = result;
            console.log("Vanta.js initialized successfully");
          } else {
            throw new Error(
              `Invalid result from fogFunction: ${typeof result}`
            );
          }
        } catch (e) {
          console.error("Failed to initialize vanta.js FOG effect:", e);
          isInitializingRef.current = false;
          // #region agent log - vanta.js initialization error
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "AnimatedBackground.tsx:init-error",
                message: "Vanta.js initialization failed",
                data: {
                  error: e instanceof Error ? e.message : String(e),
                  functionLength: fogFunction.length,
                  hasEl: !!fogOptions.el,
                  elType: typeof fogOptions.el,
                  elIsElement: fogOptions.el instanceof HTMLElement,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "vanta-performance",
                hypothesisId: "FRAME_TIME_VARIANCE",
              }),
            }
          ).catch(() => {});
          // #endregion
          return; // Don't throw, just return to prevent crash
        }

        // Verify the effect was created successfully
        if (!vantaEffectRef.current) {
          console.error("Vanta effect was not created despite no error");
          isInitializingRef.current = false;
          return;
        }

        const initEndTime = performance.now();
        const initDuration = initEndTime - initStartTime;

        // #region agent log - vanta.js initialization complete
        fetch(
          "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "AnimatedBackground.tsx:init-complete",
              message: "Vanta.js initialization complete",
              data: {
                initDuration: Math.round(initDuration * 100) / 100,
                isSlow: initDuration > 100, // Flag if initialization takes > 100ms
                containerWidth: container.offsetWidth,
                containerHeight: container.offsetHeight,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "vanta-performance",
              hypothesisId: "FRAME_TIME_VARIANCE",
            }),
          }
        ).catch(() => {});
        // #endregion

        console.log(
          "Vanta.js FOG initialized successfully",
          vantaEffectRef.current,
          `(took ${Math.round(initDuration)}ms)`
        );
      } catch (error) {
        console.error("Failed to initialize vanta.js:", error);
        isInitializingRef.current = false; // Reset guard on error
        // #region agent log - vanta.js initialization error
        fetch(
          "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "AnimatedBackground.tsx:init-error",
              message: "Vanta.js initialization failed",
              data: {
                error: error instanceof Error ? error.message : String(error),
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "vanta-performance",
              hypothesisId: "FRAME_TIME_VARIANCE",
            }),
          }
        ).catch(() => {});
        // #endregion
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

      // Handle window resize - debounced for 60 FPS optimization
      let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
      const handleResize = () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        // Debounce resize to prevent excessive vanta.js recalculations
        resizeTimeout = setTimeout(() => {
          if (vantaEffectRef.current) {
            // #region agent log - vanta.js resize
            const resizeStart = performance.now();
            vantaEffectRef.current.resize();
            const resizeTime = performance.now() - resizeStart;
            if (resizeTime > 10) {
              // Only log if resize takes > 10ms
              fetch(
                "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    location: "AnimatedBackground.tsx:resize",
                    message: "Vanta.js resize (slow)",
                    data: {
                      resizeTime: Math.round(resizeTime * 100) / 100,
                      windowWidth: window.innerWidth,
                      windowHeight: window.innerHeight,
                    },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "vanta-performance",
                    hypothesisId: "FRAME_TIME_VARIANCE",
                  }),
                }
              ).catch(() => {});
            }
            // #endregion
          }
        }, 300); // 300ms debounce for 60 FPS
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        clearTimeout(animationTimer);
      };
    };

    initVanta().then((cleanupFromInit) => {
      cleanupFn = cleanupFromInit;
    });

    return () => {
      // Mark as cleaned up to prevent async initialization from continuing
      wasCleanedUp = true;

      // Cleanup vanta.js effect
      if (vantaEffectRef.current) {
        // #region agent log - vanta.js cleanup
        const cleanupStart = performance.now();
        try {
          vantaEffectRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying vanta effect:", e);
        }
        const cleanupDuration = performance.now() - cleanupStart;
        if (cleanupDuration > 10) {
          fetch(
            "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "AnimatedBackground.tsx:cleanup",
                message: "Vanta.js cleanup (slow)",
                data: {
                  cleanupDuration: Math.round(cleanupDuration * 100) / 100,
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "vanta-performance",
                hypothesisId: "FRAME_TIME_VARIANCE",
              }),
            }
          ).catch(() => {});
        }
        // #endregion
        vantaEffectRef.current = null;
      }

      // Only reset guard if we're actually cleaning up (not just React.StrictMode cleanup)
      // Use a timeout to allow async initialization to complete if it's almost done
      setTimeout(() => {
        // Only reset if effect was actually destroyed
        if (!vantaEffectRef.current) {
          isInitializingRef.current = false;
        }
      }, 100);

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
    >
      <div className={styles.backgroundOverlay} />
    </div>
  );
};
