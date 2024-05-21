import { arrayToObject, convertToFormData, formatDateToUTC, getBasketsSchema, handlePossibleAxiosErrors, reduceAdd, } from "@zauru-sdk/common";
import httpZauru from "./httpZauru.js";
import { getGraphQLAPIHeaders, getVariablesByName } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getLast100ReceptionsStringQuery, getPurchaseOrderByIdNumberStringQuery, getPurchaseOrderStringQuery, getPurchaseOrdersBetweenDatesStringQuery, } from "@zauru-sdk/graphql";
/**
 * markAsReceivePurchaseOrder
 * Esta función sólo se utiliza cuando se van a marcar como recibida toda la órden de compra, se recibe todo lo que se envío
 * si se quiere recibir parcialmente, utilizar el endpoint de /receptions
 * @param headers
 * @param body
 * @returns
 */
export const markAsReceivePurchaseOrder = (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = { ...body };
        if (sendBody.fechaVencimiento) {
            await receiveLotPurchaseOrder(headers, sendBody);
        }
        else {
            await receivePurchaseOrder(headers, sendBody);
        }
        return true;
    });
};
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export const createNewPurchaseOrder = (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        let sendBody = {
            ...body,
            purchase_order_details_attributes: arrayToObject(body?.purchase_order_details),
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
        sendBody = convertToFormData({
            purchase_order: sendBody,
        });
        const response = await httpZauru.post(`/purchases/purchase_orders.json`, sendBody, { headers });
        return response.data;
    });
};
/**
 *
 * @param headers
 * @param body
 * @returns
 */
export const createNewAuthorizedPurchaseOrder = (headers, body, withReceive = true) => {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            purchase_order_details_attributes: arrayToObject(body?.purchase_order_details),
        };
        const response = await httpZauru.post(`/purchases/purchase_orders.json`, { purchase_order: sendBody }, { headers });
        await httpZauru.get(`/purchases/purchase_orders/${response.data.id}/authorize.json`, { headers });
        if (withReceive) {
            if (sendBody.fechaVencimiento) {
                await receiveLotPurchaseOrder(headers, response.data);
            }
            else {
                await receivePurchaseOrder(headers, response.data);
            }
        }
        return response.data;
    });
};
/**
 * receiveLotPurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
export const receiveLotPurchaseOrder = (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            agency_id: body.agency_id,
            delivery_date: body.issue_date,
            id: body.id,
            needs_transit: false,
            purchase_order_details_attributes: arrayToObject(body.purchase_order_details?.map((x) => {
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
        await httpZauru.patch(`/purchases/purchase_orders/${body.id}/receive_action`, { purchase_order: sendBody }, { headers });
        return true;
    });
};
/**
 * receivePurchaseOrder
 * @param headers
 * @param body
 * @returns
 */
export const receivePurchaseOrder = (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            agency_id: body.agency_id,
            delivery_date: body.issue_date,
            id: body.id,
            needs_transit: false,
            purchase_order_details_attributes: arrayToObject(body.purchase_order_details?.map((x) => {
                const newDetail = {
                    id: x.id,
                    delivered_quantity: x.delivered_quantity,
                    booked_quantity: x.booked_quantity,
                    item_id: x.item_id,
                };
                return newDetail;
            })),
        };
        await httpZauru.patch(`/purchases/purchase_orders/${body.id}/receive_action`, { purchase_order: sendBody }, { headers });
        return true;
    });
};
/**
 *
 * @param headers
 * @returns
 */
export const getNewPurchaseOrderInfo = (headers) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get("/purchases/purchase_orders/new.json", { headers });
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
/**
 * getPurchasesListDataTables Function for get all zauru orden-compras
 * @param headers
 * @returns
 */
export const getPurchasesListDataTables = (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.post(`/purchases/purchase_orders/datatables.json`, body, { headers });
        return response.data;
    });
};
/**
 * getPurchasesList Function for get all zauru orden-compras
 * @param headers
 * @param params
 * @returns
 */
export const getPurchasesList = (headers, session, params = {}, config) => {
    return handlePossibleAxiosErrors(async () => {
        //Si quiere obtener los de producción, obtengo primero su agencia producción
        if (config?.fromProduction) {
            const { production_agency_id: temp_production_agency_id } = await getVariablesByName(headers, session, ["production_agency_id"]);
            const hashProductionAgencyId = JSON.parse(temp_production_agency_id ?? "{}");
            const production_agency_id = hashProductionAgencyId[session.get("agency_id")];
            params.agency_id = production_agency_id;
        }
        const response = await httpZauru.get(`/purchases/purchase_orders/export.json`, {
            headers,
            params,
        });
        return response.data;
    });
};
/**
 * getPurchase Function for get an especific purchase order
 * @param headers
 * @returns
 */
