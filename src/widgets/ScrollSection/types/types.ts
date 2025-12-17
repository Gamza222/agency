import type { ReactNode } from "react";

export interface ScrollSectionProps {
  /** Content to render inside the section */
  children: ReactNode;
  /** Additional class name */
  className?: string;
  /** Section height - defaults to 100vh */
  height?: string;
  /** Background color/style */
  background?: string;
  /** Z-index for stacking sections */
  zIndex?: number;
  /** Entrance progress (0-1) - REQUIRED - use useScrollChoreography hook to calculate */
  entranceProgress: number;
  /** Exit progress (0-1) - REQUIRED - use useScrollChoreography hook to calculate */
  exitProgress: number;
}
