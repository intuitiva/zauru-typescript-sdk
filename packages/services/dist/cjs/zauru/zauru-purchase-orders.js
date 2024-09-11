"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchasesOrderByIdNumber = exports.deletePurchaseOrder = exports.getGraphQLPurchaseOrderBetweenDates = exports.getPurchaseOrder = exports.getLast100Receptions = exports.updateReceivedPurchaseOrder = exports.updatePurchaseOrder = exports.enablePurchase = exports.getPurchase = exports.getPurchasesList = exports.getPurchasesListDataTables = exports.getNewPurchaseOrderInfo = exports.receivePurchaseOrder = exports.receiveLotPurchaseOrder = exports.createNewAuthorizedPurchaseOrder = exports.createNewPurchaseOrder = exports.markAsReceivePurchaseOrder = void 0;
const common_1 = require("@zauru-sdk/common");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
/**
 * markAsReceivePurchaseOrder
 * Esta función sólo se utiliza cuando se van a marcar como recibida toda la órden de compra, se recibe todo lo que se envío
 * si se quiere recibir parcialmente, utilizar el endpoint de /receptions
 * @param headers
 * @param body
 * @returns
 */
const markAsReceivePurchaseOrder = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = { ...body };
        if (sendBody.fechaVencimiento) {
            await (0, exports.receiveLotPurchaseOrder)(headers, sendBody);
        }
        else {
            await (0, exports.receivePurchaseOrder)(headers, sendBody);
        }
        return true;
    });
};
exports.markAsReceivePurchaseOrder = markAsReceivePurchaseOrder;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
const createNewPurchaseOrder = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        let sendBody = {
            ...body,
            purchase_order_details_attributes: (0, common_1.arrayToObject)(body?.purchase_order_details),
            tag_ids: [
                "",
                ...(body?.taggings?.map((x) => x.tag_id?.toString()) ?? []),
            ],
        };
        delete headers["Content-type"];
        delete sendBody.__rvfInternalFormId;
        delete sendBody.taggings;
        delete sendBody.purchase_order_details;
        if (!(sendBody?.pdf instanceof File) || sendBody.pdf?.size <= 0) {
            delete sendBody.pdf;
        }
        sendBody = (0, common_1.convertToFormData)({
            purchase_order: sendBody,
        });
        const response = await httpZauru_js_1.default.post(`/purchases/purchase_orders.json`, sendBody, { headers });
        return response.data;
    });
};
exports.createNewPurchaseOrder = createNewPurchaseOrder;
/**
 *
 * @param headers
 * @param body
 * @returns
 */
const createNewAuthorizedPurchaseOrder = (headers, body, withReceive = true) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            purchase_order_details_attributes: (0, common_1.arrayToObject)(body?.purchase_order_details),
        };
        const response = await httpZauru_js_1.default.post(`/purchases/purchase_orders.json`, { purchase_order: sendBody }, { headers });
        await httpZauru_js_1.default.get(`/purchases/purchase_orders/${response.data.id}/authorize.json`, { headers });
        if (withReceive) {
            if (sendBody.fechaVencimiento) {
                await (0, exports.receiveLotPurchaseOrder)(headers, response.data);
            }
            else {
                await (0, exports.receivePurchaseOrder)(headers, response.data);
            }
        }
        return response.data;
    });
};
exports.createNewAuthorizedPurchaseOrder = createNewAuthorizedPurchaseOrder;
/**
 * receiveLotPurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
const receiveLotPurchaseOrder = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            agency_id: body.agency_id,
            delivery_date: body.issue_date,
            id: body.id,
            needs_transit: false,
            purchase_order_details_attributes: (0, common_1.arrayToObject)(body.purchase_order_details?.map((x) => {
                const newDetail = {
                    id: x.id,
                    booked_quantity: x.booked_quantity,
                    item_id: x.item_id,
                    lot_delivered_quantity: [x.delivered_quantity],
                    lot_name: [body.id_number],
                    lot_expire: [body.fechaVencimiento],
                };
                return newDetail;
            })),
        };
        await httpZauru_js_1.default.patch(`/purchases/purchase_orders/${body.id}/receive_action`, { purchase_order: sendBody }, { headers });
        return true;
    });
};
exports.receiveLotPurchaseOrder = receiveLotPurchaseOrder;
/**
 * receivePurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
const receivePurchaseOrder = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            agency_id: body.agency_id,
            delivery_date: body.issue_date,
            id: body.id,
            needs_transit: false,
            purchase_order_details_attributes: (0, common_1.arrayToObject)(body.purchase_order_details?.map((x) => {
                const newDetail = {
                    id: x.id,
                    delivered_quantity: x.delivered_quantity,
                    booked_quantity: x.booked_quantity,
                    item_id: x.item_id,
                };
                return newDetail;
            })),
        };
        await httpZauru_js_1.default.patch(`/purchases/purchase_orders/${body.id}/receive_action`, { purchase_order: sendBody }, { headers });
        return true;
    });
};
exports.receivePurchaseOrder = receivePurchaseOrder;
/**
 *
 * @param headers
 * @returns
 */
