"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import type { NavbarProps } from "../types/types";

/**
 * Client wrapper for Navbar that reads animation state from body data attribute
 * This allows the page component to control navbar disabled state
 */
const NavbarWrapper: React.FC<Omit<NavbarProps, "disabled">> = (props) => {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    // Check initial state
    const checkState = () => {
      const animationsComplete =
        document.body.getAttribute("data-animations-complete") === "true";
      setDisabled(!animationsComplete);
    };

    checkState();

    // Watch for changes to the data attribute
    const observer = new MutationObserver(checkState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-animations-complete"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <Navbar {...props} disabled={disabled} />;
};

export default NavbarWrapper;
