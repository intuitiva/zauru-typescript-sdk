"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoteDescription = exports.procesarLote = exports.getLotesFormated = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
const purchase_orders_utils_js_1 = require("./purchase-orders.utils.js");
/**
 * Obtiene el listado de ordenes de compra, formateado especialmente para armar la tabla de edición de porcentajes de rechazo
 * @param headers
 * @param session
 * @returns
 */
const getLotesFormated = async (headers, session) => {
    //PASO 1: Obtengo las variables, para buscar mi tag_id y mi basket_id
    const { recepciones_basket_item_id: basket_id, production_agency_id /**{5693: 5696} */, } = await (0, services_1.getVariablesByName)(headers, session, [
        "recepciones_basket_item_id",
        "production_agency_id",
    ]);
    const hashAgencyId = JSON.parse(production_agency_id ?? "{}");
    const agency_id = hashAgencyId[session.get("agency_id")];
    //PASO 2: Busco mis lotes
    if (agency_id) {
        return await (0, services_1.getLotesFiltered)(headers, agency_id, false, Number(basket_id));
    }
    return [];
};
exports.getLotesFormated = getLotesFormated;
/**
 * procesarLote
 * @param headers
 * @param session
 * @param data
 * @param byPercent
 */
const procesarLote = async (headers, session, data, poId) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        //=====================================================================================
        //=====================================================================================
        //PASO 1: OBTENER TODAS LAS VARIABLES QUE VAMOS A UTILIZAR EN EL FLUJO
        const { production_agency, operative_rejection_agency_id, recepciones_basket_item_id: basket_id, } = await (0, services_1.getVariablesByName)(headers, session, [
            "production_agency",
            "operative_rejection_agency_id",
            "recepciones_basket_item_id",
        ]);
        const session_agency_id = session.get("agency_id");
        const hashObject = JSON.parse(operative_rejection_agency_id);
        const op_rejection_agency_id = hashObject[session_agency_id];
        //PARSEO DE LA INFORMACIÓN QUE VIENE DEL SUBMIT
        const byPercent = data.byPercent === "true";
        const porcentajeRechazo = !byPercent
            ? (0, common_1.toFixedIfNeeded)((Number(data.lbRechazo ?? "0") /
                (Number(data?.lbRechazo ?? "0") + Number(data.lbBueno))) *
                100)
            : data.porcentajeRechazo;
        const basket_keys = Object.keys(data).filter((x) => x.includes("basket-"));
        const baskets_regresadas = basket_keys.map((basket_key) => {
            //ejemplo de una key: basket-CONVENCIONAL-58281
            const splited = basket_key.split("-");
            return {
                id: splited[2] || 0,
                color: splited[1] || "",
                total: Number(data[basket_key]) || 0,
            };
        });
        //1.2 OBTENER LA INFORMACIÓN DEL LOTE A PROCESAR (LA TOMO DE LA QUE YA TENGO AL CARGAR LA INFO)
        const purchaseOrderResponse = await (0, services_1.getPurchaseOrder)(session, poId, {
            withLotStocksToMyAgency: true,
        });
        if (purchaseOrderResponse.error || !purchaseOrderResponse?.data) {
            throw new Error(`Error al intentar encontrar la órden de compra: ${purchaseOrderResponse.userMsg}`);
        }
        const purchaseOrder = purchaseOrderResponse.data;
        const lbsEsperadas = purchaseOrder.lots[0].lot_stocks[0].available;
        const lbsMalas = lbsEsperadas * (Number(porcentajeRechazo) / 100);
        const lbsBuenas = lbsEsperadas - lbsMalas;
        const baskets_memo = (0, common_1.getBasketsSchema)(purchaseOrder.memo);
        const baskets_memo_quantity = baskets_memo
            .map((basket) => basket.total)
            .reduce(common_1.reduceAdd, 0);
        //SI SE INGRESA POR LIBRAS, ES QUE SE ESTÁ INGRESANDO CANASTAS A DEVOLVER ETC Y HAY QUE HACER LOS ENVÍOS CORRESPONDIENTES
        if (!byPercent) {
            console.log("=============> PROCESANDO DATA POR PESO...");
            //CUANDO NO ES POR PORCENTAJE DIRECTO HAY QUE HACER TODO EL FLUJO DE CREAR LOS ENVÍOS ETC...
            //1.3: SE CREA EL ENVÍO DE VEGETALES Y CANASTAS DEVUELTOS POR CONTROL DE CALIDAD, (LOS QUE ESTÁN BUENOS)
            //Las canastas vienen en data en campos como estos "basket-CONVENCIONAL-58281": "2",
            const bodyGoodToProduction = {
                booker_id: Number(session.get("employee_id")),
                needs_transport: false,
                payee_id: purchaseOrder.payee_id,
                memo: `${purchaseOrder.lots[0].id};${purchaseOrder.id_number};${purchaseOrder.purchase_order_details[0]?.item?.name};${purchaseOrder.purchase_order_details
                    .map((purchase) => Number(purchase.booked_quantity))
                    .reduce(common_1.reduceAdd, 0)};${baskets_memo_quantity};${porcentajeRechazo};${purchaseOrder.delivery_date}`,
                planned_delivery: `${data.date}`,
                agency_from_id: Number(session_agency_id), //agencia donde está loggeado mi usuario
                agency_to_id: purchaseOrder.agency_id, //de donde viene la orden de compra
                reference: "Vegetales buenos devueltos desde control de calidad.",
                movements: [
                    {
                        item_id: purchaseOrder.purchase_order_details[0].item_id,
                        lot_id: purchaseOrder.lots[0].id,
                        reference: "Vegetales devueltos de CC",
                        booked_quantity: lbsBuenas,
                    },
                ],
            };
            /**
             * Para las canastas
             * el item_id = 490533 = recepciones_basket_item_id
             * lot_id: código de la canasta,
             * booked_quantity = cantidad de canastas que ingresa el usuario que va a devolver
             */
            baskets_regresadas.forEach((basket) => {
                bodyGoodToProduction.movements.push({
                    item_id: Number(basket_id),
                    lot_id: basket.id,
                    reference: `Canasta ${basket.color}-${basket.id} devuelta a CC`,
                    booked_quantity: basket.total,
                });
            });
            console.log("-------- Insertando booking con canastas buenas devueltas");
            const goodVegetablesInserted = await (0, services_1.insertBookings)(headers, bodyGoodToProduction, `${purchaseOrder.id}`);
            if (!goodVegetablesInserted.error && goodVegetablesInserted.data) {
                //1.4 Recibir la reserva para que las cantidades se muevan correctamente a la bodega de destino
                console.log("recibiendo la reserva: ", goodVegetablesInserted.data?.id);
                await (0, services_1.getDeliveryByBooking)(headers, goodVegetablesInserted.data?.id);
            }
            if (lbsMalas && lbsMalas > 0) {
                //=====================================================================================
                //=====================================================================================
                //PASO 2: Envío con vegetales rechazados a bodega de PRODUCCIÓN desde la agencia del usuario loggeado
                const bodyOchToProduction = {
                    booker_id: Number(session.get("employee_id")),
                    needs_transport: false,
                    memo: "",
                    planned_delivery: `${data.date}`,
                    agency_from_id: Number(session_agency_id), //agencia donde está loggeado mi usuario
                    agency_to_id: Number(production_agency), //de donde viene la orden de compra
                    reference: "Envío de vegetales rechazados a la bodega de producción.",
                    movements: [
                        {
                            item_id: purchaseOrder.purchase_order_details[0].item_id,
                            lot_id: purchaseOrder.lots[0].id,
                            reference: "Vegetales rechazados de CC",
                            booked_quantity: lbsMalas,
                        },
                    ],
                };
                console.log("--------- enviando a insertar booking de rechazo a la bodega de producción");
                const ochToProductionVegetablesInserted = await (0, services_1.insertBookings)(headers, bodyOchToProduction, `${purchaseOrder.id}`);
                if (!ochToProductionVegetablesInserted.error &&
                    ochToProductionVegetablesInserted.data) {
                    //2.1 Recibir la reserva para que las cantidades se muevan correctamente a la bodega de destino
                    console.log("Recibiendo booking de rechazo...");
                    await (0, services_1.getDeliveryByBooking)(headers, ochToProductionVegetablesInserted.data.id);
                }
                //=====================================================================================
                //=====================================================================================
                //PASO 3: Envío con vegetales rechazados a bodega de RECHAZO desde la bodega de PRODUCCIÓN
                //Sólo cambia el agency_from_id y el agency_to_id, de ahí lo demás lo mismo que PASO 2
                bodyOchToProduction.agency_from_id = Number(production_agency);
                bodyOchToProduction.agency_to_id = Number(op_rejection_agency_id);
                bodyOchToProduction.reference =
                    "Envío de vegetales rechazados a la bodega de rechazo.";
                console.log("--------- enviando a insertar booking de rechazo a la bodega de rechazo");
                const ochToOchVegetablesInserted = await (0, services_1.insertBookings)(headers, bodyOchToProduction);
                if (!ochToOchVegetablesInserted.error &&
                    ochToOchVegetablesInserted.data) {
                    //3.1 Recibir la reserva para que las cantidades se muevan correctamente a la bodega de destino
                    await (0, services_1.getDeliveryByBooking)(headers, ochToOchVegetablesInserted.data?.id);
                }
            }
            //=====================================================================================
            //=====================================================================================
            //PASO 5: Modificación de canastas en el lote de verdura
            //la misma description del detalle del lote pero modificando la cantidad de canastas que quedaron.
            //ejemplo: original: 27-53311-VERDE,1-53313-ROJA,1-53317-CELESTE,3-53312-AZUL,3-53314-AMARILLA
            //ahora: 27-53311-VERDE,1-53313-ROJA,1-53317-CELESTE,2-53312-AZUL,3-53314-AMARILLA // ahora sólo 2 azules porque no devolví una
            const newDescriptions = [];
            baskets_memo.forEach((basket) => {
                //Si existe una basket a regresar con el mismo id, pregunto cuantas va a regresar, para restarlas del total.
                const basket_regresada = baskets_regresadas.find((x) => x.id === basket.id);
                const resta = basket_regresada?.total ?? 0;
                newDescriptions.push(`${basket.total - resta}-${basket.id}-${basket.color}`);
            });
            await (0, services_1.updateLote)(headers, purchaseOrder.lots[0].id, {
                lot: {
                    description: newDescriptions.join(","),
                },
            });
        }
        else {
            console.log("PROCESANDO DATA POR PORCENTAJE...");
            //CUANDO NO ES POR PORCENTAJE DIRECTO HAY QUE HACER TODO EL FLUJO DE CREAR LOS ENVÍOS ETC...
            //1.3: SE CREA EL ENVÍO DE VEGETALES Y CANASTAS DEVUELTOS POR CONTROL DE CALIDAD, (LOS QUE ESTÁN BUENOS)
            //Las canastas vienen en data en campos como estos "basket-CONVENCIONAL-58281": "2",
            const bodyGoodToProduction = {
                booker_id: Number(session.get("employee_id")),
                needs_transport: false,
                payee_id: purchaseOrder.payee_id,
                memo: `${purchaseOrder.lots[0].id};${purchaseOrder.lots[0].name};${purchaseOrder.purchase_order_details[0]?.item?.name};${purchaseOrder.purchase_order_details
                    .map((detail) => Number(detail.booked_quantity))
                    .reduce(common_1.reduceAdd, 0)};${baskets_memo_quantity};${porcentajeRechazo};${purchaseOrder.delivery_date}`,
                planned_delivery: `${data.date}`,
                agency_from_id: Number(session_agency_id), //agencia donde está loggeado mi usuario
                agency_to_id: purchaseOrder.agency_id, //de donde viene la orden de compra
                reference: "Regreando vegetales buenos desde control de calidad.",
                movements: [
                    {
                        item_id: purchaseOrder.purchase_order_details[0].item_id,
                        lot_id: purchaseOrder.lots[0].id,
                        reference: "Vegetales devueltos de CC",
                        booked_quantity: lbsEsperadas, //devuelvo la misma cantidad que fue enviada
                    },
                ],
            };
            /**
             * Para las canastas
             * el item_id = 490533 = recepciones_basket_item_id
             * lot_id: código de la canasta,
             * booked_quantity = cantidad de canastas que ingresa el usuario que va a devolver
             */
            //Todas las canastas que fueron enviadas originalmente
            baskets_memo.forEach((basket) => {
                bodyGoodToProduction.movements.push({
                    item_id: Number(basket_id),
                    lot_id: basket.id,
                    reference: `Canasta ${basket.color}-${basket.id} devuelta a CC`,
                    booked_quantity: basket.total,
                });
            });
            console.log("-------- Insertando booking con canastas buenas devueltas");
            const goodVegetablesInserted = await (0, services_1.insertBookings)(headers, bodyGoodToProduction, `${purchaseOrder.id}`);
            //1.4 Recibir la reserva para que las cantidades se muevan correctamente a la bodega de destino
            if (!goodVegetablesInserted.error && goodVegetablesInserted.data) {
                console.log("A RECIBIR BOOKING - POR PORCENTAJE");
                await (0, services_1.getDeliveryByBooking)(headers, goodVegetablesInserted.data.id);
            }
        }
        //=====================================================================================
        //=====================================================================================
        //PASO 4: Modificación de porcentaje de rechazo en la orden de compra
        //4.1 El primer paso es devolver la recepción recibida en la orden de compra.
        //Primero se debe obtener el id de dicha recepción
        const reception = purchaseOrder.receptions[0];
        const reception_details = reception?.reception_details[0];
        //4.2 Habilito la orden de compra
        await (0, services_1.enablePurchase)(headers, purchaseOrder.id, reception?.id);
        //4.3 Editar porcentajes de rechazo
        const updateBodyPurchase = {
            purchase_order: { discount: porcentajeRechazo },
        };
        await (0, services_1.updatePurchaseOrder)(headers, updateBodyPurchase, purchaseOrder.id);
        //4.4 Crear una nueva recepcion
        const bodyReception = {
            reception: {
                agency_id: reception.agency_id,
                entity_id: reception.entity_id,
                needs_transit: false,
                purchase_order_id: purchaseOrder.id,
                received_at: new Date(Date.now() + 12096e5).toISOString().split("T")[0],
                invoice_number: `${reception.invoice_number ?? ""}`,
                reception_details_attributes: {
                    "0": {
                        item_id: `${reception_details?.item_id}`,
                        lot_delivered_quantity: [reception_details?.lot_delivered_quantity],
                        lot_description: [reception_details?.lot_description],
                        lot_expire: [reception_details?.lot_expire],
                        lot_name: [reception_details?.lot_name],
                        purchase_order_detail_id: `${reception_details?.purchase_order_detail_id}`,
                    },
                },
            },
        };
        await (0, services_1.createNewReception)(headers, bodyReception, purchaseOrder.id);
        //=====================================================================================
        //=====================================================================================
        //PASO 6: Guardar razones de rechazo en webapp table
        await (0, services_1.saveMotivosDeRechazoByPurchase)(headers, session, {
            Razon_primaria: `${data.razonPrincipal ?? ""}`,
            Razon_secundaria: `${data.razonSecundaria ?? ""}`,
            Razon_terciaria: `${data.razonTerciaria ?? ""}`,
            Canastas: `${data.ochBaskets ?? ""}`,
        }, {
            temp_purchase_order_id: `${purchaseOrder.id}`,
        });
    });
};
exports.procesarLote = procesarLote;
/**
 * Obtiene toda la información de lote, con las canastas y razones de rechazo
 * @param headers
 * @param session
 * @returns
 */
const getLoteDescription = async (headers, session, lote_id) => {
    //PASO 1: Obtengo las variables, para buscar mi basket_id
    const { production_agency_id /**{5693: 5696} */ } = await (0, services_1.getVariablesByName)(headers, session, ["production_agency_id"]);
    const hashAgencyId = JSON.parse(production_agency_id ?? "{}");
    const agency_id = hashAgencyId[session.get("agency_id")];
    //PASO 2: Busco mi lote
    const lote = await (0, services_1.getLote)(headers, lote_id, agency_id);
    //PASO 3: Obtener listado de canastas enviadas a bodega control de calidad
    //El primer paso es ubicar la orden de compra original, la cual permitirá ubicar el envío que se
    //realizó a la bodega de control de calidad
    const purchase_order = await (0, purchase_orders_utils_js_1.getPurchaseOrderDataTables)(headers, lote.name.replace("-RETENIDO", "") // por si trae la palabra RETENIDO,
    );
    //PASO 4: Obtener los envíos asociados a la orden de compra
    const purchaseResponse = await (0, services_1.getPurchase)(headers, purchase_order.no_orden);
    return {
        lote,
        purchase_order,
        purchase: purchaseResponse.data,
    };
};
exports.getLoteDescription = getLoteDescription;
