import { handlePossibleAxiosErrors, } from "@zauru-sdk/common";
import { createItem, createItemCategory, getItemCategoriesBySuperCategoryId, getItemsByCategoryId, getItemsBySuperCategoryId, getVariablesByName, } from "@zauru-sdk/services";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getItemsByReceptionCategory = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_item_category_id } = await getVariablesByName(headers, session, ["recepciones_item_category_id"]);
        const response = await getItemsByCategoryId(session, recepciones_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items por categoría de recepción: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getItemsByLabCategory = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_super_category_item_id, lab_agency_id } = await getVariablesByName(headers, session, [
            "lab_super_category_item_id",
            "lab_agency_id",
        ]);
        const response = await getItemsBySuperCategoryId(session, lab_super_category_item_id, lab_agency_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items por categoría de laboratorio: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getItemServicesByLabCategory = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_services_item_category_id } = await getVariablesByName(headers, session, ["lab_services_item_category_id"]);
        const response = await getItemsByCategoryId(session, lab_services_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los items-servicios por categoría de laboratorio: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
/**
 * getLabItemCategories
 * @param session
 * @param headers
 * @returns
 */
export const getLabItemCategories = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_super_category_item_id } = await getVariablesByName(headers, session, ["lab_super_category_item_id"]);
        const response = await getItemCategoriesBySuperCategoryId(session, lab_super_category_item_id);
        if (response.error || !response.data) {
            throw new Error(response.userMsg);
        }
        return response.data;
    });
};
/**
 * createNewLaboratoryClient
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export const createNewLaboratoryItemCategory = (session, headers, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_super_category_item_id } = await getVariablesByName(headers, session, ["lab_super_category_item_id"]);
        const sendBody = {
            ...body,
            item_super_category_id: Number(lab_super_category_item_id),
            color: "#ff0000",
        };
        const createResponse = await createItemCategory(headers, sendBody);
        if (!createResponse.data) {
            throw new Error(`Ocurrió un error al intentar crear el item category: ${createResponse.userMsg}`);
        }
        return true;
    });
};
/**
 * createNewLaboratoryItem
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export const createNewLaboratoryItem = (headers, body) => {
    return handlePossibleAxiosErrors(async () => {
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
        const createResponse = await createItem(headers, sendBody);
        if (!createResponse.data || createResponse.error) {
            throw new Error(`Ocurrió un error al intentar crear el item: ${createResponse.userMsg}`);
        }
        return createResponse.data;
    });
};
