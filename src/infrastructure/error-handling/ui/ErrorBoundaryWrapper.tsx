"use client";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import type { ErrorBoundaryProps } from "../types/types";

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryProps> = (props) => {
  return <ErrorBoundary {...props} />;
};
