"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import * as React from "react";
import { useTheme } from "next-themes";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const easing =
    "transition-all duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]";

  return (
    <div className={`flex items-center space-x-2 ${easing}`}>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] ${easing} ${
          theme === "dark"
            ? "text-[#A1A1AA] scale-75 rotate-12"
            : "text-foreground scale-100 rotate-0"
        }`}
      />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className={`${easing} hover:scale-110`}
      />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] ${easing} ${
          theme === "light"
            ? "text-[#A1A1AA] scale-75 rotate-12"
            : "text-foreground scale-100 rotate-0"
        }`}
      />
    </div>
  );
}