export const getPurchase = (headers, purchase_order_id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru(`/purchases/purchase_orders/${purchase_order_id}.json`, { method: "GET", headers });
        const baskets_memo = getBasketsSchema(response.data.memo);
        const baskets_memo_quantity = baskets_memo
            .map((basket) => basket.total)
            .reduce(reduceAdd, 0);
        return {
            ...response.data,
            baskets_memo,
            baskets_memo_quantity,
        };
    });
};
/**
 * enablePurchase Enable a purchase order
 * @param headers
 * @param purchase_order_id
 * @param reception_id
 * @returns
 */
export const enablePurchase = (headers, purchase_order_id, reception_id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/purchases/receptions/${reception_id}/rebound.json?purchase_order_id=${purchase_order_id}`, { headers });
        return response.data;
    });
};
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export const updatePurchaseOrder = (headers, body, purchase_order_id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.patch(`/purchases/purchase_orders/${purchase_order_id}.json`, body, { headers });
        return response.data;
    });
};
/**
 * updatePurchaseOrder
 * @param headers
 * @param body
 * @param purchase_order_id
 * @returns
 */
export const updateReceivedPurchaseOrder = (headers, body, purchase_order_id) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.patch(`/purchases/purchase_orders/${purchase_order_id}/update_received.json`, body, { headers });
        return response.data;
    });
};
/**
 * getLast100Receptions
 * @param headers
 * @returns
 */
export const getLast100Receptions = (session, agency_id) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getLast100ReceptionsStringQuery,
            variables: {
                agencyId: agency_id ?? session.get("agency_id"),
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        return response.data?.data?.purchase_orders;
    });
};
/**
 * getPurchaseOrder
 * @param headers
 * @returns
 */
export const getPurchaseOrder = (session, poId, config = {
    withLotStocksToMyAgency: false,
}) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getPurchaseOrderStringQuery({
                withLotStocks: config.withLotStocksToMyAgency,
            }),
            variables: {
                id: poId,
            },
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
/**
 * getPurchaseOrder
 * @param headers
 * @returns
 */
export const getGraphQLPurchaseOrderBetweenDates = (session, dates, config = {
    agencyFilter: true,
    consolidateIdFilter: false,
    useProductionAgencyId: false,
    withShipmentToMyAgency: false,
    withLotStocksToMyAgency: false,
    betweenIssueDate: false,
}) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        let agency_id = config.agencyId;
        if (config.useProductionAgencyId) {
            const { production_agency_id /**{5693: 5696} */ } = await getVariablesByName(headers, session, ["production_agency_id"]);
            const hashAgencyId = JSON.parse(production_agency_id ?? "{}");
            agency_id = hashAgencyId[session.get("agency_id")];
        }
        const query = getPurchaseOrdersBetweenDatesStringQuery({
            agencyId: config.agencyFilter
                ? agency_id ?? session.get("agency_id")
                : undefined,
            consolidateIdFilter: config.consolidateIdFilter,
            lotItemIdExclusion: config.lotItemIdExclusion,
            poDetailTagId: config.poDetailTagId,
            withLotStocks: config.withLotStocksToMyAgency,
            itemId: config.itemId,
            payeeCategoryId: config.payeeCategoryId,
            betweenIssueDate: config.betweenIssueDate,
        });
        const variables = {
            ...(config.lotItemIdExclusion
                ? { lotItemIdExclusion: config.lotItemIdExclusion }
                : {}),
            ...(config.poDetailTagId ? { poDetailTagId: config.poDetailTagId } : {}),
            startDate: formatDateToUTC(dates.startDate),
            endDate: formatDateToUTC(dates.endDate),
        };
        const response = await httpGraphQLAPI.post("", {
            query,
            variables,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        //============ Aplicación de filtros
        let responseData = [];
        if (config.withShipmentToMyAgency) {
            responseData = response.data?.data?.purchase_orders.filter((x) => x.shipment_purchase_orders.some((y) => y.shipment.agency_to_id?.toString() == session.get("agency_id")));
        }
        if (config.withLotStocksToMyAgency) {
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
/**
 * deletePurchaseOrder
 * @param headers
 * @param id
 * @returns
 */
export const deletePurchaseOrder = (headers, id) => {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/purchases/purchase_orders/${id}.json?destroy=true`, { headers });
        return true;
    });
};
/**
 * getPurchaseOrderByIdNumber
 * @param session
 * @param idNumber
 * @returns
 */
export const getPurchasesOrderByIdNumber = (session, id_number) => {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getPurchaseOrderByIdNumberStringQuery,
            variables: {
                id_number,
            },
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
