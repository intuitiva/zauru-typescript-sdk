"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wrapper around `next-themes` with sensible Appocus defaults
 * (class attribute, system default, system enabled, transition disabled).
 * Pass `storageKey` to namespace the saved preference per app.
 */
export function ThemeProvider({
  children,
  storageKey = "appocus-theme",
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={storageKey}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
