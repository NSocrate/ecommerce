"use client";

import { Container, useTheme } from "@mui/material";

export default function Main({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Container
      sx={{
        height: "100%",
        overflow: "auto",
        paddingTop: "1rem",
        paddingBottom: "3rem",
        background: theme.palette.grey[50],
      }}
      component={"main"}
    >
      {children}
    </Container>
  );
}
