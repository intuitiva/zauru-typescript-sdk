"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inactivarLote = exports.getLotesProcesados = exports.getLotesWithPurchaseFormated = exports.getLotesFiltered = exports.getLotesExportJSON = exports.updateLote = exports.getMyAgencyLotStocks = exports.getLoteByName = exports.getLote = exports.liberarLote = exports.retenerLote = exports.getBasketsLots = void 0;
const common_1 = require("@zauru-sdk/common");
const moment_1 = __importDefault(require("moment"));
const common_js_1 = require("../common.js");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
const zauru_lote_record_js_1 = require("./zauru-lote-record.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const zauru_deliveries_js_1 = require("./zauru-deliveries.js");
/**
 * getBasketsLots
 * @param headers
 * @param session
 * @returns
 */
const getBasketsLots = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_basket_item_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["recepciones_basket_item_id"]);
        const basketLotsResponse = await httpZauru_js_1.default.get(`/inventories/lots/${recepciones_basket_item_id}/item`, { headers });
        const poBasket = {};
        basketLotsResponse?.data?.lots.map((basket) => (poBasket[basket.name] = {
            lot_id: basket.id,
            rBaskets: 0,
            qcBaskets: 0,
        }));
        return {
            ...basketLotsResponse.data,
            recepciones_basket_item_id: Number(recepciones_basket_item_id),
            poBasket,
        };
    });
};
exports.getBasketsLots = getBasketsLots;
//LIBERAR/RETENER LOTES
/**
 *
 * @param headers
 * @param lot_id
 * @param lot_name
 * @returns
 */
const retenerLote = async (headers, session, lot_id, lot_name) => {
    await httpZauru_js_1.default.patch(`/inventories/lots/${lot_id}.json`, { lot: { name: `${lot_name}-RETENIDO` } }, { headers });
    return await (0, zauru_lote_record_js_1.createLoteRecord)(headers, session, {
        agency_id: session.get("agency_id"),
        created_at: (0, moment_1.default)().toISOString(),
        employee_id: session.get("employee_id"),
        employee_name: session.get("name"),
        lote_id: lot_id,
        lote_name: lot_name,
        retenido: 1,
    });
};
exports.retenerLote = retenerLote;
/**
 *
 * @param headers
 * @param lot_id
 * @param lot_name
 * @returns
 */
const liberarLote = async (headers, session, lot_id, lot_name) => {
    await httpZauru_js_1.default.patch(`/inventories/lots/${lot_id}.json`, { lot: { name: `${lot_name.split("-")[0]}` } }, { headers });
    return await (0, zauru_lote_record_js_1.createLoteRecord)(headers, session, {
        agency_id: session.get("agency_id"),
        created_at: (0, moment_1.default)().toISOString(),
        employee_id: session.get("employee_id"),
        employee_name: session.get("name"),
        lote_id: lot_id,
        lote_name: lot_name,
        retenido: 0,
    });
};
exports.liberarLote = liberarLote;
/**
 * getLote Function for get all details of the current lote
 * @param headers
 * @param agency_id
 * @returns
 */
async function getLote(headers, lot_id, agency_id) {
    const response = await httpZauru_js_1.default.get(`/inventories/lots/${lot_id}.json`, {
        headers,
    });
    //Paso de 23-1234-VERDE, 34-34242-AZUL => a un objeto completo de canastas
    const baskets = (0, common_1.getBasketsSchema)(response.data.description);
    response.data.description_baskets = baskets;
    //Calculo el total de canastas, la suma de todas
    response.data.baskets_quantity = baskets
        .map((x) => x.total)
        .reduce(common_1.reduceAdd, 0);
    if (agency_id) {
        //Saco el available actual
        response.data.stock_actual = response.data.stocks[agency_id];
        //El available by basket
        response.data.availableByBaskets =
            Number(response.data.stock_actual.available) /
                response.data.baskets_quantity;
    }
    return response.data;
}
exports.getLote = getLote;
/**
 * getLoteByName
 * @param headers
 * @param lot_name
 * @returns
 */
async function getLoteByName(session, lot_name) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getLotsByNameStringQuery,
            variables: {
                name: lot_name,
                entity_id: session.get("selectedEntity"),
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(`Ocurrió un error al obtener el lote por nombre: ${response.data.errors
                .map((x) => x.message)
                .join(";")}`);
        }
        if (response?.data?.data.lots?.length <= 0) {
            throw new Error(`No se encontró ningún resultado para el name del lote enviado: ${lot_name}`);
        }
        const registerFound = response.data?.data?.lots[0];
        return registerFound;
    });
}
exports.getLoteByName = getLoteByName;
/**
 * getMyAgencyLotStocks
 * @param session
 * @returns
 */
async function getMyAgencyLotStocks(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getLotStocksByAgencyIdStringQuery,
            variables: {
                agency_id: session.get("agency_id"),
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(`Ocurrió un error al obtener el stock de lotes por agencia: ${response.data.errors
                .map((x) => x.message)
                .join(";")}`);
        }
        if (response?.data?.data.lot_stocks?.length <= 0) {
            throw new Error(`No se encontró ningún resultado para el stock de lotes por agencia: ${session.get("agency_id")}`);
        }
        const registerFound = response.data?.data?.lot_stocks;
        return registerFound;
    });
}
exports.getMyAgencyLotStocks = getMyAgencyLotStocks;
/**
 * getLote Function for get all details of the current lote
 * @param headers
 * @param agency_id
 * @returns
 */
