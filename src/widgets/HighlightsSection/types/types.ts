import type { RefObject } from "react";

/**
 * Props for HighlightsSection component
 */
export interface HighlightsSectionProps {
  className?: string;
}

/**
 * Props for HighlightsInfo component
 */
export interface HighlightsInfoProps {
  className?: string;
  containerRef?: RefObject<HTMLDivElement>;
}

/**
 * Props for HighlightsPreCanvas component
 */
export interface HighlightsPreCanvasProps {
  className?: string;
  /** Project title */
  title: string;
  /** Project link href */
  href?: string;
  /** Shared container ref for ScrollTrigger */
  containerRef?: RefObject<HTMLDivElement>;
}

/**
 * Props for HighlightProject component
 */
export interface HighlightProjectProps {
  className?: string;
  /** Project color */
  color?: string;
  /** Shared container ref for ScrollTrigger */
  containerRef?: RefObject<HTMLDivElement>;
}
