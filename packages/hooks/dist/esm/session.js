"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetSessionAttribute = void 0;
const react_1 = require("@remix-run/react");
const redux_1 = require("@zauru-sdk/redux");
const react_2 = require("react");
const index_js_1 = require("./index.js");
/**
 *
 * @param attribute
 * @returns
 */
const useGetSessionAttribute = (name, type) => {
    const fetcher = (0, react_1.useFetcher)();
    const dispatch = (0, redux_1.useAppDispatch)();
    const sessionData = (0, redux_1.useAppSelector)((state) => state.session[name]);
    const [data, setData] = (0, react_2.useState)(sessionData);
    (0, react_2.useEffect)(() => {
        if (fetcher.data?.title) {
            (0, index_js_1.showAlert)({
                description: fetcher.data?.description,
                title: fetcher.data?.title,
                type: fetcher.data?.type,
            });
        }
    }, [fetcher.data]);
    (0, react_2.useEffect)(() => {
        if (fetcher.state === "idle" && fetcher.data != null) {
            const receivedData = fetcher.data;
            if (receivedData) {
                setData(receivedData.data);
                dispatch((0, redux_1.setSessionValue)({
                    name: name,
                    data: receivedData.data,
                }));
            }
        }
    }, [fetcher, dispatch, name]);
    (0, react_2.useEffect)(() => {
        if (!sessionData) {
            try {
                fetcher.load(`/api/session?name=${name}&type=${type}`);
            }
            catch (ex) {
                (0, index_js_1.showAlert)({
                    type: "error",
                    title: `Ocurrió un error al cargar la variable de configuración: ${name}.`,
                    description: "Error: " + ex,
                });
            }
        }
    }, []);
    return data;
};
exports.useGetSessionAttribute = useGetSessionAttribute;
