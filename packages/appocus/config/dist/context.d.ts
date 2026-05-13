import * as React from "react";
import type { BaseAppocusConfig } from "./types.js";
export type AppocusConfigProviderProps<T extends BaseAppocusConfig> = {
    value: T;
    children: React.ReactNode;
};
export declare function AppocusConfigProvider<T extends BaseAppocusConfig>({ value, children, }: AppocusConfigProviderProps<T>): import("react/jsx-runtime").JSX.Element;
/**
 * Read the active config. Pass a type parameter (typically the app's extended
 * `AppocusConfig`) to get autocomplete for the additional copy keys.
 */
export declare function useAppocusConfig<T extends BaseAppocusConfig = BaseAppocusConfig>(): T;
