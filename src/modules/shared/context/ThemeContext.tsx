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
  const [theme, setTheme] = useState<Theme>("dark");
  const [palette, setPaletteState] = useState<Palette>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("medcore-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const savedPalette = localStorage.getItem("medcore-palette") as Palette;
    if (savedPalette) {
      setPaletteState(savedPalette);
      document.documentElement.setAttribute("data-palette", savedPalette);
    } else {
      document.documentElement.setAttribute("data-palette", "default");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("medcore-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
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
