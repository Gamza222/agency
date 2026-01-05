"use client";

import { useEffect, useRef } from "react";

interface FPSMonitorProps {
  onFPSUpdate?: (fps: number) => void;
  logToServer?: boolean;
}

/**
 * Global FPS Monitor
 * Tracks frame rate across the entire website using requestAnimationFrame
 */
export const FPSMonitor: React.FC<FPSMonitorProps> = ({
  onFPSUpdate,
  logToServer = true,
}) => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const rafIdRef = useRef<number>();

  useEffect(() => {
    let frameTimeHistory: number[] = [];
    let lastFrameTime = performance.now();

    const measureFPS = (currentTime: number) => {
      // Track frame time to detect blocking operations
      const frameTime = currentTime - lastFrameTime;
      frameTimeHistory.push(frameTime);
      if (frameTimeHistory.length > 60) {
        frameTimeHistory.shift();
      }
      lastFrameTime = currentTime;

      frameCountRef.current++;
      const elapsed = currentTime - lastTimeRef.current;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;

        // Keep history of last 10 FPS readings
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }

        // Calculate average FPS
        const avgFPS =
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) /
          fpsHistoryRef.current.length;

        // Calculate frame time statistics
        const avgFrameTime =
          frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
        const maxFrameTime = Math.max(...frameTimeHistory);
        const minFrameTime = Math.min(...frameTimeHistory);
        const slowFrames = frameTimeHistory.filter((ft) => ft > 20).length; // Frames > 20ms (below 50 FPS)

        // Calculate frame time variance (jitter) - this detects "freezing" feeling despite 60 FPS
        const frameTimeVariance =
          frameTimeHistory.reduce((sum, ft) => {
            const diff = ft - avgFrameTime;
            return sum + diff * diff;
          }, 0) / frameTimeHistory.length;
        const frameTimeStdDev = Math.sqrt(frameTimeVariance);
        const frameTimeJitter = maxFrameTime - minFrameTime; // Range of frame times

        // Detect frame time spikes (frames that take significantly longer than average)
        const spikeThreshold = avgFrameTime * 1.5; // 50% longer than average
        const frameTimeSpikes = frameTimeHistory.filter(
          (ft) => ft > spikeThreshold
        ).length;

        // Defer expensive operations (canvas queries, JSON.stringify, fetch) to avoid blocking main thread
        // This prevents 6+ second frame times that were causing FPS drops
        const scheduleIdleWork = (callback: () => void) => {
          if (typeof requestIdleCallback !== "undefined") {
            requestIdleCallback(callback, { timeout: 100 });
          } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(callback, 0);
          }
        };
        scheduleIdleWork(() => {
          // Calculate GPU memory usage from canvas elements
          // Check both visible and hidden canvases - use a more reliable method
          const canvases = document.querySelectorAll("canvas");
          let totalCanvasMemory = 0;
          let maxCanvasDimensions = { width: 0, height: 0 };
          let activeCanvasCount = 0;
          let totalPixels = 0;
          const canvasDetails: Array<{
            id?: string;
            width: number;
            height: number;
            cssWidth: number;
            cssHeight: number;
            memoryMB: string;
            contextType?: string;
            isVisible: boolean;
          }> = [];

          canvases.forEach((canvas, index) => {
            const htmlCanvas = canvas as HTMLCanvasElement;
            const canvasId = htmlCanvas.id || `canvas-${index}`;
            const rect = htmlCanvas.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;

            // Use actual canvas dimensions (not CSS dimensions)
            const canvasWidth = htmlCanvas.width || 0;
            const canvasHeight = htmlCanvas.height || 0;

            // Don't try to get context type - calling getContext() can cause WebGL context conflicts
            // If a canvas has a WebGL context (from vanta.js), calling getContext() will fail
            // We can infer context type from canvas usage patterns, but it's not critical for FPS monitoring
            // Simply skip context type detection to avoid errors
            let contextType: string | undefined;
            // Note: We intentionally don't call getContext() here to avoid "Canvas has an existing context" errors
            // Context type is optional metadata and not needed for FPS/GPU memory calculations

            // Only count if canvas has been initialized
            if (canvasWidth > 0 && canvasHeight > 0) {
              activeCanvasCount++;
              const memory = canvasWidth * canvasHeight * 4; // RGBA = 4 bytes per pixel
              totalCanvasMemory += memory;
              totalPixels += canvasWidth * canvasHeight;
              canvasDetails.push({
                id: canvasId,
                width: canvasWidth,
                height: canvasHeight,
                cssWidth: rect.width,
                cssHeight: rect.height,
                memoryMB: (memory / (1024 * 1024)).toFixed(2),
                contextType,
                isVisible,
              });
              if (canvasWidth > maxCanvasDimensions.width) {
                maxCanvasDimensions.width = canvasWidth;
              }
              if (canvasHeight > maxCanvasDimensions.height) {
                maxCanvasDimensions.height = canvasHeight;
              }
            }
          });
          const totalCanvasMemoryMB = totalCanvasMemory / (1024 * 1024);

          // Log to server (deferred to avoid blocking)
          if (logToServer) {
            // Defer JSON.stringify and fetch to next tick to avoid blocking
            setTimeout(() => {
              fetch(
                "http://127.0.0.1:7242/ingest/2f0f0f2d-65d2-4907-9100-b44f0fe9f9bb",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    location: "FPSMonitor.tsx",
                    message: "Global FPS and GPU memory measurement",
                    data: {
                      fps,
                      avgFPS: Math.round(avgFPS),
                      minFPS: Math.min(...fpsHistoryRef.current),
                      maxFPS: Math.max(...fpsHistoryRef.current),
                      history: fpsHistoryRef.current,
                      targetFPS: 60,
                      belowTarget: fps < 60,
                      frameTime: {
                        avg: Math.round(avgFrameTime * 100) / 100,
                        max: Math.round(maxFrameTime * 100) / 100,
                        min: Math.round(minFrameTime * 100) / 100,
                        slowFrames,
                        slowFramePercent: Math.round(
                          (slowFrames / frameTimeHistory.length) * 100
                        ),
                        // Frame time variance metrics to detect "freezing" feeling
                        stdDev: Math.round(frameTimeStdDev * 100) / 100,
                        jitter: Math.round(frameTimeJitter * 100) / 100,
                        spikes: frameTimeSpikes,
                        spikePercent: Math.round(
                          (frameTimeSpikes / frameTimeHistory.length) * 100
                        ),
                        // Flag if jitter is high (indicates freezing feeling despite 60 FPS)
                        highJitter: frameTimeJitter > 5, // More than 5ms variance indicates stuttering
                      },
                      gpuMemory: {
                        totalCanvasMemoryMB:
                          Math.round(totalCanvasMemoryMB * 100) / 100,
                        canvasCount: canvases.length,
                        activeCanvasCount,
                        maxCanvasWidth: maxCanvasDimensions.width,
                        maxCanvasHeight: maxCanvasDimensions.height,
                        windowWidth: window.innerWidth,
                        windowHeight: window.innerHeight,
                        canvasDetails,
                        totalPixels,
                      },
                    },
                    timestamp: Date.now(),
                    sessionId: "debug-session",
                    runId: "fps-optimization-v4",
                    hypothesisId: "FPS",
                  }),
                }
              ).catch(() => {});
            }, 0);
          }
        });

        // Callback
        if (onFPSUpdate) {
          onFPSUpdate(fps);
        }
      }

      rafIdRef.current = requestAnimationFrame(measureFPS);
    };

    rafIdRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [onFPSUpdate, logToServer]);

  return null; // This component doesn't render anything
};
