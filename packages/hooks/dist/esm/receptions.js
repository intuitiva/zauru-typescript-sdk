"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetItemByPurchaseOrder = exports.useGetItemNameByPurchaseOrder = exports.useGetProviderNameByPurchaseOrder = exports.getBasketDetailsByForm = exports.useGetBasketDetails = exports.getPesadasByForm = exports.useGetPesadas = exports.useGetPurchaseOrderGeneralInfo = exports.useGetNewPurchaseOrderInfo = exports.useGetRejectionInfo = exports.useGetBasketLots = exports.useGetPOReceptions = exports.useGetProcesses = void 0;
const react_1 = require("@remix-run/react");
const redux_1 = require("@zauru-sdk/redux");
const react_2 = require("react");
const index_js_1 = require("./index.js");
const common_1 = require("@zauru-sdk/common");
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
const useGetPesadas = (purchaseOrder, stocks_only_integer = false) => {
    const [pesadas, footerPesadas, headersPesadas] = (0, react_2.useMemo)(() => {
        if (!purchaseOrder)
            return [[], [], []];
        const tempPesadas = [
            ...purchaseOrder.purchase_order_details?.map((x, index) => {
                const parsedReference = x.reference?.split(","); //eg: "reference": "698,25,0", // peso neto, canastas, descuento
                const totalWeight = parsedReference[0]
                    ? Number(parsedReference[0]) ?? 0
                    : 0;
                const baskets = parsedReference[1]
                    ? Number(parsedReference[1]) ?? 0
                    : 0;
                const discount = parsedReference[2]
                    ? isNaN(Number(parsedReference[2]))
                        ? 0
                        : Number(parsedReference[2])
                    : 0;
                //TODO sacar el peso de la canasta de la API de Zauru, ahorita se supone que no debería cambiar de 5 libras.
                const basketWeight = 5;
                let netWeight = totalWeight - baskets * basketWeight; //Se le resta el peso de las canastas
                netWeight = netWeight * ((100 - discount) / 100); //Se le aplica el descuento
                if (stocks_only_integer)
                    netWeight = totalWeight; //si es en unidades no divido el peso entre las canastas
                const weightByBasket = netWeight / baskets;
                //Probable aprovechamiento en planta
                const probableUtilization = netWeight * ((100 - purchaseOrder?.discount) / 100);
                //libras o unidades descontadas
                const lbDiscounted = netWeight - probableUtilization;
                return {
                    id: index + 1,
                    baskets,
                    totalWeight,
                    discount,
                    netWeight: (0, common_1.toFixedIfNeeded)(netWeight)?.toString(),
                    weightByBasket: (0, common_1.toFixedIfNeeded)(weightByBasket)?.toString(),
                    probableUtilization: (0, common_1.toFixedIfNeeded)(probableUtilization)?.toString(),
                    lbDiscounted: (0, common_1.toFixedIfNeeded)(lbDiscounted)?.toString(),
                };
            }),
        ];
        const totales = [
            //#
            {
                content: "",
                name: "id",
            },
            //baskets
            {
                content: (0, common_1.toFixedIfNeeded)(tempPesadas?.map((x) => x.baskets).reduce(common_1.reduceAdd, 0))?.toString(),
                name: "baskets",
            },
            //totalWeight
            {
                content: (0, common_1.toFixedIfNeeded)(tempPesadas?.map((x) => x.totalWeight).reduce(common_1.reduceAdd, 0))?.toString(),
                name: "totalWeight",
            },
            //discount
            {
                content: "-",
                name: "discount",
            },
            //netWeight
            {
                content: (0, common_1.toFixedIfNeeded)(tempPesadas?.map((x) => Number(x.netWeight)).reduce(common_1.reduceAdd, 0))?.toString(),
                name: "netWeight",
            },
            //weightByBasket
            {
                content: "-",
                name: "weightByBasket",
            },
            //lbDiscounted
            {
                content: (0, common_1.toFixedIfNeeded)(tempPesadas?.map((x) => Number(x.lbDiscounted)).reduce(common_1.reduceAdd, 0))?.toString(),
                name: "lbDiscounted",
            },
            //probableUtilization
            {
                content: (0, common_1.toFixedIfNeeded)(tempPesadas
                    ?.map((x) => Number(x.probableUtilization))
                    .reduce(common_1.reduceAdd, 0)),
                name: "probableUtilization",
            },
        ];
        const headers = [
            { label: "#", name: "id", type: "label", width: 5 },
            { label: "Canastas", name: "baskets", type: "label" },
            {
                label: `${stocks_only_integer ? "Unidades" : "Peso báscula"}`,
                name: "totalWeight",
                type: "label",
            },
            { label: "Descuento (%)", name: "discount", type: "label" },
            {
                label: `${stocks_only_integer ? "Unidades" : "Peso Neto"}`,
                name: "netWeight",
                type: "label",
            },
            {
                label: `${stocks_only_integer ? "Unidades" : "Peso Neto"} - %Rechazo`,
                name: "probableUtilization",
                type: "label",
            },
            {
                label: `${stocks_only_integer ? "Unidades" : "Libras"} descontadas`,
                name: "lbDiscounted",
                type: "label",
            },
            {
                label: `${stocks_only_integer ? "Unidades" : "Peso Neto"} por canasta`,
                name: "weightByBasket",
                type: "label",
            },
        ];
        return [tempPesadas, totales, headers];
    }, [purchaseOrder]);
    return [pesadas, footerPesadas, headersPesadas];
};
exports.useGetPesadas = useGetPesadas;
/**
 * Sirve para imprimir offline
 * @param formInput
 * @returns
 */
