"use client";

import React, { useState, useEffect } from "react";
import { useIsMobile } from "../lib/useIsMobile";
import NavbarDesktop from "./NavbarDesktop/NavbarDesktop";
import NavbarMobile from "./NavbarMobile/NavbarMobile";
import type { NavbarProps } from "../types/types";
import { NAVBAR_STYLING } from "../model/types/constants/constants";

const Navbar: React.FC<NavbarProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { disabled = false } = props;

  useEffect(() => {
    setMounted(true);
    document.body.setAttribute("data-navbar-mounted", "true");
  }, []);

  // Server and initial client render: placeholder (prevents hydration mismatch)
  // Same structure, no content - ensures server and client match
  if (!mounted) {
    return (
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: NAVBAR_STYLING.Z_INDEX,
          backgroundColor: "#fff",
          height: "60px",
          background: "transparent",
          pointerEvents: disabled ? "none" : "auto",
        }}
        suppressHydrationWarning
      />
    );
  }

  // After mount: conditional render (removes unused from DOM)
  // Only the correct navbar exists in the DOM
  return isMobile ? <NavbarMobile {...props} /> : <NavbarDesktop {...props} />;
};

export default Navbar;
