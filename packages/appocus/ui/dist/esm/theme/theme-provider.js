"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider as NextThemesProvider } from "next-themes";
/**
 * Wrapper around `next-themes` with sensible Appocus defaults
 * (class attribute, system default, system enabled, transition disabled).
 * Pass `storageKey` to namespace the saved preference per app.
 */
export function ThemeProvider({ children, storageKey = "appocus-theme", ...props }) {
    return (_jsx(NextThemesProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true, storageKey: storageKey, ...props, children: children }));
}
