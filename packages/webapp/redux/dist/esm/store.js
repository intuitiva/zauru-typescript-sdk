"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppDispatch = exports.useAppSelector = exports.store = exports.cleanLocalStorage = exports.LOCAL_STORAGE_REDUX_NAME = void 0;
const react_redux_1 = require("react-redux");
const toolkit_1 = require("@reduxjs/toolkit");
const catalogs_slice_js_1 = __importDefault(require("./slices/catalogs.slice.js"));
const profile_slice_js_1 = __importDefault(require("./slices/profile.slice.js"));
const webapp_tables_slice_js_1 = __importDefault(require("./slices/webapp-tables.slice.js"));
const reception_slice_js_1 = __importDefault(require("./slices/reception.slice.js"));
const session_slice_js_1 = __importDefault(require("./slices/session.slice.js"));
const templates_slice_js_1 = __importDefault(require("./slices/templates.slice.js"));
const automaticNumbers_slice_js_1 = __importDefault(require("./slices/automaticNumbers.slice.js"));
const tables_slice_js_1 = __importDefault(require("./slices/tables.slice.js"));
const formsSavedData_slice_js_1 = __importDefault(require("./slices/formsSavedData.slice.js"));
const formValidation_slice_js_1 = __importDefault(require("./slices/formValidation.slice.js"));
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
exports.LOCAL_STORAGE_REDUX_NAME = "___redux__state__v7.0";
function isQuotaExceededError(error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
        return true;
    }
    return (typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name === "QuotaExceededError");
}
function persistReduxStateToLocalStorage(state) {
    if (typeof document === "undefined") {
        return;
    }
    try {
        localStorage.setItem(exports.LOCAL_STORAGE_REDUX_NAME, JSON.stringify(state));
    }
    catch (error) {
        if (isQuotaExceededError(error)) {
            console.warn("[@zauru-sdk/redux] localStorage quota exceeded; Redux state was not persisted.", { key: exports.LOCAL_STORAGE_REDUX_NAME, error });
            return;
        }
        console.error("[@zauru-sdk/redux] Failed to persist Redux state to localStorage.", error);
    }
}
const persistanceLocalStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    persistReduxStateToLocalStorage(store.getState());
    return result;
};
const buildSliceInitialStates = () => ({
    catalogs: (0, catalogs_slice_js_1.default)(undefined, { type: "@@INIT" }),
    profiles: (0, profile_slice_js_1.default)(undefined, { type: "@@INIT" }),
    webappTables: (0, webapp_tables_slice_js_1.default)(undefined, { type: "@@INIT" }),
    receptions: (0, reception_slice_js_1.default)(undefined, { type: "@@INIT" }),
    session: (0, session_slice_js_1.default)(undefined, { type: "@@INIT" }),
    templates: (0, templates_slice_js_1.default)(undefined, { type: "@@INIT" }),
    automaticNumbers: (0, automaticNumbers_slice_js_1.default)(undefined, { type: "@@INIT" }),
    tables: (0, tables_slice_js_1.default)(undefined, { type: "@@INIT" }),
    formSavedData: (0, formsSavedData_slice_js_1.default)(undefined, { type: "@@INIT" }),
    formValidation: (0, formValidation_slice_js_1.default)(undefined, { type: "@@INIT" }),
});
const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const preloadedState = (() => {
    try {
        if (!(typeof document === "undefined")) {
            const savedState = localStorage.getItem(exports.LOCAL_STORAGE_REDUX_NAME);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // Merge each slice's defaults with the persisted state so that catalogs
                // (or other entries) added in newer versions of the app are not missing
                // when the user has an older snapshot in localStorage. Without this
                // merge, `state.catalogs[NEW_CATALOG]` would be undefined and any
                // reducer that mutates it (e.g. catalogsFetchStart) would throw.
                const initialStates = buildSliceInitialStates();
                const merged = {};
                for (const sliceName of Object.keys(initialStates)) {
                    const sliceInitial = initialStates[sliceName];
                    const persistedSlice = parsed?.[sliceName];
                    if (isPlainObject(sliceInitial) && isPlainObject(persistedSlice)) {
                        merged[sliceName] = { ...sliceInitial, ...persistedSlice };
                    }
                    else {
                        merged[sliceName] = persistedSlice ?? sliceInitial;
                    }
                }
                return merged;
            }
        }
    }
    catch (e) {
        // Ignorar los errores, se utiliza el estado inicial definido en cada reducer
    }
})();
const cleanLocalStorage = (whitelist = {}) => {
    const savedState = localStorage.getItem(exports.LOCAL_STORAGE_REDUX_NAME);
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
    }
    catch (error) {
        console.error(error);
    }
    try {
        if (!(typeof document === "undefined") && Object.keys(state)?.length > 0) {
            const initialState = buildSliceInitialStates();
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
            persistReduxStateToLocalStorage(newState);
        }
    }
    catch (e) {
        if (isQuotaExceededError(e)) {
            console.warn("[@zauru-sdk/redux] localStorage quota exceeded while saving after cleanLocalStorage.", { key: exports.LOCAL_STORAGE_REDUX_NAME, error: e });
        }
        else {
            console.error("Ocurrió un error al clonar y eliminar el viejo localStorage", e);
        }
    }
};
exports.cleanLocalStorage = cleanLocalStorage;
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        catalogs: catalogs_slice_js_1.default,
        profiles: profile_slice_js_1.default,
        webappTables: webapp_tables_slice_js_1.default,
        receptions: reception_slice_js_1.default,
        session: session_slice_js_1.default,
        templates: templates_slice_js_1.default,
        automaticNumbers: automaticNumbers_slice_js_1.default,
        tables: tables_slice_js_1.default,
        formSavedData: formsSavedData_slice_js_1.default,
        formValidation: formValidation_slice_js_1.default,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => new toolkit_1.Tuple(persistanceLocalStorageMiddleware),
});
exports.useAppSelector = react_redux_1.useSelector;
exports.useAppDispatch = react_redux_1.useDispatch;
