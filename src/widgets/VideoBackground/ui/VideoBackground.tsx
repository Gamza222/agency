/**
 * Video Background Component
 * Uses animated WebP image as background with entrance animation
 */

"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./VideoBackground.module.scss";
import { ANIMATION_DURATION_MS, ANIMATION_DURATION_S } from "../lib/constants";
import type { VideoBackgroundProps } from "../types/types";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import videoBg from "@/shared/assets/icons/video-bg.webp";

export const VideoBackground: React.FC<VideoBackgroundProps> = memo(
  ({ className, onAnimationComplete, onLoadComplete, shouldStart = false }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationStarted, setAnimationStarted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const didComplete = useRef({ load: false, animation: false });

    const handleImageLoad = useCallback(() => {
      if (didComplete.current.load) return;
      didComplete.current.load = true;
      setIsLoaded(true);
      onLoadComplete?.();
    }, [onLoadComplete]);

    // Check for cached image on mount
    useEffect(() => {
      const img = containerRef.current?.querySelector("img");
      if (img?.complete) handleImageLoad();
    }, [handleImageLoad]);

    // Start animation when loaded and shouldStart is true
    useEffect(() => {
      if (isLoaded && shouldStart && !animationStarted) {
        setAnimationStarted(true);
      }
    }, [isLoaded, shouldStart, animationStarted]);

    // Signal animation complete
    useEffect(() => {
      if (!animationStarted) return;

      const timer = setTimeout(() => {
        if (!didComplete.current.animation) {
          didComplete.current.animation = true;
          onAnimationComplete?.();
        }
      }, ANIMATION_DURATION_MS - 800);

      return () => clearTimeout(timer);
    }, [animationStarted, onAnimationComplete]);

    return (
      <div
        ref={containerRef}
        className={classNames(styles.videoBackground, {}, [className])}
        style={{
          // Set CSS custom properties for animation duration
          ["--animation-duration" as string]: `${ANIMATION_DURATION_S}s`,
        }}
        aria-hidden="true"
      >
        <Image
          src={videoBg}
          alt="video-background"
          fill
          className={classNames(styles.videoImage, {
            [styles.videoImage_loaded as string]: animationStarted,
          })}
          onLoad={handleImageLoad}
          onError={() => {
            console.error("Failed to load video background image");
          }}
          unoptimized // Required for animated WebP - prevents Next.js optimization that would break animation
          priority // Load immediately
          style={{
            objectFit: "cover",
          }}
        />
      </div>
    );
  }
);

VideoBackground.displayName = "VideoBackground";
