import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "./providers";
import { MuiProvider } from "./muiThemeProvider";
import { CssBaseline } from "@mui/material";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Gestion de stock",
    template: "%s | Gestock",
  },
  description: "Application de gestion de stock",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
      </head>
      <body className={inter.className}>
        <ModeProvider>
          <MuiProvider>
            <CssBaseline />
            {children}
          </MuiProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
