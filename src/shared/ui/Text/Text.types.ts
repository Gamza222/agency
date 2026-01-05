import { HTMLAttributes } from "react";

export enum TextVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ERROR = "error",
  NAVBAR_MOBILE_LINK = "navbar_mobile_link",
}

export enum TextAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export enum TextSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  XL2 = "xl2",
  XL3 = "xl3",
  XL4 = "xl4",
  XL5 = "xl5",
  XL6 = "xl6",
  PERCENTAGE = "percentage",
}

export enum TextFontWeight {
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

type TextTag = "h1" | "h2" | "h3" | "p" | "span";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextTag;
  variant?: TextVariant;
  align?: TextAlign;
  size?: TextSize;
  fontWeight?: TextFontWeight;
  className?: string | undefined;
}