const getNewPurchaseOrderInfo = (headers) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get("/purchases/purchase_orders/new.json", { headers });
        const purchasersList = [];
        response.data?.purchasers?.forEach((purchaser) => {
            if (purchaser?.id) {
                purchasersList.push({
                    value: purchaser?.id,
                    label: purchaser?.name,
                });
            }
        });
        return { ...response.data, purchasersList };
    });
};
exports.getNewPurchaseOrderInfo = getNewPurchaseOrderInfo;
/**
 * getPurchasesListDataTables Function for get all zauru orden-compras
 * @param headers
 * @returns
 */
const getPurchasesListDataTables = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.post(`/purchases/purchase_orders/datatables.json`, body, { headers });
        return response.data;
    });
};
exports.getPurchasesListDataTables = getPurchasesListDataTables;
/**
 * getPurchasesList Function for get all zauru orden-compras
 * @param headers
 * @param params
 * @returns
 */
const getPurchasesList = (headers, session, params = {}, config) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        //Si quiere obtener los de producción, obtengo primero su agencia producción
        if (config?.fromProduction) {
            const { production_agency_id: temp_production_agency_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["production_agency_id"]);
            const hashProductionAgencyId = JSON.parse(temp_production_agency_id ?? "{}");
            const production_agency_id = hashProductionAgencyId[session.get("agency_id")];
            params.agency_id = production_agency_id;
        }
        const response = await httpZauru_js_1.default.get(`/purchases/purchase_orders/export.json`, {
            headers,
            params,
        });
        return response.data;
    });
};
exports.getPurchasesList = getPurchasesList;
/**
 * getPurchase Function for get an especific purchase order
 * @param headers
 * @returns
 */
const getPurchase = (headers, purchase_order_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await (0, httpZauru_js_1.default)(`/purchases/purchase_orders/${purchase_order_id}.json`, { method: "GET", headers });
        const baskets_memo = (0, common_1.getBasketsSchema)(response.data.memo);
        const baskets_memo_quantity = baskets_memo
            .map((basket) => basket.total)
            .reduce(common_1.reduceAdd, 0);
        return {
            ...response.data,
            baskets_memo,
            baskets_memo_quantity,
        };
    });
};
exports.getPurchase = getPurchase;
/**
 * enablePurchase Enable a purchase order
 * @param headers
 * @param purchase_order_id
 * @param reception_id
 * @returns
 */
const enablePurchase = (headers, purchase_order_id, reception_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.get(`/purchases/receptions/${reception_id}/rebound.json?purchase_order_id=${purchase_order_id}`, { headers });
        return response.data;
    });
};
exports.enablePurchase = enablePurchase;
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
const updatePurchaseOrder = (headers, body, purchase_order_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.patch(`/purchases/purchase_orders/${purchase_order_id}.json`, body, { headers });
        return response.data;
    });
};
exports.updatePurchaseOrder = updatePurchaseOrder;
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
const updateReceivedPurchaseOrder = (headers, body, purchase_order_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const response = await httpZauru_js_1.default.patch(`/purchases/purchase_orders/${purchase_order_id}/update_received.json`, body, { headers });
        return response.data;
    });
};
exports.updateReceivedPurchaseOrder = updateReceivedPurchaseOrder;
/**
 * getLast100Receptions
 * @param headers
 * @returns
 */
const getLast100Receptions = (session, agency_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const agencyId = agency_id ?? Number(session.get("agency_id"));
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getLast100ReceptionsStringQuery)(Number(agencyId)),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.purchase_orders;
    });
};
exports.getLast100Receptions = getLast100Receptions;
/**
 * getPurchaseOrder
 * @param headers
 * @returns
 */
