import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getVariablesByName, getBundlesByItemCategoryId, createBundle, createForm, deleteBundle, getItemByName, deleteItem, getFormByName, deleteForm, } from "@zauru-sdk/services";
import { createNewLaboratoryItem } from "./items.utils.js";
export const LAB_BUNDLE_NAME = "LAB_BUNDLE_RECIP_";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getBundlesRecipByLabCategory = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_bundles_recip_item_category_id } = await getVariablesByName(headers, session, ["lab_bundles_recip_item_category_id"]);
        const response = await getBundlesByItemCategoryId(session, lab_bundles_recip_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los paquetes por categoría de laboratorio: ${response.userMsg}`);
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
export const getBundlesByLabCategory = async (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_bundles_item_category_id } = await getVariablesByName(headers, session, ["lab_bundles_item_category_id"]);
        const response = await getBundlesByItemCategoryId(session, lab_bundles_item_category_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los paquetes por categoría de laboratorio: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
/**
 * createNewLabPaquete
 * @param headers
 * @param session
 * @returns
 */
export const createNewLabPaquete = async (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        let msg = "";
        const { lab_bundles_item_category_id } = await getVariablesByName(headers, session, ["lab_bundles_item_category_id"]);
        const sendBody = {
            ...body,
            bundle_details: body?.bundle_details?.map((x) => {
                x._destroy = false;
                return x;
            }),
            item_category_id: Number(lab_bundles_item_category_id),
            force_as_service_for_document_external_storage_service: true,
        };
        const bundleResponse = await createBundle(headers, sendBody);
        if (bundleResponse.error) {
            msg = `Ocurrió un error al intentar crear el paquete: ${bundleResponse.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        return true;
    });
};
/**
 * createNewLabEnsayo
 * @param headers
 * @param session
 * @returns
 */
export const createNewLabEnsayo = async (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        let msg = "";
        const { lab_bundles_recip_item_category_id, lab_services_item_category_id, } = await getVariablesByName(headers, session, [
            "lab_bundles_recip_item_category_id",
            "lab_services_item_category_id",
        ]);
        //PASO 1
        //Creamos el bundle -> Paquete, donde va la receta
        const sendBody = {
            ...body,
            item_category_id: Number(lab_bundles_recip_item_category_id),
            name: `${LAB_BUNDLE_NAME}${body.name}`,
        };
        const bundleResponse = await createBundle(headers, sendBody);
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
        const itemResponse = await createNewLaboratoryItem(headers, itemSendBody);
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
        const formResponse = await createForm(headers, formSendBody);
        if (formResponse.error) {
            msg = `Ocurrió un error al intentar crear el formulario asociado al paquete: ${formResponse.userMsg}`;
            console.error(msg);
            throw new Error(msg);
        }
        console.log("-------------- FORM CREADO ! ---------------");
        return true;
    });
};
/**
 * deleteLabBundle
 * @param headers
 * @param session
 * @param bundle
 * @returns
 */
export const deleteLabBundle = async (headers, session, bundle) => {
    return handlePossibleAxiosErrors(async () => {
        await deleteBundle(headers, bundle.id);
        //busco el item-servicio para eliminarlo
        const responseItem = await getItemByName(session, `LAB_SERVICE_${bundle.id}; ${bundle.name}`);
        if (responseItem.data && !responseItem.error) {
            await deleteItem(headers, responseItem.data.id);
        }
        //busco el formulario para eliminarlo
        const responseForm = await getFormByName(session, `LAB_FORM_${bundle.id}; ${bundle.name}`);
        if (responseForm.data && !responseForm.error) {
            await deleteForm(headers, responseForm.data.id);
        }
        return true;
    });
};
