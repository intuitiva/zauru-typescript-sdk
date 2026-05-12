import type { TypedUseSelectorHook } from "react-redux";
import { Tuple } from "@reduxjs/toolkit";
/**
 * Full Redux snapshot key in `localStorage`. Written by
 * `persistanceLocalStorageMiddleware` after every action.
 *
 * **QuotaExceededError:** Browsers cap `localStorage` per origin (often ~5MiB,
 * not standardized). `setItem` throws `QuotaExceededError` when the new value
 * plus existing data for that origin exceeds the cap.
 *
 * **Why only some tenants/devices:** Serialized state grows with cached
 * catalogs (items, invoices, forms, etc.). Heavy tenants hit the limit sooner;
 * private mode, Safari, or nearly full disks can lower the effective cap. Other
 * apps on the same origin share the same quota.
 */
export declare const LOCAL_STORAGE_REDUX_NAME = "___redux__state__v6.0";
type Whitelist = {
    [K in keyof RootState]?: string[];
};
export declare const cleanLocalStorage: (whitelist?: Whitelist) => void;
export declare const store: import("@reduxjs/toolkit").EnhancedStore<any, import("redux").UnknownAction, Tuple<[import("redux").StoreEnhancer<{
    dispatch: {};
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
export declare const useAppDispatch: () => AppDispatch;
export type ReduxParamsConfig = {
    online?: boolean;
    /**
     * When true and Redux already has rows for this catalog, the hook returns cached
     * data immediately (loading stays false) and refreshes in the background. A
     * successful fetch replaces Redux and local state; failures keep the cached data.
     */
    staleWhileRevalidate?: boolean;
    wheres?: string[];
    otherParams?: {
        [key: string]: string;
    };
};
export type FetcherErrorType = {
    title?: string;
    description?: string;
    type?: "error" | "warning" | "info" | "success";
};
export {};
