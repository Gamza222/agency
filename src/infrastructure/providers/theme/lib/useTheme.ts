import { useContext } from "react";
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from "./themeContext";

interface UseThemeResult {
  toggleTheme: () => void;
  theme: Theme;
  isDark: boolean;
}

export function useTheme(): UseThemeResult {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme?.(newTheme);
    // Apply theme to html element using data-theme attribute (matches CSS selectors)
    document.documentElement.setAttribute(
      "data-theme",
      newTheme === Theme.LIGHT ? "light" : "dark"
    );
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  };

  return {
    theme: theme || Theme.LIGHT,
    toggleTheme,
    isDark: theme === Theme.DARK,
  };
}
