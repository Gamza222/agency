import type { ReactNode } from "react";

export interface HighlightsProps {
  /** Additional class name */
  className?: string;
}

export interface HighlightsInfoProps {
  /** Additional class name */
  className?: string;
  /** Content to render inside the section */
  children?: ReactNode;
  /** Entrance progress (0-1) for controlled mode */
  entranceProgress?: number;
  /** Exit progress (0-1) for controlled mode */
  exitProgress?: number;
}

export interface HighlightsShowcaseProps {
  /** Additional class name */
  className?: string;
  /** Content to render inside the section */
  children?: ReactNode;
  /** Entrance progress (0-1) for controlled mode */
  entranceProgress?: number;
  /** Exit progress (0-1) for controlled mode */
  exitProgress?: number;
}
