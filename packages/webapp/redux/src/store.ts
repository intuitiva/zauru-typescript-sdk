import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import type { MiddlewareAPI } from "@reduxjs/toolkit";
import { Tuple, configureStore } from "@reduxjs/toolkit";
import catalogsReducer from "./slices/catalogs.slice.js";
import profilesReducer from "./slices/profile.slice.js";
import webappTablesReducer from "./slices/webapp-tables.slice.js";
import receptionsReducer from "./slices/reception.slice.js";
import sessionReducer from "./slices/session.slice.js";
import templateReducer from "./slices/templates.slice.js";
import automaticNumberReducer from "./slices/automaticNumbers.slice.js";
import tableReducer from "./slices/tables.slice.js";
import formSavedDataReducer from "./slices/formsSavedData.slice.js";
import formValidationReducer from "./slices/formValidation.slice.js";

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
export const LOCAL_STORAGE_REDUX_NAME = "___redux__state__v7.0";

function isQuotaExceededError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "QuotaExceededError") {
    return true;
  }
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "QuotaExceededError"
  );
}

function persistReduxStateToLocalStorage(state: RootState): void {
  if (typeof document === "undefined") {
    return;
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_REDUX_NAME, JSON.stringify(state));
  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.warn(
        "[@zauru-sdk/redux] localStorage quota exceeded; Redux state was not persisted.",
        { key: LOCAL_STORAGE_REDUX_NAME, error },
      );
      return;
    }
    console.error(
      "[@zauru-sdk/redux] Failed to persist Redux state to localStorage.",
      error,
    );
  }
}

const persistanceLocalStorageMiddleware =
  (store: MiddlewareAPI) => (next: (action: any) => any) => (action: any) => {
    const result = next(action);
    persistReduxStateToLocalStorage(store.getState() as RootState);
    return result;
  };

const buildSliceInitialStates = () => ({
  catalogs: catalogsReducer(undefined, { type: "@@INIT" }),
  profiles: profilesReducer(undefined, { type: "@@INIT" }),
  webappTables: webappTablesReducer(undefined, { type: "@@INIT" }),
  receptions: receptionsReducer(undefined, { type: "@@INIT" }),
  session: sessionReducer(undefined, { type: "@@INIT" }),
  templates: templateReducer(undefined, { type: "@@INIT" }),
  automaticNumbers: automaticNumberReducer(undefined, { type: "@@INIT" }),
  tables: tableReducer(undefined, { type: "@@INIT" }),
  formSavedData: formSavedDataReducer(undefined, { type: "@@INIT" }),
  formValidation: formValidationReducer(undefined, { type: "@@INIT" }),
});

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const preloadedState = (() => {
  try {
    if (!(typeof document === "undefined")) {
      const savedState = localStorage.getItem(LOCAL_STORAGE_REDUX_NAME);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Merge each slice's defaults with the persisted state so that catalogs
        // (or other entries) added in newer versions of the app are not missing
        // when the user has an older snapshot in localStorage. Without this
        // merge, `state.catalogs[NEW_CATALOG]` would be undefined and any
        // reducer that mutates it (e.g. catalogsFetchStart) would throw.
        const initialStates = buildSliceInitialStates();
        const merged: Record<string, unknown> = {};
        for (const sliceName of Object.keys(initialStates) as Array<
          keyof ReturnType<typeof buildSliceInitialStates>
        >) {
          const sliceInitial = initialStates[sliceName];
          const persistedSlice = (parsed as Record<string, unknown>)?.[
            sliceName
          ];
          if (isPlainObject(sliceInitial) && isPlainObject(persistedSlice)) {
            merged[sliceName] = { ...sliceInitial, ...persistedSlice };
          } else {
            merged[sliceName] = persistedSlice ?? sliceInitial;
          }
        }
        return merged;
      }
    }
  } catch (e) {
    // Ignorar los errores, se utiliza el estado inicial definido en cada reducer
  }
})();

type Whitelist = {
  [K in keyof RootState]?: string[];
};

export const cleanLocalStorage = (whitelist: Whitelist = {}) => {
  const savedState = localStorage.getItem(LOCAL_STORAGE_REDUX_NAME);
  const state = JSON.parse(savedState ?? "{}") as RootState;
  try {
    //delete all cookies
    // const deleteAllCookies = () => {
    //   const cookies = document.cookie.split(";");
    //   for (const cookie of cookies) {
    //     const eqPos = cookie.indexOf("=");
    //     const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    //     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    //   }
    // };

    // deleteAllCookies();

    //delete caché
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });

    //unregister service workers
    // navigator.serviceWorker.getRegistrations().then((registrations) => {
    //   for (const registration of registrations) {
    //     registration.unregister();
    //   }
    // });

    // Limpiar todo el localStorage
    localStorage.clear();
  } catch (error) {
    console.error(error);
  }

  try {
    if (!(typeof document === "undefined") && Object.keys(state)?.length > 0) {
      const initialState: RootState = buildSliceInitialStates() as RootState;

      const newState: RootState = { ...initialState };

      for (const reducerName in whitelist) {
        if (state.hasOwnProperty(reducerName)) {
          const key = reducerName as keyof RootState;
          const reducerState = state[key];
          const whitelistKey = whitelist[key as any];

          if (whitelistKey && whitelistKey.length > 0) {
            newState[key] = newState[key] ? { ...newState[key] } : ({} as any);

            for (const propertyName of whitelistKey) {
              if (reducerState?.hasOwnProperty(propertyName)) {
                const propKey = propertyName as keyof typeof reducerState;
                if (newState[key] && reducerState) {
                  newState[key][propKey] = reducerState[propKey];
                }
              }
            }
          } else if (reducerState) {
            newState[key] = reducerState as any;
          }
        }
      }

      // Guarda el nuevo estado en el almacenamiento local
      persistReduxStateToLocalStorage(newState);
    }
  } catch (e) {
    if (isQuotaExceededError(e)) {
      console.warn(
        "[@zauru-sdk/redux] localStorage quota exceeded while saving after cleanLocalStorage.",
        { key: LOCAL_STORAGE_REDUX_NAME, error: e },
      );
    } else {
      console.error(
        "Ocurrió un error al clonar y eliminar el viejo localStorage",
        e,
      );
    }
  }
};

export const store = configureStore({
  reducer: {
    catalogs: catalogsReducer,
    profiles: profilesReducer,
    webappTables: webappTablesReducer,
    receptions: receptionsReducer,
    session: sessionReducer,
    templates: templateReducer,
    automaticNumbers: automaticNumberReducer,
    tables: tableReducer,
    formSavedData: formSavedDataReducer,
    formValidation: formValidationReducer,
  } as any,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    new Tuple(persistanceLocalStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type ReduxParamsConfig = {
  online?: boolean;
  /**
   * When true and Redux already has rows for this catalog, the hook returns cached
   * data immediately (loading stays false) and refreshes in the background. A
   * successful fetch replaces Redux and local state; failures keep the cached data.
   */
  staleWhileRevalidate?: boolean;
  wheres?: string[];
  otherParams?: { [key: string]: string };
};

export type FetcherErrorType = {
  title?: string;
  description?: string;
  type?: "error" | "warning" | "info" | "success";
};
