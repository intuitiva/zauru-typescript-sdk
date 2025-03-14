import { getHeaders, getSession, insertBookings, updateReceivedPurchaseOrder, } from "@zauru-sdk/services";
import { deleteQueueShipmentsFormHistory, updateQueueShipmentsFormHistory, } from "./4pinos-shipments-form-history.utils.js";
import { ESTADOS_COLA_RECEPCIONES } from "./4pinos-receptions-form-history.utils.js";
export const register4pinosShipment = async ({ cookie, idWebAppTable, apiStep, shipment_id, values, }) => {
    const session = await getSession(cookie);
    const headers = await getHeaders(cookie, session);
    let proccess_step = apiStep ?? 1;
    let new_shipment_id = shipment_id ?? undefined;
    try {
        //TODO: VERIFICAR SI EL ENVIO YA EXISTE
        if (proccess_step === 1) {
            //PASO 1: CREAR EL ENVIO
            const shipmentBody = {
                memo: `ENVIO_MATERIA_PRIMA_${values?.memo || ""}`,
                reference: `Envío de materia prima entre agencias, con código: ${values.shipment_reference}, realizado desde la aplicación web de recepciones.`,
                agency_from_id: values.agency_from_id,
                agency_to_id: values.agency_to_id,
                booker_id: values.booker_id,
                id_number: values.shipment_reference,
                transporter_id: values.transporter_id,
                planned_delivery: values.planned_delivery,
                planned_shipping: values.planned_shipping,
                needs_transport: true,
                movements: values.purchase_orders.map((purchaseOrder) => ({
                    lot_id: purchaseOrder.lot_id,
                    booked_quantity: purchaseOrder.booked_quantity,
                    item_id: purchaseOrder.item_id,
                    delivered_quantity: purchaseOrder.booked_quantity,
                    reference: `PO_ID_${purchaseOrder.id};PO_ID_NUMBER_${purchaseOrder.id_number}`,
                })),
            };
            console.log("========================================>");
            console.log("paso 1: CREAR EL ENVIO");
            console.log("Enviando: ", JSON.stringify(shipmentBody));
            const createBookingResponse = await insertBookings(headers, shipmentBody);
            if (createBookingResponse.error) {
                throw new Error(`Error al crear el envío: ${createBookingResponse.userMsg} con el body: ${JSON.stringify(shipmentBody)}`);
            }
            new_shipment_id = createBookingResponse.data?.id;
        }
        proccess_step++;
        //SE QUITA EL DESPACHO AUTOMATICO, PORQUE SE VA A HACER MANUAL AHORA
        /*
        if (proccess_step === 2) {
          //PASO 2: DESPACHAR EL ENVIO -- PONER EN TRANSITO
          console.log("========================================>");
          console.log("paso 2: DESPACHAR EL ENVIO -- PONER EN TRANSITO");
          const dispatchShipmentResponse = await despacharShipment_booking(
            headers,
            Number(new_shipment_id)
          );
    
          if (dispatchShipmentResponse.error) {
            throw new Error(
              `Error al despachar el envío: ${dispatchShipmentResponse.userMsg} con el id: ${new_shipment_id}`
            );
          }
        }
        */
        proccess_step++;
        if (proccess_step === 3) {
            //PASO 2: COLOCO EL NUMERO DE ENVIO EN TODAS LAS ORDENES DE COMPRA
            console.log("========================================>");
            console.log("paso 3: COLOCO EL NUMERO DE ENVIO EN TODAS LAS ORDENES DE COMPRA");
            for (const purchaseOrder of values.purchase_orders) {
                const response = await updateReceivedPurchaseOrder(headers, {
                    purchase_order: {
                        shipment_reference: values.shipment_reference,
                    },
                }, purchaseOrder.id);
                if (response.error) {
                    throw new Error(`Error al actualizar la orden de compra ${purchaseOrder.id}: ${response.userMsg}`);
                }
            }
        }
        proccess_step++;
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
            apiStep: proccess_step,
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
        console.log("------- EJECUTANDO LOCALMENTE", ` para ${register.data?.formSubmited?.shipment_reference}`);
        register4pinosShipment({
            values: register.data?.formSubmited,
            cookie: cookie || "",
            idWebAppTable: register.id,
            apiStep: register.data?.apiStep,
            shipment_id: register.data?.shipment_id,
        });
    }
    else {
        console.log("------- ENVIANDO A EJECUTAR NETLIFY FUNCTION: 4pinosNewShipment-background", ` para ${register.data?.formSubmited?.shipment_reference}`);
        fetch(`https://${hostname}/.netlify/functions/4pinosNewShipment-background`, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                values: register.data?.formSubmited,
                cookie: cookie || "",
                idWebAppTable: register.id,
                apiStep: register.data?.apiStep,
                shipment_id: register.data?.shipment_id,
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
