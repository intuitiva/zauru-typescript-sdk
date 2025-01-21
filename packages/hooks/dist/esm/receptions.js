"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetItemByPurchaseOrder = exports.useGetItemNameByPurchaseOrder = exports.useGetProviderNameByPurchaseOrder = exports.useGetPurchaseOrderGeneralInfo = exports.useGetNewPurchaseOrderInfo = exports.useGetRejectionInfo = exports.useGetBasketLots = exports.useGetPOReceptions = exports.useGetProcesses = void 0;
const react_1 = require("@remix-run/react");
const redux_1 = require("@zauru-sdk/redux");
const react_2 = require("react");
const index_js_1 = require("./index.js");
const useGetReceptionObject = (RECEPTION_NAME, { online = false, wheres = [] } = {}) => {
    try {
        const fetcher = (0, react_1.useFetcher)();
        const dispatch = (0, redux_1.useAppDispatch)();
        const objectData = (0, redux_1.useAppSelector)((state) => state.receptions[RECEPTION_NAME]);
        const [data, setData] = (0, react_2.useState)({
            data: Array.isArray(objectData?.data)
                ? objectData?.data.length
                    ? objectData?.data
                    : []
                : Object.keys(objectData?.data || {}).length
                    ? objectData?.data
                    : {},
            loading: objectData.loading,
        });
        (0, react_2.useEffect)(() => {
            if (fetcher.data?.title) {
                (0, index_js_1.showAlert)({
                    description: fetcher.data?.description?.toString(),
                    title: fetcher.data?.title?.toString(),
                    type: fetcher.data?.type?.toString(),
                });
            }
        }, [fetcher.data]);
        (0, react_2.useEffect)(() => {
            if (fetcher.state === "idle" && fetcher.data != null) {
                const receivedData = fetcher.data;
                if (receivedData) {
                    setData({ data: receivedData[RECEPTION_NAME], loading: false });
                    dispatch((0, redux_1.receptionFetchSuccess)({
                        name: RECEPTION_NAME,
                        data: receivedData[RECEPTION_NAME],
                    }));
                }
            }
        }, [fetcher, dispatch, RECEPTION_NAME]);
        (0, react_2.useEffect)(() => {
            const isEmptyData = (objectData?.data &&
                Array.isArray(objectData?.data) &&
                objectData?.data.length <= 0) ||
                (objectData?.data && Object.keys(objectData?.data).length <= 0);
            if (isEmptyData || objectData.reFetch || online) {
                try {
                    setData({ ...data, loading: true });
                    dispatch((0, redux_1.receptionFetchStart)(RECEPTION_NAME));
                    // Convierte cada elemento del array a una cadena codificada para URL
                    const encodedWheres = wheres.map((where) => encodeURIComponent(where));
                    // Une los elementos codificados con '&'
                    const wheresQueryParam = encodedWheres.join("&");
                    fetcher.load(`/api/receptions?object=${RECEPTION_NAME}&wheres=${wheresQueryParam}`);
                }
                catch (ex) {
                    (0, index_js_1.showAlert)({
                        type: "error",
                        title: `Ocurrió un error al cargar el object de receptions: ${RECEPTION_NAME}.`,
                        description: "Error: " + ex,
                    });
                }
            }
        }, []);
        return data;
    }
    catch (ex) {
        (0, index_js_1.showAlert)({
            type: "error",
            title: `Ocurrió un error al cargar el object de receptions: ${RECEPTION_NAME}.`,
            description: "Error: " + ex,
        });
        return { data: {}, loading: false };
    }
};
const useGetProcesses = (config) => useGetReceptionObject("queueReceptions", config);
exports.useGetProcesses = useGetProcesses;
const useGetPOReceptions = (config) => useGetReceptionObject("poReceptions", config);
exports.useGetPOReceptions = useGetPOReceptions;
const useGetBasketLots = () => useGetReceptionObject("basketLots");
exports.useGetBasketLots = useGetBasketLots;
const useGetRejectionInfo = () => useGetReceptionObject("rejectionInfo");
exports.useGetRejectionInfo = useGetRejectionInfo;
const useGetNewPurchaseOrderInfo = () => useGetReceptionObject("newPurchaseOrderInfo");
exports.useGetNewPurchaseOrderInfo = useGetNewPurchaseOrderInfo;
const useGetPurchaseOrderGeneralInfo = () => useGetReceptionObject("purchaseOrderGeneralInfo");
exports.useGetPurchaseOrderGeneralInfo = useGetPurchaseOrderGeneralInfo;
const useGetProviderNameByPurchaseOrder = (payees, purchaseOrder) => {
    const providerName = (0, react_2.useMemo)(() => {
        if (!purchaseOrder)
            return null;
        const provider = payees.find((x) => x.id == purchaseOrder.payee_id);
        if (provider) {
            return `<${provider.id_number}> ${provider.tin ? `${provider.tin} | ` : ""}${provider.name}`;
        }
        return null;
    }, [payees, purchaseOrder]);
    return providerName;
};
exports.useGetProviderNameByPurchaseOrder = useGetProviderNameByPurchaseOrder;
const useGetItemNameByPurchaseOrder = (items, purchaseOrder) => {
    const itemName = (0, react_2.useMemo)(() => {
        if (!purchaseOrder)
            return null;
        if (purchaseOrder.purchase_order_details.length > 0 && items.length > 0) {
            const item = items.find((x) => x.id == purchaseOrder.purchase_order_details[0].item_id);
            return `${item?.id} - ${item?.code} - ${item?.name}`;
        }
        return null;
    }, [items, purchaseOrder]);
    return itemName;
};
exports.useGetItemNameByPurchaseOrder = useGetItemNameByPurchaseOrder;
const useGetItemByPurchaseOrder = (items, purchaseOrder) => {
    const item = (0, react_2.useMemo)(() => {
        if (!purchaseOrder)
            return null;
        if (purchaseOrder.purchase_order_details.length > 0 && items.length > 0) {
            const item = items.find((x) => x.id == purchaseOrder.purchase_order_details[0].item_id);
            return item;
        }
        return null;
    }, [items, purchaseOrder]);
    return item;
};
exports.useGetItemByPurchaseOrder = useGetItemByPurchaseOrder;
