"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

/** Sonner `<Toaster>` that mirrors the active `next-themes` theme. */
export function ThemedToaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={
        theme === "dark" || theme === "light" || theme === "system"
          ? theme
          : "system"
      }
    />
  );
}
