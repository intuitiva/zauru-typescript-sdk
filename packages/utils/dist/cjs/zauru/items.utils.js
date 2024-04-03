"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewLaboratoryItem = exports.createNewLaboratoryItemCategory = exports.getLabItemCategories = exports.getItemServicesByLabCategory = exports.getItemsByLabCategory = exports.getItemsByReceptionCategory = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getItemsByReceptionCategory = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { recepciones_item_category_id } = await (0, services_1.getVariablesByName)(headers, session, ["recepciones_item_category_id"]);
        const response = await (0, services_1.getItemsByCategoryId)(session, recepciones_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items por categoría de recepción: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
exports.getItemsByReceptionCategory = getItemsByReceptionCategory;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getItemsByLabCategory = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_super_category_item_id, lab_agency_id } = await (0, services_1.getVariablesByName)(headers, session, [
            "lab_super_category_item_id",
            "lab_agency_id",
        ]);
        const response = await (0, services_1.getItemsBySuperCategoryId)(session, lab_super_category_item_id, lab_agency_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items por categoría de laboratorio: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
exports.getItemsByLabCategory = getItemsByLabCategory;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getItemServicesByLabCategory = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_services_item_category_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_services_item_category_id"]);
        const response = await (0, services_1.getItemsByCategoryId)(session, lab_services_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items-servicios por categoría de laboratorio: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
exports.getItemServicesByLabCategory = getItemServicesByLabCategory;
/**
 * getLabItemCategories
 * @param session
 * @param headers
 * @returns
 */
const getLabItemCategories = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_super_category_item_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_super_category_item_id"]);
        const response = await (0, services_1.getItemCategoriesBySuperCategoryId)(session, lab_super_category_item_id);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response.data;
    });
};
exports.getLabItemCategories = getLabItemCategories;
/**
 * createNewLaboratoryClient
 * @param session
 * @param headers
 * @param body
 * @returns
 */
const createNewLaboratoryItemCategory = (session, headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_super_category_item_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_super_category_item_id"]);
        const sendBody = {
            ...body,
            item_super_category_id: Number(lab_super_category_item_id),
            color: "#ff0000",
        };
        const createResponse = await (0, services_1.createItemCategory)(headers, sendBody);
        if (!createResponse.data) {
            throw new Error(`Ocurrió un error al intentar crear el item category: ${createResponse.userMsg}`);
        }
        return true;
    });
};
exports.createNewLaboratoryItemCategory = createNewLaboratoryItemCategory;
/**
 * createNewLaboratoryItem
 * @param session
 * @param headers
 * @param body
 * @returns
 */
const createNewLaboratoryItem = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            active: true,
            sellable: true,
            quotable: true,
            ecommerce: false,
            purchasable: true,
            weight: 0,
            color: "#cccccc",
            ...body,
        };
        const createResponse = await (0, services_1.createItem)(headers, sendBody);
        if (!createResponse.data || createResponse.error) {
            throw new Error(`Ocurrió un error al intentar crear el item: ${createResponse.userMsg}`);
        }
        return createResponse.data;
    });
};
exports.createNewLaboratoryItem = createNewLaboratoryItem;
