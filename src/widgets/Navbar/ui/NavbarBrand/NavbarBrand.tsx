import { memo } from "react";
import WarpLogo from "@/shared/assets/icons/logo-bg-01.svg?react";
import styles from "./NavbarBrand.module.scss";
import { classNames } from "@/shared/lib/utils/classNames/classNames";
// import { Text, TextVariant } from "@/shared/ui/Text"; // Unused - removed

interface NavbarBrandProps {
  brandText?: string;
  isOnLightBackground?: boolean;
}

const NavbarBrand = memo(
  ({
    brandText: _brandText = "THE WARP",
    isOnLightBackground = false,
  }: NavbarBrandProps) => {
    return (
      <a href="#" className={styles.navbar__brand}>
        <WarpLogo
          className={classNames(styles.navbar__logo, {
            [styles.navbar__logo_lightBackground]:
              isOnLightBackground,
          })}
        />
      </a>
    );
  }
);

export default NavbarBrand;
