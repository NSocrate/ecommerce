"use client";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import { useTheme } from "next-themes";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const [icon, setIcon] = useState(<LightModeOutlined />);
  useEffect(() => {
    setIcon(
      resolvedTheme === "light" ? <LightModeOutlined /> : <DarkModeOutlined />
    );
  }, [resolvedTheme]);
  return (
    <IconButton
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      {icon}
    </IconButton>
  );
}
