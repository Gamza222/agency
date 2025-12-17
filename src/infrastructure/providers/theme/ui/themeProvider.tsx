"use client";

import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LOCAL_STORAGE_THEME_KEY,
  Theme,
  ThemeContext,
} from "../lib/themeContext";

const getDefaultTheme = (): Theme => {
  if (typeof window === "undefined") return Theme.LIGHT;
  return (
    (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || Theme.LIGHT
  );
};

interface ThemeProviderProps extends PropsWithChildren {
  initialTheme?: Theme;
}

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children, initialTheme } = props;

  const [theme, setTheme] = useState<Theme>(initialTheme || getDefaultTheme());

  // Apply theme to DOM when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const themeValue = theme === Theme.LIGHT ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", themeValue);
    }
  }, [theme]);

  const defaultProps = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={defaultProps}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
