
import React, { memo, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
CustomEase
import styles from "./VideoBackground.module.scss";
import {
  ANIMATION_DURATION_MS,
  ANIMATION_COMPLETE_OFFSET_MS,
} from "../lib/constants";
import { useImageLoad } from "../lib/hooks/useImageLoad";
import type { VideoBackgroundProps } from "../types/types";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import videoBg from "@/shared/assets/icons/video-bg.webp";


gsap.registerPlugin(CustomEase);

export const VideoBackground: React.FC<VideoBackgroundProps> = memo(
  ({ className, onAnimationComplete, onLoadComplete, shouldStart = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    // Refs to prevent multiple starts and track state
    const hasStartedRef = useRef(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const onAnimationCompleteRef = useRef(onAnimationComplete);
    
    // Keep callback ref up to date without causing re-renders
    useEffect(() => {
      onAnimationCompleteRef.current = onAnimationComplete;
    }, [onAnimationComplete]);

    const { isLoaded, handleImageLoad } = useImageLoad({
      containerRef,
      onLoadComplete,
    });

    // Start GSAP animation when loaded and shouldStart is true - only once
    useEffect(() => {
      const img = imageRef.current;
      if (!img) return;
      
      // Only start once
      if (isLoaded && shouldStart && !hasStartedRef.current) {
        CustomEase.create("myCustomEase", "M0,0 C0.19,1 0.22,1 1,1");
        hasStartedRef.current = true;
        
        // Create GSAP timeline with all events tied to it
        const timeline = gsap.timeline();
        timelineRef.current = timeline;
        
        // Main animation - from initial state to final state
        timeline.fromTo(
          img,
          {
            // Initial state (matches CSS)
            x: '-10%',
            y: '120%',
            rotate: 5,
            opacity: 0,
          },
          {
            // Final state (matches CSS)
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: ANIMATION_DURATION_MS / 1000, // Convert to seconds
            ease: "myCustomEase",
          },
          0 // Start at time 0
        );
        
        // Add callback at specific time (slightly before animation ends)
        // Position: animation duration - offset = when to fire callback
        const callbackTime = (ANIMATION_DURATION_MS - ANIMATION_COMPLETE_OFFSET_MS) / 1000;
        timeline.call(
          () => {
            onAnimationCompleteRef.current?.();
          },
          [],
          callbackTime // Fire at 1.2 seconds (1200ms into the 2000ms animation)
        );
      }
      
      // Cleanup on unmount
      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }
      };
    }, [isLoaded, shouldStart]); // No onAnimationComplete in deps - use ref

    // Memoize image style
    const imageStyle = useMemo(
      () => ({
        objectFit: "cover" as const,
      }),
      []
    );

    return (
      <div
        ref={containerRef}
        className={classNames(styles.videoBackground, {}, [className])}
        aria-hidden="true"
      >
        <img
          ref={imageRef}
          src={videoBg}
          alt="video-background"
          className={styles.videoImage}
          onLoad={handleImageLoad}
          onError={() => {
            console.error("Failed to load video background image");
          }}
          style={{
            ...imageStyle,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            // Initial state set in CSS, GSAP will animate from there
          }}
        />
      </div>
    );
  }
);

VideoBackground.displayName = "VideoBackground";
