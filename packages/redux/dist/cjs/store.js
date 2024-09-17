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
const formValidation_slice_js_1 = __importDefault(require("./slices/formValidation.slice.js"));
exports.LOCAL_STORAGE_REDUX_NAME = "___redux__state__v3.1.1";
const persistanceLocalStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    if (!(typeof document === "undefined")) {
        localStorage.setItem(exports.LOCAL_STORAGE_REDUX_NAME, JSON.stringify(store.getState()));
    }
    return result;
};
const preloadedState = (() => {
    try {
        if (!(typeof document === "undefined")) {
            const savedState = localStorage.getItem(exports.LOCAL_STORAGE_REDUX_NAME);
            if (savedState) {
                return JSON.parse(savedState);
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
        if (!(typeof document === "undefined") && Object.keys(state)?.length > 0) {
            const initialState = {
                catalogs: (0, catalogs_slice_js_1.default)(undefined, { type: "" }),
                profiles: (0, profile_slice_js_1.default)(undefined, { type: "" }),
                webappTables: (0, webapp_tables_slice_js_1.default)(undefined, { type: "" }),
                receptions: (0, reception_slice_js_1.default)(undefined, { type: "" }),
                session: (0, session_slice_js_1.default)(undefined, { type: "" }),
                templates: (0, templates_slice_js_1.default)(undefined, { type: "" }),
                automaticNumbers: (0, automaticNumbers_slice_js_1.default)(undefined, { type: "" }),
                tables: (0, tables_slice_js_1.default)(undefined, { type: "" }),
                formValidation: (0, formValidation_slice_js_1.default)(undefined, { type: "" }),
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
            localStorage.setItem(exports.LOCAL_STORAGE_REDUX_NAME, JSON.stringify(newState));
        }
    }
    catch (e) {
        console.error("Ocurrió un error al clonar y eliminar el viejo localStorage");
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
        formValidation: formValidation_slice_js_1.default,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => new toolkit_1.Tuple(persistanceLocalStorageMiddleware),
});
exports.useAppSelector = react_redux_1.useSelector;
exports.useAppDispatch = react_redux_1.useDispatch;
