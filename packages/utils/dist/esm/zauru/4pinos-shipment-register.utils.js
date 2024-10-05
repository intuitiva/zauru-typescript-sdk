import { getHeaders, getSession, updateReceivedPurchaseOrder, } from "@zauru-sdk/services";
import { deleteQueueShipmentsFormHistory, updateQueueShipmentsFormHistory, } from "./4pinos-shipments-form-history.utils.js";
import { ESTADOS_COLA_RECEPCIONES } from "./4pinos-receptions-form-history.utils.js";
export const register4pinosShipment = async ({ cookie, idWebAppTable, agency_id, values, }) => {
    const session = await getSession(cookie);
    const headers = await getHeaders(cookie, session);
    try {
        //PASO 1: COLOCO EL NUMERO DE ENVIO EN TODAS LAS ORDENES DE COMPRA
        for (const purchaseOrder of values.purchase_orders) {
            const response = await updateReceivedPurchaseOrder(headers, {
                purchase_order: {
                    shipment_number: values.shipment_number,
                },
            }, purchaseOrder.id);
            if (response.error) {
                throw new Error(`Error al actualizar la orden de compra ${purchaseOrder.id}: ${response.userMsg}`);
            }
        }
        console.log("========================================>");
        console.log("paso 4: ELIMINAR EL REGISTRO DE LA COLA");
        //ELIMINAR EL REGISTRO DE LA COLA
        await deleteQueueShipmentsFormHistory(headers, session, idWebAppTable.toString());
    }
    catch (e) {
        console.log("========================================>");
        console.log("paso -1: ACTUALIZAR EL REGISTRO DE LA COLA A ERROR");
        console.error(`Error: ${e?.toString()}, idWebAppTable: ${idWebAppTable}`);
        await updateQueueShipmentsFormHistory(headers, session, {
            estado: ESTADOS_COLA_RECEPCIONES.ERROR,
            description: e?.toString(),
        }, idWebAppTable);
    }
};
export const retryShipmennt = async (register, session, headers, hostname, cookie) => {
    console.log("REINTENTO DE REGISTRO DE ENVÍO =======================>");
    const queueResponse = await updateQueueShipmentsFormHistory(headers, session, {
        estado: ESTADOS_COLA_RECEPCIONES.REINTENTANDO,
    }, register.id);
    if (queueResponse.error || !queueResponse.data?.id) {
        return {
            error: true,
            title: "No se logró comunicar con la red.",
            type: "error",
            description: `No hay comunicación con la red para el reintento: ${queueResponse?.userMsg}`,
        };
    }
    if (hostname.includes("localhost")) {
        console.log("------- EJECUTANDO LOCALMENTE", ` para ${register.data?.formSubmited?.shipment_number}`);
        register4pinosShipment({
            values: register.data?.formSubmited,
            cookie: cookie || "",
            idWebAppTable: register.id,
            agency_id: register.data?.agency_id,
        });
    }
    else {
        console.log("------- ENVIANDO A EJECUTAR NETLIFY FUNCTION: 4pinosNewShipment-background", ` para ${register.data?.formSubmited?.shipment_number}`);
        fetch(`https://${hostname}/.netlify/functions/4pinosNewShipment-background`, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                values: register.data?.formSubmited,
                cookie: cookie || "",
                idWebAppTable: register.id,
                agency_id: register.data?.agency_id,
            }),
        });
    }
    return {
        error: false,
        title: "Reintento iniciado con éxito.",
        type: "success",
        description: `Se está procesando el reintento de ingreso de recepción!.`,
    };
};
