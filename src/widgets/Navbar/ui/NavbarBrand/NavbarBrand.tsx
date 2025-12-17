"use client";

import React, { memo } from "react";
import WarpLogo from "@/shared/assets/icons/logo-bg-01.svg";
import styles from "./NavbarBrand.module.scss";
// import { Text, TextVariant } from "@/shared/ui/Text"; // Unused - removed
import Link from "next/link";

interface NavbarBrandProps {
  brandText?: string;
}

const NavbarBrand = memo(
  ({ brandText: _brandText = "THE WARP" }: NavbarBrandProps) => {
    return (
      <Link href="/" className={styles.navbar__brand}>
        <WarpLogo className={styles.navbar__logo} />
      </Link>
    );
  }
);

export default NavbarBrand;