const getPurchaseOrder = (session, poId, config = {
    withLotStocksToMyAgency: false,
}) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getPurchaseOrderStringQuery)(Number(poId), {
                withLotStocks: config.withLotStocksToMyAgency,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const tempResponse = response.data?.data?.purchase_orders[0];
        if (config.withLotStocksToMyAgency) {
            tempResponse.lots[0].lot_stocks = tempResponse.lots[0].lot_stocks.filter((x) => x.agency_id === Number(session.get("agency_id")));
        }
        return tempResponse;
    });
};
exports.getPurchaseOrder = getPurchaseOrder;
/**
 * getGraphQLPurchaseOrderBetweenDates
 * @param headers
 * @returns
 */
const getGraphQLPurchaseOrderBetweenDates = (session, dates, config = {}) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        // Valores por defecto para config
        const defaultConfig = {
            agencyFilter: true,
            consolidateIdFilter: false,
            useProductionAgencyId: false,
            withShipmentToMyAgency: false,
            withLotStocksToMyAgency: false,
            betweenIssueDate: false,
            withPODetails: true,
            withLots: true,
            withShipmentPurchaseOrders: true,
            withWebAppRows: true,
            payeeCategoryIds: [],
            excludePayeeCategoryIds: [],
        };
        // Combinar config con los valores por defecto
        const finalConfig = { ...defaultConfig, ...config };
        let agency_id = finalConfig.agencyId;
        if (finalConfig.useProductionAgencyId) {
            const { production_agency_id } = await (0, common_js_1.getVariablesByName)(headers, session, ["production_agency_id"]);
            const hashAgencyId = JSON.parse(production_agency_id ?? "{}");
            agency_id = hashAgencyId[session.get("agency_id")];
        }
        const query = (0, graphql_1.getPurchaseOrdersBetweenDatesStringQuery)((0, common_1.formatDateToUTC)(dates.startDate), (0, common_1.formatDateToUTC)(dates.endDate), {
            agencyId: finalConfig.agencyFilter
                ? agency_id ?? session.get("agency_id")
                : undefined,
            consolidateIdFilter: finalConfig.consolidateIdFilter,
            lotItemIdExclusion: finalConfig.lotItemIdExclusion,
            poDetailTagId: finalConfig.poDetailTagId,
            withLotStocks: finalConfig.withLotStocksToMyAgency,
            itemId: finalConfig.itemId,
            payeeCategoryId: finalConfig.payeeCategoryId,
            betweenIssueDate: finalConfig.betweenIssueDate,
            payeeId: finalConfig.payeeId,
            id_number: finalConfig.id_number,
            withPODetails: finalConfig.withPODetails,
            withLots: finalConfig.withLots,
            withShipmentPurchaseOrders: finalConfig.withShipmentPurchaseOrders,
            withWebAppRows: finalConfig.withWebAppRows,
            payeeCategoryIds: finalConfig.payeeCategoryIds,
            excludePayeeCategoryIds: finalConfig.excludePayeeCategoryIds,
        });
        const graphQLBody = {
            query,
        };
        const response = await httpGraphQL_js_1.default.post("", graphQLBody, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        //============ Aplicación de filtros
        let responseData = response.data.data.purchase_orders;
        if (finalConfig.withShipmentToMyAgency) {
            responseData = response.data?.data?.purchase_orders.filter((x) => x.shipment_purchase_orders.some((y) => y.shipment.agency_to_id?.toString() == session.get("agency_id")));
        }
        if (finalConfig.withLotStocksToMyAgency) {
            responseData = responseData.map((x) => {
                x.lots = x.lots.map((y) => {
                    y.lot_stocks = y.lot_stocks.filter((z) => z.agency_id == session.get("agency_id"));
                    return y;
                });
                return x;
            });
        }
        return responseData;
    });
};
exports.getGraphQLPurchaseOrderBetweenDates = getGraphQLPurchaseOrderBetweenDates;
/**
 * deletePurchaseOrder
 * @param headers
 * @param id
 * @returns
 */
const deletePurchaseOrder = (headers, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/purchases/purchase_orders/${id}.json?destroy=true`, { headers });
        return true;
    });
};
exports.deletePurchaseOrder = deletePurchaseOrder;
/**
 * getPurchaseOrderByIdNumber
 * @param session
 * @param idNumber
 * @returns
 */
const getPurchasesOrderByIdNumber = (session, id_number) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getPurchaseOrderByIdNumberStringQuery)(id_number),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data.purchase_orders) {
            return [];
        }
        return response.data?.data?.purchase_orders;
    });
};
exports.getPurchasesOrderByIdNumber = getPurchasesOrderByIdNumber;
