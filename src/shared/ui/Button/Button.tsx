"use client";

import React from "react";
import styles from "./Button.module.scss";
import { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";
import { cva } from "@/shared/lib/utils/cva/cva";
import { classNames } from "@/shared/lib/utils/classNames/classNames";

const buttonVariants = cva({
  base: styles.button || "",
  variants: {
    variant: {
      [ButtonVariant.PRIMARY]: styles.primary || "",
      [ButtonVariant.SECONDARY]: styles.secondary || "",
      [ButtonVariant.DANGER]: styles.danger || "",
    },
    size: {
      [ButtonSize.SM]: styles.sm || "",
      [ButtonSize.MD]: styles.md || "",
      [ButtonSize.LG]: styles.lg || "",
    },
    fullWidth: {
      true: styles.fullWidth || "",
    },
    disabled: {
      true: styles.disabled || "",
    },
    loading: {
      true: styles.loading || "",
    },
  },
  defaultVariants: {
    variant: ButtonVariant.PRIMARY,
    size: ButtonSize.MD,
  },
});

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = ButtonVariant.PRIMARY,
      size = ButtonSize.MD,
      fullWidth = false,
      loading = false,
      disabled = false,
      type = "button",
      children,
      className,
      icon,
      ...restProps
    } = props;

    const buttonClasses = classNames(
      buttonVariants({
        variant,
        size,
        fullWidth,
        disabled: disabled || loading,
        loading,
      }).join(" "),
      {},
      [className]
    );

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        {...restProps}
      >
        {loading && <span className={styles.spinner}></span>}
        {icon && <span className={styles.icon}>{icon}</span>}
        {children && children}
      </button>
    );
  }
);

Button.displayName = "Button";
