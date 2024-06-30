"use client";
import { ThemeProvider } from "@mui/material";
import { themeDark, themeLight } from "./theme";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function MuiProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(themeLight);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    resolvedTheme === "light"
      ? setCurrentTheme(themeLight)
      : setCurrentTheme(themeDark);
  }, [resolvedTheme]);
  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
}
