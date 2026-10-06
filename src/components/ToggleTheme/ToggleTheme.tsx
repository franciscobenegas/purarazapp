"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useTheme } from "next-themes";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Evita el desajuste de hidratación: reserva el espacio hasta montar.
  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="relative h-9 w-9 rounded-full transition-transform hover:scale-110 hover:bg-accent"
    >
      <Sun
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? "scale-0 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100 text-amber-500"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? "scale-100 rotate-0 opacity-100 text-indigo-300"
            : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </Button>
  );
}
