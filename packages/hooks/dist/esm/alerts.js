"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidateNotifications = void 0;
const react_1 = require("react");
const index_js_1 = require("./index.js");
const useValidateNotifications = (source) => {
    const { actionData, fetcher, loaderData } = source;
    const [alertShown, setAlertShown] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        if (loaderData?.title && !alertShown[loaderData.title]) {
            (0, index_js_1.showAlert)({
                description: loaderData?.description?.toString() ?? "",
                title: loaderData?.title,
                type: loaderData?.type,
            });
            setAlertShown({ ...alertShown, [loaderData.title]: true });
        }
    }, [loaderData, alertShown]);
    (0, react_1.useEffect)(() => {
        if (fetcher?.data?.title &&
            fetcher.state === "idle" &&
            !alertShown[fetcher.data.title]) {
            (0, index_js_1.showAlert)({
                description: fetcher.data?.description,
                title: fetcher.data?.title,
                type: fetcher.data?.type,
            });
            setAlertShown({ ...alertShown, [fetcher.data.title]: true });
        }
    }, [fetcher?.data, fetcher?.state, alertShown]);
    (0, react_1.useEffect)(() => {
        if (actionData?.title && !alertShown[actionData.title]) {
            (0, index_js_1.showAlert)({
                description: actionData?.description ?? "",
                title: actionData?.title,
                type: actionData?.type,
            });
            setAlertShown({ ...alertShown, [actionData.title]: true });
        }
    }, [actionData, alertShown]);
    return null;
};
exports.useValidateNotifications = useValidateNotifications;
