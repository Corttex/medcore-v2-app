"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
export type Palette = "default" | "emerald" | "sapphire" | "amber" | "ruby";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  palette: Palette;
  setPalette: (p: Palette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [palette, setPaletteState] = useState<Palette>("default");

  const applyTheme = (targetTheme: Theme) => {
    setTheme(targetTheme);
    document.documentElement.setAttribute("data-theme", targetTheme);
    if (targetTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const savedTheme = (localStorage.getItem("medcore-theme") as Theme) || "light";
    applyTheme(savedTheme);

    const savedPalette = (localStorage.getItem("medcore-palette") as Palette) || "default";
    setPaletteState(savedPalette);
    document.documentElement.setAttribute("data-palette", savedPalette);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("medcore-theme", newTheme);
    applyTheme(newTheme);
  };

  const setPalette = (newPalette: Palette) => {
    setPaletteState(newPalette);
    localStorage.setItem("medcore-palette", newPalette);
    document.documentElement.setAttribute("data-palette", newPalette);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
