"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLaboratoryClientCategoryPrice = exports.createNewLaboratoryClientCategoryPrice = exports.updateLaboratoryClientCategoryPrice = exports.createNewLaboratoryClient = exports.getClientesLaboratorio = exports.TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE = exports.TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
exports.TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE = "CATEGORIA_QUE_REPRESENTA_UN_PRECIO_DE_LABORATORIO (No borrar esto): ";
exports.TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE = "CAT-LABORATORIO: ";
/**
 * getClientesLaboratorio
 * @param session
 * @param headers
 * @returns
 */
const getClientesLaboratorio = (session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const clientesResponse = await (0, services_1.getPayeeCategoriesByNotesMatch)(session, exports.TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE);
        if (clientesResponse.error || !clientesResponse.data) {
            throw new Error(clientesResponse.userMsg);
        }
        const clientes = [];
        clientesResponse.data.forEach((x) => clientes.push(...x.payees));
        return clientes;
    });
};
exports.getClientesLaboratorio = getClientesLaboratorio;
/**
 * createNewLaboratoryClient
 * @param session
 * @param headers
 * @param body
 * @returns
 */
const createNewLaboratoryClient = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            vendor: false,
            currency_id: 1,
            buyer: true,
            service_provider: true,
        };
        const createResponse = await (0, services_1.createPayee)(headers, sendBody);
        if (!createResponse.data) {
            throw new Error(`Ocurrió un error al intentar crear el cliente: ${createResponse.userMsg}`);
        }
        return true;
    });
};
exports.createNewLaboratoryClient = createNewLaboratoryClient;
/**
 * createNewLaboratoryClientCategoryPrice
 * @param session
 * @param headers
 * @param body
 * @returns
 */
const updateLaboratoryClientCategoryPrice = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            name: `${exports.TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE}${body.name ?? ""}`,
            notes: `${exports.TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE}${body.notes ?? ""}`,
        };
        const createResponse = await (0, services_1.updatePayeeCategory)(headers, sendBody);
        if (!createResponse.data || createResponse.error) {
            throw new Error(`Ocurrió un error al intentar editar la categoría de cliente: ${createResponse.userMsg}`);
        }
        return true;
    });
};
exports.updateLaboratoryClientCategoryPrice = updateLaboratoryClientCategoryPrice;
/**
 * createNewLaboratoryClientCategoryPrice
 * @param session
 * @param headers
 * @param body
 * @returns
 */
const createNewLaboratoryClientCategoryPrice = (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            name: `${exports.TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE}${body.name ?? ""}`,
            notes: `${exports.TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE}${body.notes ?? ""}`,
        };
        const createResponse = await (0, services_1.createPayeeCategory)(headers, sendBody);
        if (!createResponse.data || createResponse.error) {
            throw new Error(`Ocurrió un error al intentar crear la categoría de cliente: ${createResponse.userMsg}`);
        }
        //Luego creo el listado de precios también
        const sendBodyPriceList = {
            client_exclusive: true,
            name: `PRECIO_LABORATORIO: ${body.name}`,
            description: `Listado de precio asociado a la categoría de cliente: ${body.name} id: ${createResponse.data?.id}`,
            payee_category_ids: [createResponse.data.id?.toString()],
        };
        const createPriceResponse = await (0, services_1.createPriceList)(headers, sendBodyPriceList);
        if (!createPriceResponse.data || createPriceResponse.error) {
            throw new Error(`Ocurrió un error al intentar crear el listado de precio: ${createPriceResponse.userMsg}`);
        }
        //Por último, asigno la categoría de empleados al término de pago de laboratorio
        const { lab_payment_term_default_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_payment_term_default_id"]);
        const paymentTermResponse = await (0, services_1.getPaymentTermById)(session, lab_payment_term_default_id);
        if (!paymentTermResponse.data || paymentTermResponse.error) {
            throw new Error(`Ocurrió un error al intentar encontrar el término de pago: ${paymentTermResponse.userMsg}`);
        }
        const updatePaymentTermResponse = await (0, services_1.updatePaymentTerm)(headers, {
            id: Number(lab_payment_term_default_id),
            payee_category_ids: [
                ...paymentTermResponse?.data?.allowed_payment_terms?.map((x) => x.payee_category_id.toString()),
                createResponse.data.id?.toString(),
            ],
        });
        if (!updatePaymentTermResponse.data || updatePaymentTermResponse.error) {
            throw new Error(`Ocurrió un error al intentar actualizar el término de pago: ${updatePaymentTermResponse.userMsg}`);
        }
        return true;
    });
};
exports.createNewLaboratoryClientCategoryPrice = createNewLaboratoryClientCategoryPrice;
/**
 * deleteLaboratoryClientCategoryPrice
 * @param headers
 * @param body
 * @returns
 */
const deleteLaboratoryClientCategoryPrice = (headers, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        //Elimino la categoría
        await (0, services_1.deletePayeeCategory)(headers, body.id ?? "");
        //Elimino la lista de precios
        await (0, services_1.deletePriceList)(headers, body.price_list_id ?? "");
        return true;
    });
};
exports.deleteLaboratoryClientCategoryPrice = deleteLaboratoryClientCategoryPrice;
