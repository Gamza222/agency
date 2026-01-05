import { useEffect, useState } from "react";

/**
 * Hook to wait for navbar to mount before starting animations
 * Checks for data-navbar-mounted attribute on body
 */
export const useNavbarMountCheck = (): boolean => {
  const [navbarMounted, setNavbarMounted] = useState(false);

  useEffect(() => {
    const isNavbarMounted = () =>
      document.body.getAttribute("data-navbar-mounted") === "true";

    if (isNavbarMounted()) {
      setNavbarMounted(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (isNavbarMounted()) {
        setNavbarMounted(true);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-navbar-mounted"],
    });

    return () => observer.disconnect();
  }, []);

  return navbarMounted;
};
