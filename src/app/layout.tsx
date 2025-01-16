import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "./providers";
import { MuiProvider } from "./muiThemeProvider";
import { CssBaseline } from "@mui/material";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "E-Commerce",
    template: "%s | E-Commerce",
  },
  description: "Application d'e-commerce test ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" type="image/ico" sizes="32x32" />
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
