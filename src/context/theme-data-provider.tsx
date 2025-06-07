"use client";
import { ThemeColors, ThemeColorStateParams } from "../types/theme-types";
import setGlobalColorTheme from "../utils/theme-colors";
import { useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams
);

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
  const getSavedThemeColor = () => {
    try {
      return (localStorage.getItem("themeColor") as ThemeColors) || "Negro";
    } catch (error) {
      console.log(error);
    }
  };

  const [themeColor, setThemeColor] = useState<ThemeColors>(
    getSavedThemeColor() as ThemeColors
  );

  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
    setGlobalColorTheme(theme as "light" | "dark", themeColor);

    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted, theme, themeColor]);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
