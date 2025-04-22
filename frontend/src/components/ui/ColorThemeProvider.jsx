// ThemeProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ColorThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState("default");

  // Apply the selected theme as a class to the <html> tag dynamically
  useEffect(() => {
    document.documentElement.className = activeTheme;
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  return useContext(ThemeContext);
}
