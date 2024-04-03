"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvidersList = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 * getProvidersList
 * @param headers
 * @param session
 * @param byReceptions
 * @returns
 */
const getProvidersList = async (headers, session, byReceptions = true) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        let tag_id = undefined;
        if (byReceptions) {
            const { recepciones_tag_id } = await (0, services_1.getVariablesByName)(headers, session, ["recepciones_tag_id"]);
            tag_id = recepciones_tag_id;
        }
        //Obtengo los proveedores, que vienen en el endpoint de órdenes de compra
        const body = {
            order: { "0": { column: "1", dir: "desc" } },
            start: 0,
            length: 1,
            search: { value: "", regex: false },
            tag: tag_id,
            agency: session.get("agency_id") ?? "",
        };
        //Voy por las ordenes y las ordeno por fecha de recepción
        const ordersDataTablesResponse = await (0, services_1.getPurchasesListDataTables)(headers, body);
        if (ordersDataTablesResponse.error)
            throw new Error(ordersDataTablesResponse.userMsg);
        const ordersDataTables = ordersDataTablesResponse.data;
        return {
            vendors: ordersDataTables?.vendors ?? [],
            vendors_categories: ordersDataTables?.vendor_categories ?? [],
        };
    });
};
exports.getProvidersList = getProvidersList;
