export interface AppBackgroundProps {
  className?: string;
  onAnimationComplete?: () => void;
  onLoadComplete?: () => void;
  shouldStart?: boolean;
  children?: React.ReactNode;
}