const getPesadasByForm = (formInput, stocks_only_integer = false) => {
    // Inicializar array de pesadas
    const tempPesadas = [];
    // Iterar sobre los campos del formulario y extraer la información de pesadas
    let index = 0;
    while (formInput.hasOwnProperty(`basket${index}`)) {
        const baskets = isNaN(Number(formInput[`basket${index}`]))
            ? 0
            : Number(formInput[`basket${index}`]);
        const totalWeight = isNaN(Number(formInput[`weight${index}`]))
            ? 0
            : Number(formInput[`weight${index}`]);
        const discount = isNaN(Number(formInput[`discount${index}`]))
            ? 0
            : Number(formInput[`discount${index}`]);
        // Realizar los cálculos necesarios
        const basketWeight = 5;
        let netWeight = totalWeight - baskets * basketWeight;
        netWeight = netWeight * ((100 - discount) / 100);
        netWeight = stocks_only_integer ? totalWeight : netWeight;
        const weightByBasket = netWeight / baskets;
        //Probable aprovechamiento en planta
        const probableUtilization = netWeight * ((100 - (Number(formInput.porcentajeRechazo) ?? 0)) / 100);
        //libras o unidades descontadas
        const lbDiscounted = netWeight - probableUtilization;
        // Añadir al array de pesadas
        tempPesadas.push({
            id: index + 1,
            baskets,
            totalWeight,
            discount,
            netWeight: (0, common_1.toFixedIfNeeded)(netWeight)?.toString(),
            weightByBasket: (0, common_1.toFixedIfNeeded)(weightByBasket)?.toString(),
            probableUtilization: (0, common_1.toFixedIfNeeded)(probableUtilization)?.toString(),
            lbDiscounted: (0, common_1.toFixedIfNeeded)(lbDiscounted)?.toString(),
        });
        index++;
    }
    const totales = [
        //#
        {
            content: "",
            name: "id",
        },
        //baskets
        {
            content: (0, common_1.toFixedIfNeeded)(tempPesadas?.map((x) => x.baskets).reduce(common_1.reduceAdd, 0))?.toString(),
            name: "baskets",
        },
        //totalWeight
        {
            content: (0, common_1.toFixedIfNeeded)(tempPesadas?.map((x) => x.totalWeight).reduce(common_1.reduceAdd, 0))?.toString(),
            name: "totalWeight",
        },
        //netWeight
        {
            content: (0, common_1.toFixedIfNeeded)(tempPesadas?.map((x) => Number(x.netWeight)).reduce(common_1.reduceAdd, 0))?.toString(),
            name: "netWeight",
        },
        //weightByBasket
        {
            content: "-",
            name: "weightByBasket",
        },
    ];
    const headers = [
        { label: "#", name: "id", type: "label", width: 5 },
        { label: "Canastas", name: "baskets", type: "label" },
        {
            label: `${stocks_only_integer ? "Unidades" : "Peso báscula"}`,
            name: "totalWeight",
            type: "label",
        },
        {
            label: `${stocks_only_integer ? "Unidades" : "Peso Neto"}`,
            name: "netWeight",
            type: "label",
        },
        {
            label: `${stocks_only_integer ? "Unidades" : "Peso Neto"} por canasta`,
            name: "weightByBasket",
            type: "label",
        },
    ];
    return { tempPesadas, totales, headers };
};
exports.getPesadasByForm = getPesadasByForm;
const useGetBasketDetails = (purchaseOrder) => {
    const [basketsJoined, footerBasketsJoined, headersBasketsJoined] = (0, react_2.useMemo)(() => {
        if (!purchaseOrder)
            return [[], [], []];
        const bsq = purchaseOrder?.lots.length > 0
            ? purchaseOrder?.lots
                ?.map((x) => {
                const basket = (0, common_1.getBasketsSchema)(x.description);
                return basket;
            })
                .flat(2)
            : //------- INTENTO IMPRIMIR EL TOTAL DE CANASTAS DEL PURCHASE ORDER DETAILS, PORQUE DEPLANO HUBO UN ERROR EN LA CREACION DE LOS LOTES Y POR ESO VIENE VACIO
                //ESTO SOLO ES UNA CONTINGENCIA PARA QUE POR LO MENOS PUEDAN IMPRIMIR EL NUMERO DE CANASTAS, PERO NO LES ESTARÁ MOSTRANDO EL COLOR
                //--- TODO
                purchaseOrder?.purchase_order_details.length > 0
                    ? purchaseOrder?.purchase_order_details
                        ?.map((x) => {
                        return {
                            id: 0,
                            color: "-",
                            total: Number(x.reference.split(",")[1]) ?? 0,
                        };
                    })
                        .flat(2)
                    : [];
        const bsqToCC = (0, common_1.getBasketsSchema)(purchaseOrder.memo);
        const joinedBaskets = [];
        for (let i = 0; i < bsq.length; i++) {
            let found = joinedBaskets.find((item) => item.color === bsq[i].color);
            let foundCC = bsqToCC.find((item) => item.color === bsq[i].color);
            if (found) {
                found.total += bsq[i].total;
            }
            else {
                joinedBaskets.push({
                    id: i,
                    total: bsq[i].total - (foundCC ? foundCC.total : 0),
                    //granTotal: bsq[i].total,
                    color: bsq[i].color,
                    cc: foundCC ? foundCC.total : 0,
                });
            }
        }
        const totales = [
            //color
            {
                content: "",
                name: "color",
            },
            //total
            {
                content: (0, common_1.toFixedIfNeeded)(joinedBaskets?.map((x) => x.total).reduce(common_1.reduceAdd, 0))?.toString(),
                name: "total",
            },
            //cc
            {
                content: joinedBaskets?.map((x) => x.cc).reduce(common_1.reduceAdd, 0),
                name: "cc",
            },
        ];
        const headers = [
            { label: "Color", name: "color", type: "label" },
            { label: "Canastas recibidas", name: "total", type: "label" },
            { label: "Enviadas a CC", name: "cc", type: "label" },
            //{ label: "Total", name: "granTotal", type: "label" },
        ];
        return [joinedBaskets, totales, headers];
    }, [purchaseOrder]);
    return [basketsJoined, footerBasketsJoined, headersBasketsJoined];
};
exports.useGetBasketDetails = useGetBasketDetails;
/**
 * Para imprimir en modo offline
 * @param formInput
 * @returns
 */
