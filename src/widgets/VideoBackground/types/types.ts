export interface VideoBackgroundProps {
  className?: string;
  onAnimationComplete?: () => void;
  onLoadComplete?: () => void;
  shouldStart?: boolean;
}
