"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type ThemeMode = "LIGHT" | "DARK";
type ColorMode = "AMBER" | "BLUE" | "PINK" | "ROSE" | "EMERALD" | "BLACK";

interface ThemeContextValue {
  themeMode: ThemeMode;
  colorMode: ColorMode;
  setThemeMode: (m: ThemeMode) => void;
  setColorMode: (c: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({
  initialThemeMode,
  initialColorMode,
  children,
}: {
  initialThemeMode: ThemeMode;
  initialColorMode: ColorMode;
  children: React.ReactNode;
}) {
  const [themeMode, setThemeModeState] = useState(initialThemeMode);
  const [colorMode, setColorModeState] = useState(initialColorMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "DARK");
    document.documentElement.setAttribute(
      "data-color",
      colorMode.toLowerCase(),
    );
  }, [themeMode, colorMode]);

  function persist(
    next: Partial<{ themeMode: ThemeMode; colorMode: ColorMode }>,
  ) {
    apiFetch("/users/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(next),
    }).catch(() => {});
  }

  function setThemeMode(m: ThemeMode) {
    setThemeModeState(m);
    persist({ themeMode: m });
  }
  function setColorMode(c: ColorMode) {
    setColorModeState(c);
    persist({ colorMode: c });
  }

  return (
    <ThemeContext.Provider
      value={{ themeMode, colorMode, setThemeMode, setColorMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
