import { ButtonHTMLAttributes, ReactNode } from "react";

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  DANGER = "danger",
  CLEAR = "clear",
}

export enum ButtonSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string | undefined;
}
