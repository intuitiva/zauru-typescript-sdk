import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
/**
 * Wrapper around `next-themes` with sensible Appocus defaults
 * (class attribute, system default, system enabled, transition disabled).
 * Pass `storageKey` to namespace the saved preference per app.
 */
export declare function ThemeProvider({ children, storageKey, ...props }: React.ComponentProps<typeof NextThemesProvider>): import("react/jsx-runtime").JSX.Element;