async function updateLote(headers, lot_id, updatedData) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.patch(`/inventories/lots/${lot_id}.json`, updatedData, {
            headers,
        });
        return response.data;
    });
}
exports.updateLote = updateLote;
/**
 * getLotesExportJSON Function for get all zauru lotes by id_agencia
 * @param headers
 * @param agency_id
 * @returns
 */
async function getLotesExportJSON(headers, agency_id, desde, hasta) {
    const response = await httpZauru_js_1.default.get(`/inventories/lots/lots_export.json`, {
        headers,
        params: {
            warehouse: agency_id,
            //Desde: desde,
            //Hasta: hasta,
        },
    });
    return response.data;
}
exports.getLotesExportJSON = getLotesExportJSON;
/**
 *
 * @param headers
 * @param agency_id
 * @param baskets
 * @param basket_id
 * @returns
 */
async function getLotesFiltered(headers, agency_id, baskets, basket_id) {
    let lotes = await getLotesExportJSON(headers, agency_id);
    if (!baskets && basket_id) {
        //quito los que son de tipo canasta
        lotes = lotes.filter((lot) => lot.lot?.item_id !== basket_id);
    }
    else if (baskets && basket_id) {
        //jalo sólo los que son de tipo canasta
        lotes = lotes.filter((lot) => lot.lot?.item_id === basket_id);
    }
    lotes = lotes.map((lot) => {
        const baskets = (0, common_1.getBasketsSchema)(lot.lot.description);
        const baskets_quantity = baskets.map((x) => x.total).reduce(common_1.reduceAdd, 0);
        const availableByBasket = (0, common_1.truncateDecimals)(Number(lot.available) / baskets_quantity, 2);
        return {
            ...lot,
            baskets,
            availableByBasket,
            baskets_quantity,
        };
    });
    return lotes;
}
exports.getLotesFiltered = getLotesFiltered;
/**
 *
 * @param headers
 * @param agency_id
 * @param basket_id
 * @param orders
 * @param desde
 * @param hasta
 * @returns
 */
async function getLotesWithPurchaseFormated(headers, agency_id, basket_id, orders, desde, hasta) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const TODAY = new Date().getTime();
        const lotes = (await getLotesExportJSON(headers, agency_id, desde, hasta))
            //quito los que son de tipo canasta
            .filter((lot) => lot.lot?.item_id !== basket_id)
            //filtro sólo los de las ordenes que vienen
            .filter((lot) => Object.keys(orders).includes(lot.lot.name))
            .map((lot) => {
            return {
                ...orders[lot.lot.name],
                id_lote: lot.lot?.id,
                name_lote: lot.lot?.name,
                item: lot.lot?.item?.name,
                created_at: lot.lot?.created_at,
                weight: lot.available,
                baskets: lot?.lot?.description !== null && lot?.lot?.description?.length > 0
                    ? lot.lot?.description
                        .split(",")
                        .map((basket) => parseInt(basket.split("-")[0]))
                        .reduce((sum, qty) => sum + qty)
                    : 0,
                editable: Math.floor((TODAY - new Date(lot.lot?.created_at).getTime()) /
                    (1000 * 3600 * 24)) < 1,
            };
        })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return lotes;
    });
}
exports.getLotesWithPurchaseFormated = getLotesWithPurchaseFormated;
async function getLotesProcesados(headers, agency_id) {
    const deliveries = await (0, zauru_deliveries_js_1.getDeliveriesDataTables)(headers, {
        length: 0,
        order: {
            "0": {
                column: "0",
                dir: "desc",
            },
        },
        start: 0,
        agency_from: agency_id,
    });
    const dataFormateada = deliveries?.data?.data
        ?.filter((result) => result.mem)
        .map((result) => {
        //Ejemplo: "53876;351693;MINI ZANAHORIA (NARANJA);1775.0;35;25;2022-06-10"
        //${LOTE_ID};${LOTE_NAME};${VERDURA};${booked_quantity};${CANTIDAD_CANASTAS_ENVIADAS_A_CC};${porcentajeRechazo};${DELIVERY_DATE}
        const memSplited = result.mem.split(";");
        return {
            lote_id: memSplited[0],
            lote_name: memSplited[1],
            verdura: memSplited[2],
            pesoNeto: memSplited[3],
            canastas: memSplited[4],
            rechazo: `${(0, common_1.truncateDecimals)(Number(memSplited[5]), 2)}`,
            delivery_date: memSplited[6],
            pesoNetoPorCanasta: `${(0, common_1.truncateDecimals)((Number(memSplited[3]) ?? 0) / (Number(memSplited[4]) ?? 1), 2)}`,
        };
    });
    return dataFormateada ?? [];
}
exports.getLotesProcesados = getLotesProcesados;
/**
 *
 * @param headers
 * @param lot_id
 * @returns
 */
const inactivarLote = (headers, lot_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.patch(`/inventories/lots/${lot_id}.json`, { active: false }, { headers });
        return true;
    });
};
exports.inactivarLote = inactivarLote;
