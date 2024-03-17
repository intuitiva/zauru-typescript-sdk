import { Tuple, configureStore } from "@reduxjs/toolkit";
import catalogsReducer from "./slices/catalogs.slice.js";
import profilesReducer from "./slices/profile.slice.js";
import webappTablesReducer from "./slices/webapp-tables.slice.js";
import receptionsReducer from "./slices/reception.slice.js";
import sessionReducer from "./slices/session.slice.js";
import templateReducer from "./slices/templates.slice.js";
import automaticNumberReducer from "./slices/automaticNumbers.slice.js";
import tableReducer from "./slices/tables.slice.js";
import formValidationReducer from "./slices/formValidation.slice.js";
export const LOCAL_STORAGE_REDUX_NAME = "___redux__state__v2";
const persistanceLocalStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    if (!(typeof document === "undefined")) {
        localStorage.setItem(LOCAL_STORAGE_REDUX_NAME, JSON.stringify(store.getState()));
    }
    return result;
};
const preloadedState = (() => {
    try {
        if (!(typeof document === "undefined")) {
            const savedState = localStorage.getItem(LOCAL_STORAGE_REDUX_NAME);
            if (savedState) {
                return JSON.parse(savedState);
            }
        }
    }
    catch (e) {
        // Ignorar los errores, se utiliza el estado inicial definido en cada reducer
    }
})();
export const cleanLocalStorage = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_REDUX_NAME);
    const state = JSON.parse(savedState ?? "{}");
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
        // //delete caché
        // caches.keys().then((names) => {
        //   for (const name of names) {
        //     caches.delete(name);
        //   }
        // });
        //unregister service workers
        // navigator.serviceWorker.getRegistrations().then((registrations) => {
        //   for (const registration of registrations) {
        //     registration.unregister();
        //   }
        // });
        // Limpiar todo el localStorage
        localStorage.clear();
    }
    catch (error) {
        console.error(error);
    }
    try {
        const whitelist = {
            automaticNumbers: ["purchaseOrderIdNumber", "dischargeIdNumber"],
            receptions: ["queueNewReceptions"],
        };
        if (!(typeof document === "undefined") && Object.keys(state)?.length > 0) {
            const initialState = {
                catalogs: catalogsReducer(undefined, { type: "" }),
                profiles: profilesReducer(undefined, { type: "" }),
                webappTables: webappTablesReducer(undefined, { type: "" }),
                receptions: receptionsReducer(undefined, { type: "" }),
                session: sessionReducer(undefined, { type: "" }),
                templates: templateReducer(undefined, { type: "" }),
                automaticNumbers: automaticNumberReducer(undefined, { type: "" }),
                tables: tableReducer(undefined, { type: "" }),
                formValidation: formValidationReducer(undefined, { type: "" }),
            };
            const newState = { ...initialState };
            for (const reducerName in whitelist) {
                if (state.hasOwnProperty(reducerName)) {
                    const key = reducerName;
                    const reducerState = state[key];
                    const whitelistKey = whitelist[key];
                    if (whitelistKey && whitelistKey.length > 0) {
                        newState[key] = newState[key] ? { ...newState[key] } : {};
                        for (const propertyName of whitelistKey) {
                            if (reducerState?.hasOwnProperty(propertyName)) {
                                const propKey = propertyName;
                                if (newState[key] && reducerState) {
                                    newState[key][propKey] = reducerState[propKey];
                                }
                            }
                        }
                    }
                    else if (reducerState) {
                        newState[key] = reducerState;
                    }
                }
            }
            // Guarda el nuevo estado en el almacenamiento local
            localStorage.setItem(LOCAL_STORAGE_REDUX_NAME, JSON.stringify(newState));
        }
    }
    catch (e) {
        console.error("Ocurrió un error al clonar y eliminar el viejo localStorage");
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
        formValidation: formValidationReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => new Tuple(persistanceLocalStorageMiddleware),
});
