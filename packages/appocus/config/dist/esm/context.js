"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
const AppocusConfigContext = React.createContext(null);
export function AppocusConfigProvider({ value, children, }) {
    return (_jsx(AppocusConfigContext.Provider, { value: value, children: children }));
}
/**
 * Read the active config. Pass a type parameter (typically the app's extended
 * `AppocusConfig`) to get autocomplete for the additional copy keys.
 */
export function useAppocusConfig() {
    const v = React.useContext(AppocusConfigContext);
    if (!v) {
        throw new Error("useAppocusConfig must be used inside <AppocusConfigProvider>.");
    }
    return v;
}
