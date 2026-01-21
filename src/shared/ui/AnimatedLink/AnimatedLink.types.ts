import { HTMLAttributes, ReactNode } from "react";

export enum AnimatedLinkVariant {
  DEFAULT = "default",
  NAVBAR = "navbar",
}
export enum AnimatedLinkSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  XL2 = "xl2",
  XL3 = "xl3",
  XL4 = "xl4",
  XL5 = "xl5",
  PERCENTAGE = "percentage",
}

export enum AnimatedLinkFontWeight {
  XM = "100",
  SM = "200",
  MD = "300",
  LG = "400",
  XL = "500",
  XL2 = "600",
  XL3 = "700",
  XL4 = "800",
  XL5 = "900",
}
export interface AnimatedLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  /** Link href */
  href?: string;
  /** Link title/text */
  title?: string;
  /** Component variant */
  variant?: AnimatedLinkVariant;
  /** Component size */
  size?: AnimatedLinkSize;
  mailto?: boolean;
  icon?: ReactNode;
  /** Component font weight */
  fontWeight?: AnimatedLinkFontWeight;
  /** Additional class name */
  className?: string;
}
