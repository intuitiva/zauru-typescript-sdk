"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetAutomaticNumber = void 0;
const react_1 = require("@remix-run/react");
const redux_1 = require("@zauru-sdk/redux");
const react_2 = require("react");
const index_js_1 = require("./index.js");
const useGetAutomaticNumber = (AUTOMATIC_NUMBER_NAME) => {
    const fetcher = (0, react_1.useFetcher)();
    const dispatch = (0, redux_1.useAppDispatch)();
    const objectData = (0, redux_1.useAppSelector)((state) => state.automaticNumbers[AUTOMATIC_NUMBER_NAME]);
    const [data, setData] = (0, react_2.useState)({
        data: Object.keys(objectData?.data).length
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
                setData({ data: receivedData[AUTOMATIC_NUMBER_NAME], loading: false });
                dispatch((0, redux_1.automaticNumberFetchSuccess)({
                    name: AUTOMATIC_NUMBER_NAME,
                    data: receivedData[AUTOMATIC_NUMBER_NAME],
                }));
            }
        }
    }, [fetcher, dispatch, AUTOMATIC_NUMBER_NAME]);
    (0, react_2.useEffect)(() => {
        if (Object.keys(objectData?.data).length <= 0) {
            try {
                setData({ ...data, loading: true });
                dispatch((0, redux_1.automaticNumberFetchStart)(AUTOMATIC_NUMBER_NAME));
                fetcher.load(`/api/automaticNumbers?object=${AUTOMATIC_NUMBER_NAME}`);
            }
            catch (ex) {
                (0, index_js_1.showAlert)({
                    type: "error",
                    title: `Ocurrió un error al cargar el object de automatic numbers: ${AUTOMATIC_NUMBER_NAME}.`,
                    description: "Error: " + ex,
                });
            }
        }
    }, []);
    return data;
};
exports.useGetAutomaticNumber = useGetAutomaticNumber;