const getBasketDetailsByForm = (formInput) => {
    const basketDetailsArray = [];
    if (!formInput)
        return {
            basketDetailsArray,
            totales: [],
            headers: [],
        };
    // Regex para identificar los campos relevantes
    const recPattern = /^rec\d+-(.+)$/;
    const qCPattern = /^qC\d+-(.+)$/;
    for (const key in formInput) {
        if (formInput.hasOwnProperty(key)) {
            let match;
            // Comprobar si la clave es un campo "rec" y extraer el color y la cantidad
            if ((match = recPattern.exec(key))) {
                const color = match[1];
                const total = isNaN(Number(formInput[key]))
                    ? 0
                    : Number(formInput[key]);
                const existingBasket = basketDetailsArray.find((item) => item.color === color);
                if (existingBasket) {
                    existingBasket.total += total;
                }
                else {
                    if (total > 0) {
                        basketDetailsArray.push({
                            id: basketDetailsArray.length,
                            total,
                            color,
                            cc: 0, // Inicializar cc a 0, se actualizará más adelante si existe
                        });
                    }
                }
            }
            // Comprobar si la clave es un campo "qC" y actualizar el campo cc correspondiente
            if ((match = qCPattern.exec(key))) {
                const color = match[1];
                const cc = isNaN(Number(formInput[key])) ? 0 : Number(formInput[key]);
                const existingBasket = basketDetailsArray.find((item) => item.color === color);
                if (existingBasket) {
                    existingBasket.cc += cc;
                }
            }
        }
    }
    const totales = [
        //color
        {
            content: "",
            name: "color",
        },
        //total
        {
            content: (0, common_1.toFixedIfNeeded)(basketDetailsArray.map((x) => x.total).reduce(common_1.reduceAdd, 0))?.toString(),
            name: "total",
        },
        //cc
        {
            content: basketDetailsArray.map((x) => x.cc).reduce(common_1.reduceAdd, 0),
            name: "cc",
        },
    ];
    // Definir los encabezados de la tabla
    const headers = [
        { label: "Color", name: "color", type: "label" },
        { label: "Canastas recibidas", name: "total", type: "label" },
        { label: "Enviadas a CC", name: "cc", type: "label" },
    ];
    return { basketDetailsArray, totales, headers };
};
exports.getBasketDetailsByForm = getBasketDetailsByForm;
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
