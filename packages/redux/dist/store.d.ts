import type { TypedUseSelectorHook } from "react-redux";
import { Tuple } from "@reduxjs/toolkit";
export declare const LOCAL_STORAGE_REDUX_NAME = "___redux__state__v2";
export declare const cleanLocalStorage: () => void;
export declare const store: import("@reduxjs/toolkit").EnhancedStore<any, import("redux").UnknownAction, Tuple<[import("redux").StoreEnhancer<{
    dispatch: {};
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
export declare const useAppDispatch: () => AppDispatch;
export type ReduxParamsConfig = {
    online?: boolean;
    wheres?: string[];
    otherParams?: {
        [key: string]: string;
    };
};
