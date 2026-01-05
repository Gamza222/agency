"use client";

import React from "react";
import styles from "./Text.module.scss";
import {
  TextProps,
  TextVariant,
  TextAlign,
  TextSize,
  TextFontWeight,
} from "./Text.types";
import { cva } from "@/shared/lib/utils/cva/cva";
import { classNames } from "@/shared/lib/utils/classNames/classNames";

const textVariants = cva({
  base: styles.text || "",
  variants: {
    variant: {
      [TextVariant.PRIMARY]: styles.primary || "",
      [TextVariant.SECONDARY]: styles.secondary || "",
      [TextVariant.ERROR]: styles.error || "",
      [TextVariant.NAVBAR_MOBILE_LINK]: styles.navbarMobileLink || "",
    },
    align: {
      [TextAlign.LEFT]: styles.left || "",
      [TextAlign.CENTER]: styles.center || "",
      [TextAlign.RIGHT]: styles.right || "",
    },
    size: {
      [TextSize.SM]: styles.sm || "",
      [TextSize.MD]: styles.md || "",
      [TextSize.LG]: styles.lg || "",
      [TextSize.XL]: styles.xl || "",
      [TextSize.XL2]: styles.xl2 || "",
      [TextSize.XL3]: styles.xl3 || "",
      [TextSize.XL4]: styles.xl4 || "",
      [TextSize.XL5]: styles.xl5 || "",
      [TextSize.XL6]: styles.xl6 || "",
      [TextSize.PERCENTAGE]: styles.percentage || "",
    },
    fontWeight: {
      [TextFontWeight.XM]: styles.xmFontWeight || "",
      [TextFontWeight.SM]: styles.smFontWeight || "",
      [TextFontWeight.MD]: styles.mdFontWeight || "",
      [TextFontWeight.LG]: styles.lgFontWeight || "",
      [TextFontWeight.XL]: styles.xlFontWeight || "",
      [TextFontWeight.XL2]: styles.xl2FontWeight || "",
      [TextFontWeight.XL3]: styles.xl3FontWeight || "",
      [TextFontWeight.XL4]: styles.xl4FontWeight || "",
      [TextFontWeight.XL5]: styles.xl5FontWeight || "",
    },
  },
  defaultVariants: {
    variant: TextVariant.PRIMARY,
    align: TextAlign.LEFT,
    size: TextSize.MD,
  },
});

export const Text: React.FC<TextProps> = ({
  as: Component = "p",
  variant = TextVariant.PRIMARY,
  align = TextAlign.LEFT,
  size = TextSize.MD,
  fontWeight = TextFontWeight.MD,
  children,
  className,
  ...props
}) => {
  const classes = classNames(
    textVariants({
      variant,
      align,
      size,
      fontWeight,
    }).join(" "),
    {},
    [className]
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
