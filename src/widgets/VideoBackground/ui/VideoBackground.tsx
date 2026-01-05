/**
 * Video Background Component
 * Uses animated WebP image as background with entrance animation
 */

"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import styles from "./VideoBackground.module.scss";
import { ANIMATION_DURATION_S } from "../lib/constants";
import { useImageLoad } from "../lib/hooks/useImageLoad";
import { useAnimationCompletion } from "../lib/hooks/useAnimationCompletion";
import type { VideoBackgroundProps } from "../types/types";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
import videoBg from "@/shared/assets/icons/video-bg.webp";

export const VideoBackground: React.FC<VideoBackgroundProps> = memo(
  ({ className, onAnimationComplete, onLoadComplete, shouldStart = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [animationStarted, setAnimationStarted] = useState(false);

    const { isLoaded, handleImageLoad } = useImageLoad({
      containerRef,
      onLoadComplete,
    });

    // Start animation when loaded and shouldStart is true
    useEffect(() => {
      if (isLoaded && shouldStart && !animationStarted) {
        setAnimationStarted(true);
      }
    }, [isLoaded, shouldStart, animationStarted]);

    // Handle animation completion
    useAnimationCompletion({
      animationStarted,
      onAnimationComplete,
    });

    // Memoize container style
    const containerStyle = useMemo(
      () =>
        ({
          ["--animation-duration" as string]: `${ANIMATION_DURATION_S}s`,
        }) as React.CSSProperties,
      []
    );

    // Memoize image class modifiers
    const imageMods = useMemo(
      () => ({
        [styles.videoImage_loaded as string]: animationStarted,
      }),
      [animationStarted]
    );

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
        style={containerStyle}
        aria-hidden="true"
      >
        <img
          src={videoBg}
          alt="video-background"
          className={classNames(styles.videoImage, imageMods)}
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
          }}
        />
      </div>
    );
  }
);

VideoBackground.displayName = "VideoBackground";
