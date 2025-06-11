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
  const [themeColor, setThemeColor] = useState<ThemeColors>("Negro"); // valor por defecto seguro
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  // Se ejecuta solo en el cliente
  useEffect(() => {
    // Obtener el valor guardado del localStorage después del montaje
    const savedThemeColor =
      (localStorage.getItem("themeColor") as ThemeColors) || "Negro";

    setThemeColor(savedThemeColor);
    setIsMounted(true);
  }, []);

  // Actualizar el theme global cuando cambian los valores
  useEffect(() => {
    if (!isMounted) return;

    localStorage.setItem("themeColor", themeColor);
    setGlobalColorTheme(theme as "light" | "dark", themeColor);
  }, [isMounted, theme, themeColor]);

  // Esperar a que el componente se monte para evitar errores y flickers
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
