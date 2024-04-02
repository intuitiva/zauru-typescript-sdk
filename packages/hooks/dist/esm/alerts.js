"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidateNotifications = void 0;
const react_1 = require("react");
const index_js_1 = require("./index.js");
const useValidateNotifications = (source) => {
    const { actionData, fetcher, loaderData } = source;
    (0, react_1.useEffect)(() => {
        if (loaderData?.title) {
            (0, index_js_1.showAlert)({
                description: loaderData?.description?.toString() ?? "",
                title: loaderData?.title,
                type: loaderData?.type,
            });
        }
    }, [loaderData]);
    (0, react_1.useEffect)(() => {
        if (fetcher?.data?.title) {
            (0, index_js_1.showAlert)({
                description: fetcher.data?.description,
                title: fetcher.data?.title,
                type: fetcher.data?.type,
            });
        }
    }, [fetcher?.data]);
    (0, react_1.useEffect)(() => {
        if (actionData?.title) {
            (0, index_js_1.showAlert)({
                description: actionData?.description ?? "",
                title: actionData?.title,
                type: actionData?.type,
            });
        }
    }, [actionData]);
    return null;
};
exports.useValidateNotifications = useValidateNotifications;
