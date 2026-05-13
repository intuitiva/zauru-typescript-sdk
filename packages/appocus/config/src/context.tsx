"use client";

import * as React from "react";
import type { BaseAppocusConfig } from "./types.js";

const AppocusConfigContext = React.createContext<BaseAppocusConfig | null>(
  null,
);

export type AppocusConfigProviderProps<T extends BaseAppocusConfig> = {
  value: T;
  children: React.ReactNode;
};

export function AppocusConfigProvider<T extends BaseAppocusConfig>({
  value,
  children,
}: AppocusConfigProviderProps<T>) {
  return (
    <AppocusConfigContext.Provider value={value}>
      {children}
    </AppocusConfigContext.Provider>
  );
}

/**
 * Read the active config. Pass a type parameter (typically the app's extended
 * `AppocusConfig`) to get autocomplete for the additional copy keys.
 */
export function useAppocusConfig<
  T extends BaseAppocusConfig = BaseAppocusConfig,
>(): T {
  const v = React.useContext(AppocusConfigContext);
  if (!v) {
    throw new Error(
      "useAppocusConfig must be used inside <AppocusConfigProvider>.",
    );
  }
  return v as T;
}
