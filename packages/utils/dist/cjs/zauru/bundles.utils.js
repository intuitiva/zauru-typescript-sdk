"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLabBundle = exports.createNewLabEnsayo = exports.createNewLabPaquete = exports.getBundlesByLabCategory = exports.getBundlesRecipByLabCategory = exports.LAB_BUNDLE_NAME = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
const items_utils_js_1 = require("./items.utils.js");
exports.LAB_BUNDLE_NAME = "LAB_BUNDLE_RECIP_";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getBundlesRecipByLabCategory = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_bundles_recip_item_category_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_bundles_recip_item_category_id"]);
        const response = await (0, services_1.getBundlesByItemCategoryId)(session, lab_bundles_recip_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los paquetes por categoría de laboratorio: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
exports.getBundlesRecipByLabCategory = getBundlesRecipByLabCategory;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getBundlesByLabCategory = async (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_bundles_item_category_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_bundles_item_category_id"]);
        const response = await (0, services_1.getBundlesByItemCategoryId)(session, lab_bundles_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los paquetes por categoría de laboratorio: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
exports.getBundlesByLabCategory = getBundlesByLabCategory;
/**
 * createNewLabPaquete
 * @param headers
 * @param session
 * @returns
 */
const createNewLabPaquete = async (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        let msg = "";
        const { lab_bundles_item_category_id } = await (0, services_1.getVariablesByName)(headers, session, ["lab_bundles_item_category_id"]);
        const sendBody = {
            ...body,
            bundle_details: body?.bundle_details?.map((x) => {
                x._destroy = false;
                return x;
            }),
            item_category_id: Number(lab_bundles_item_category_id),
            force_as_service_for_document_external_storage_service: true,
        };
        const bundleResponse = await (0, services_1.createBundle)(headers, sendBody);
        if (bundleResponse.error) {
            msg = `Ocurrió un error al intentar crear el paquete: ${bundleResponse.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        return true;
    });
};
exports.createNewLabPaquete = createNewLabPaquete;
/**
 * createNewLabEnsayo
 * @param headers
 * @param session
 * @returns
 */
const createNewLabEnsayo = async (headers, session, body) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        let msg = "";
        const { lab_bundles_recip_item_category_id, lab_services_item_category_id, } = await (0, services_1.getVariablesByName)(headers, session, [
            "lab_bundles_recip_item_category_id",
            "lab_services_item_category_id",
        ]);
        //PASO 1
        //Creamos el bundle -> Paquete, donde va la receta
        const sendBody = {
            ...body,
            item_category_id: Number(lab_bundles_recip_item_category_id),
            name: `${exports.LAB_BUNDLE_NAME}${body.name}`,
        };
        const bundleResponse = await (0, services_1.createBundle)(headers, sendBody);
        if (bundleResponse.error) {
            msg = `Ocurrió un error al intentar crear el paquete: ${bundleResponse.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        console.log("-------------- BUNDLE CREADO ! ---------------");
        //PASO 2
        //Creamos el item
        const itemSendBody = {
            name: `LAB_SERVICE_${bundleResponse?.data?.id}; ${body.name}`,
            code: `LAB_SERVICE_${bundleResponse?.data?.id}`,
            stockable: false, //Esto lo vuelve servicio
            purchasable: false,
            sellable: true,
            pays_vat: true,
            item_category_id: Number(lab_services_item_category_id),
            description: `Item creado desde la webapp de laboratorio, para representar el servicio del ensayo creado. Ensayo: ${bundleResponse?.data?.id}`,
        };
        const itemResponse = await (0, items_utils_js_1.createNewLaboratoryItem)(headers, itemSendBody);
        if (itemResponse.error) {
            msg = `Ocurrió un error al intentar crear el item asociado al paquete: ${itemResponse.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        console.log("-------------- ITEM CREADO ! ---------------");
        //PASO 3
        //Creo el formulario
        const formSendBody = {
            active: true,
            name: `LAB_FORM_${itemResponse?.data?.id}; ${body.name}`,
            description: `Formulario creado desde la webapp, que representa el formulario con las preguntas que se llenan en el ensayo al que hace referencia el mismo. Ensayo: ${itemResponse?.data?.id}`,
            document_type: "invoice",
            settings_form_fields: [
                {
                    position: 1,
                    name: "Pregunta 1",
                    field_type: "text",
                    default_value: "",
                    print_var_name: "pregunta_1",
                },
            ],
        };
        const formResponse = await (0, services_1.createForm)(headers, formSendBody);
        if (formResponse.error) {
            msg = `Ocurrió un error al intentar crear el formulario asociado al paquete: ${formResponse.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        console.log("-------------- FORM CREADO ! ---------------");
        return true;
    });
};
exports.createNewLabEnsayo = createNewLabEnsayo;
/**
 * deleteLabBundle
 * @param headers
 * @param session
 * @param bundle
 * @returns
 */
const deleteLabBundle = async (headers, session, bundle) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await (0, services_1.deleteBundle)(headers, bundle.id);
        //busco el item-servicio para eliminarlo
        const responseItem = await (0, services_1.getItemByName)(session, `LAB_SERVICE_${bundle.id}; ${bundle.name}`);
        if (responseItem.data && !responseItem.error) {
            await (0, services_1.deleteItem)(headers, responseItem.data.id);
        }
        //busco el formulario para eliminarlo
        const responseForm = await (0, services_1.getFormByName)(session, `LAB_FORM_${bundle.id}; ${bundle.name}`);
        if (responseForm.data && !responseForm.error) {
            await (0, services_1.deleteForm)(headers, responseForm.data.id);
        }
        return true;
    });
};
exports.deleteLabBundle = deleteLabBundle;
