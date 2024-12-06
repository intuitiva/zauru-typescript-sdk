"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetReceptionTemplate = void 0;
const react_1 = require("@remix-run/react");
const redux_1 = require("@zauru-sdk/redux");
const react_2 = require("react");
const index_js_1 = require("./index.js");
const useGetTemplateObject = (TEMPLATE_NAME, config = { online: false }) => {
    const fetcher = (0, react_1.useFetcher)();
    const dispatch = (0, redux_1.useAppDispatch)();
    const objectData = (0, redux_1.useAppSelector)((state) => state.templates[TEMPLATE_NAME]);
    const [data, setData] = (0, react_2.useState)({
        data: objectData?.data && Object.keys(objectData?.data).length
            ? objectData?.data
            : {},
        loading: objectData.loading,
    });
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
                setData({ data: receivedData[TEMPLATE_NAME], loading: false });
                dispatch((0, redux_1.templateFetchSuccess)({
                    name: TEMPLATE_NAME,
                    data: receivedData[TEMPLATE_NAME],
                }));
            }
        }
    }, [fetcher, dispatch, TEMPLATE_NAME]);
    (0, react_2.useEffect)(() => {
        if ((objectData?.data && Object.keys(objectData?.data).length <= 0) ||
            config?.online) {
            try {
                setData({ ...data, loading: true });
                dispatch((0, redux_1.templateFetchStart)(TEMPLATE_NAME));
                fetcher.load(`/api/templates?object=${TEMPLATE_NAME}`);
            }
            catch (ex) {
                (0, index_js_1.showAlert)({
                    type: "error",
                    title: `Ocurrió un error al cargar el object de templates: ${TEMPLATE_NAME}.`,
                    description: "Error: " + ex,
                });
            }
        }
    }, []);
    return data;
};
const useGetReceptionTemplate = (config) => useGetTemplateObject("receptionTemplate", config);
exports.useGetReceptionTemplate = useGetReceptionTemplate;
