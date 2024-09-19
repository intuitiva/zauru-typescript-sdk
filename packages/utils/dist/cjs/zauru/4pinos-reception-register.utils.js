"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryPO = exports.register4pinosReception = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
const motivos_rechazo_utils_js_1 = require("./motivos-rechazo.utils.js");
const _4pinos_receptions_form_history_utils_js_1 = require("./4pinos-receptions-form-history.utils.js");
const register4pinosReception = async ({ cookie, idWebAppTable, agency_id, values, originApiResponses = {}, }) => {
    const session = await (0, services_1.getSession)(cookie);
    const headers = await (0, services_1.getHeaders)(cookie, session);
    let apiResponses = {
        apiCall: originApiResponses.apiCall ?? 1,
        ...originApiResponses,
    };
    try {
        if (apiResponses.apiCall === 1) {
            const responseUpdate = await (0, _4pinos_receptions_form_history_utils_js_1.updateQueueFormReceptionHistory)(headers, session, {
                estado: _4pinos_receptions_form_history_utils_js_1.ESTADOS_COLA_RECEPCIONES.EN_PROCESO,
            }, idWebAppTable);
            if (responseUpdate.error) {
                throw new Error("Error al intentar actualizar el estado de la cola: " +
                    responseUpdate?.userMsg);
            }
            apiResponses.apiCall = apiResponses.apiCall + 1;
        }
        if (apiResponses.apiCall === 2) {
            //SI EL API CALL ES DIFERENTE DE 1 SIGNIFICA QUE SOLO VA A REINTENTAR DESDE DONDE FALLÓ
            //Validando que no exista ya una recepción con ese número:
            const responsePOSearch = await (0, services_1.getPurchasesOrderByIdNumber)(session, values?.idNumberInput);
            if (responsePOSearch.error || !responsePOSearch.data) {
                throw new Error(`No hay comunicación con la red para la validación de exists - Validate Exists: ${responsePOSearch?.userMsg}`);
            }
            const existentes = responsePOSearch?.data?.filter((x) => !x.voided);
            if (existentes?.length > 0) {
                throw new Error(`Ya existe una órden de compra con este número de contraseña asociado, revise el listado general. Peso: ${existentes[0].due}, Ingresado el: ${(0, common_1.getFormattedDate)(existentes[0].issue_date, false)}, Memo: ${existentes[0].memo}, Tipo: ${existentes[0].reference}`);
            }
        }
        const webapp_table_rejection = {
            Canastas: "int",
            Razon_primaria: "string",
            Razon_secundaria: "string",
            Razon_terciaria: "string",
            Otras_razones: "string",
        };
        const { recepciones_tag_id: tag_id, recepciones_vendor_agency_id: origin_agency, recepciones_my_quality_control_agency_id, } = await (0, services_1.getVariablesByName)(headers, session, [
            "recepciones_tag_id",
            "recepciones_vendor_agency_id",
            "recepciones_my_quality_control_agency_id",
        ]);
        // Remplaza los caracteres ':' por '":' y '{ ' por '{"', de esta manera las claves estarán entre comillas dobles
        const fixedString = recepciones_my_quality_control_agency_id
            .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
            .replace("{ ", '{"');
        const hashRecepcionesQCAgency = JSON.parse(fixedString ?? "{}");
        const quality_control_agency = hashRecepcionesQCAgency[agency_id];
        //-------------------REACT SELECT VALUES-------------------------
        console.log("values", values);
        const vendor = values.vendor;
        const itemId = values.item;
        const purchaser = values.purchaser;
        const payeeType = values.rType;
        const idNumberInput = values.idNumberInput;
        const discountReason = values.discountReason;
        const issue_date = values.issue_date;
        const esCentroDeAcopio = values?.esCentroDeAcopio === "true";
        const singleBasketWeight = Number(values.singleBasketWeight);
        const recepciones_basket_item_id = Number(values?.recepciones_basket_item_id.toString());
        const rejections = JSON.parse(values.rejections.toString() ?? "[]");
        const provenance = values.selectedProvenance;
        const purchaseOrderGeneralInfo = JSON.parse(values?.purchaseOrderGeneralInfo?.toString() ?? "{}");
        let controlCalidadValues = {
            porcentajeRechazo: values.porcentajeRechazo,
            razonPrincipal: values.razonPrincipal,
            razonSecundaria: values.razonSecundaria,
            razonTerciaria: values.razonTerciaria,
            otrasRazones: values.otrasRazones,
        };
        let keys = Object.keys(values);
        let netWeight = values.netWgt;
        const total_baskets = values.totalBaskets + "";
        const stockInteger = values.stockInteger == "true";
        let webapp_table_object = {};
        const buildArray = (keyIncludes, processValue) => {
            const regex = /\d/; // Expresión regular para buscar al menos un dígito.
            return keys
                .filter((key) => key.includes(keyIncludes) && regex.test(key))
                .map((key) => [
                key.substring(keyIncludes?.length, key?.length),
                processValue(values[key]),
            ])
                .filter(([key, value]) => Number(value) > 0)
                .map(([kv, val]) => `${val}-${kv}`);
        };
        const buildSimpleArray = (keyIncludes, processValue) => {
            const regex = /\d/; // Expresión regular para buscar al menos un dígito.
            return keys
                .filter((key) => key.includes(keyIncludes) && regex.test(key))
                .map((key) => processValue(values[key] === "" || values[key] === "NaN" ? 0 : values[key]));
        };
        const processValues = () => {
            const received_baskets = buildArray("rec", parseInt);
            const qualityControlBaskets = buildArray("qC", parseInt);
            const detail_baskets = buildSimpleArray("basket", parseInt);
            const detail_discounts = buildSimpleArray("discount", parseFloat);
            const detail_weights = buildSimpleArray("weight", parseFloat);
            Object.keys(webapp_table_rejection ?? {})?.forEach((value, index) => {
                const temp = index === 0
                    ? values[value]?.toString()
                    : rejections[index - 1]?.split(";").join(", ") || "";
                webapp_table_object[value] = temp;
            });
            return [
                received_baskets,
                qualityControlBaskets,
                detail_baskets,
                detail_discounts,
                detail_weights,
            ];
        };
        let [received_baskets, qualityControlBaskets, detail_baskets, detail_discounts, detail_weights,] = processValues();
        //========== PRIMERA LLAMADA DE API Y CAPTURA DE ERRORES
        if (apiResponses.apiCall === 2) {
            console.log("========================================>");
            console.log("paso 1: REGISTRANDO NUEVA ORDEN DE COMPRA AUTORIZADA...");
            //build net_weights
            const detail_netWeights = keys
                .filter((key) => key.includes("weight"))
                .map((key, index) => {
                const weight = Number(values[key]);
                const detail_basket = Number(detail_baskets[index]);
                const detail_discount = Number(detail_discounts[index]) ?? 0;
                return ((weight - (stockInteger ? 0 : detail_basket * singleBasketWeight)) *
                    ((100 - detail_discount) / 100));
            });
            const newPurchaseOrderDetails = detail_baskets.map((x, index) => {
                return {
                    reference: `${detail_weights[index]},${x},${detail_discounts[index]}`,
                    item_id: Number(itemId),
                    booked_quantity: detail_netWeights[index],
                    unit_cost: 1,
                };
            });
            const newPurchaseOrderBody = {
                reference: payeeType,
                taxable: false,
                issue_date,
                shipping_date: issue_date,
                incoterm_id: purchaseOrderGeneralInfo?.incoterm_id,
                currency_id: purchaseOrderGeneralInfo?.currency_id,
                charge_term_id: purchaseOrderGeneralInfo?.charge_term_id,
                payee_id: vendor,
                agency_id,
                purchaser_id: Number(purchaser),
                import: false,
                tag_ids: ["", tag_id],
                memo: qualityControlBaskets + "",
                origin: netWeight,
                purchase_order_details: newPurchaseOrderDetails,
                incoterm_destination: provenance.slice(0, 254),
                transport_type: discountReason,
                id_number: idNumberInput,
                ...(esCentroDeAcopio
                    ? { discount: Number(controlCalidadValues.porcentajeRechazo) }
                    : {}),
            };
            console.log("REGISTRANDO ORDEN DE COMPRA: ", JSON.stringify(newPurchaseOrderBody));
            const newAuthorizedPurchaseResponse = await (0, services_1.createNewAuthorizedPurchaseOrder)(headers, newPurchaseOrderBody, false);
            if (newAuthorizedPurchaseResponse?.error ||
                !newAuthorizedPurchaseResponse.data) {
                throw new Error("Error al intentar crear la órden de compra autorizada: " +
                    newAuthorizedPurchaseResponse?.userMsg +
                    " Body: " +
                    JSON.stringify(newPurchaseOrderBody));
            }
            apiResponses.authorizedPO = newAuthorizedPurchaseResponse.data;
            apiResponses.apiCall = apiResponses.apiCall + 1;
        }
        if (apiResponses.apiCall === 3) {
            const createNewReceptionBodyFunction = () => {
                const receptionDetails = {};
                apiResponses.authorizedPO.purchase_order_details.forEach((pod, index) => (receptionDetails[index] = {
                    item_id: `${pod.item_id}`,
                    purchase_order_detail_id: `${pod.id}`,
                    lot_delivered_quantity: [`${pod.booked_quantity}`],
                    lot_name: [apiResponses.authorizedPO.id_number],
                    lot_expire: [
                        new Date(Date.now() + 12096e5).toISOString().split("T")[0],
                    ],
                    lot_description: [received_baskets.join(",")],
                }));
                const newReception = {
                    reception: {
                        agency_id,
                        received_at: issue_date,
                        purchase_order_id: apiResponses.authorizedPO.id + "",
                        entity_id: apiResponses.authorizedPO.entity_id + "",
                        needs_transit: "0",
                        invoice_number: "",
                        reception_details_attributes: receptionDetails,
                    },
                };
                return newReception;
            };
            //first create reception and receive it with the basket shipment
            const newReception = createNewReceptionBodyFunction();
            console.log("========================================>");
            console.log("paso 2: CREANDO RECEPCION, ENVIO DE CANASTAS, WEBAPP TABLE DE RECHAZO DIRECTO");
            console.log("------------ CREANDO RECEPCIÓN.......");
            const responseNewReception = await (0, services_1.createNewReception)(headers, newReception, apiResponses.authorizedPO.id);
            if (responseNewReception.error || !responseNewReception.data) {
                throw new Error("Error al intentar crear la recepción: " +
                    responseNewReception?.userMsg);
            }
            apiResponses.apiCall = apiResponses.apiCall + 1;
        }
        if (apiResponses.apiCall === 4) {
            console.log("------------- REALIZANDO ENVÍO DE CANASTAS A LA AGENCIA");
            const createBasketsShipmentBodyFunction = () => {
                const movementDetails = [];
                received_baskets.forEach((basket, index) => {
                    movementDetails.push({
                        item_id: recepciones_basket_item_id,
                        lot_id: basket.split("-")[1],
                        booked_quantity: basket.split("-")[0],
                    });
                });
                const BasketShipment = {
                    booker_id: Number(purchaser),
                    reference: "Envio de canastas (De proveedor a agencia)",
                    needs_transport: false,
                    planned_delivery: issue_date,
                    agency_from_id: Number(origin_agency),
                    agency_to_id: agency_id,
                    movements: movementDetails,
                };
                return BasketShipment;
            };
            const newBasketShipment = createBasketsShipmentBodyFunction();
            const newShipmentResponse = await (0, services_1.insertBookings)(headers, newBasketShipment, `${apiResponses.authorizedPO.id}`);
            if (newShipmentResponse.error || !newShipmentResponse.data) {
                throw new Error("Error al intentar crear el envío: " +
                    newShipmentResponse?.userMsg +
                    " Body: " +
                    JSON.stringify(newBasketShipment));
            }
            apiResponses.apiCall = apiResponses.apiCall + 1;
            apiResponses.shipment = newShipmentResponse.data;
        }
        if (apiResponses.apiCall === 5) {
            console.log("------------- RECIBIENDO EL ENVÍO DE CANASTAS");
            const getShipmentResponse = await (0, services_1.getDeliveryByBooking)(headers, apiResponses.shipment.id);
            if (getShipmentResponse.error) {
                throw new Error("Error al intentar recibir el envío: " + getShipmentResponse?.userMsg);
            }
            apiResponses.apiCall = apiResponses.apiCall + 1;
        }
        if (!esCentroDeAcopio) {
            //Al momento de este comentario, un ejemplo es que sólo Planta Central no es centro de acopio
            //Ellos si envían canastas a control de calidad.
            //Si es de un centro de acopio, se salta esto...
            if (apiResponses.apiCall === 6 && qualityControlBaskets.length > 0) {
                console.log("------------- REALIZANDO ENVÍO DE CANASTAS A CONTROL DE CALIDAD");
                const total_qc_baskets = Number(values.totalQCBaskets);
                const netWeightByBasket = Number(netWeight) / total_qc_baskets;
                const lotResponse = await (0, services_1.getLoteByName)(session, apiResponses.authorizedPO.id_number);
                if (lotResponse.error || !lotResponse.data || !lotResponse.data.id) {
                    throw new Error("Error al intentar obtener el lote por nombre: " +
                        lotResponse?.userMsg);
                }
                const createQCBasketShipmentBody = async () => {
                    const qcMovementDetails = qualityControlBaskets.map((basket) => {
                        const booked_quantity = Number(basket.split("-")[0]);
                        const lot_id = Number(basket.split("-")[1]);
                        return {
                            item_id: recepciones_basket_item_id,
                            lot_id,
                            booked_quantity,
                            reference: "Canastas a control de calidad.",
                        };
                    });
                    qcMovementDetails.push({
                        item_id: apiResponses.authorizedPO.purchase_order_details[0].item_id,
                        lot_id: Number(lotResponse.data?.id),
                        booked_quantity: total_qc_baskets * netWeightByBasket,
                        reference: "Verduras a control de calidad.",
                    });
                    const qcBasketShipment = {
                        booker_id: Number(purchaser),
                        reference: "Envio de canastas y verduras a CC",
                        needs_transport: false,
                        planned_delivery: issue_date,
                        agency_from_id: agency_id,
                        agency_to_id: quality_control_agency,
                        movements: qcMovementDetails,
                    };
                    return qcBasketShipment;
                };
                const newQCBasketShipment = await createQCBasketShipmentBody();
                const new_qc_shipment_response = await (0, services_1.insertBookings)(headers, newQCBasketShipment, `${apiResponses.authorizedPO.id}`);
                if (!new_qc_shipment_response.data || new_qc_shipment_response.error) {
                    console.log("Body: ", JSON.stringify(newQCBasketShipment));
                    throw new Error("Error al intentar crear el envío a control de calidad: " +
                        new_qc_shipment_response?.userMsg +
                        " Body: " +
                        JSON.stringify(newQCBasketShipment));
                }
                apiResponses.apiCall = apiResponses.apiCall + 1;
                apiResponses.qcShipment = new_qc_shipment_response.data;
            }
            if (apiResponses.apiCall === 7) {
                console.log("------------- RECIBIENDO ENVÍO DE CANASTAS A CONTROL DE CALIDAD");
                const getQCDeliveryResponse = await (0, services_1.getDeliveryByBooking)(headers, apiResponses.qcShipment.id);
                if (getQCDeliveryResponse.error) {
                    throw new Error("Error al intentar recibir el envío de control de calidad: " +
                        getQCDeliveryResponse?.userMsg +
                        " Body: " +
                        JSON.stringify(apiResponses.qcShipment));
                }
                apiResponses.apiCall = apiResponses.apiCall + 1;
            }
            if (apiResponses.apiCall === 8 || qualityControlBaskets.length === 0) {
                if (webapp_table_object.Canastas !== "" &&
                    webapp_table_object.Canastas !== "0") {
                    console.log("----------- Guardando rechazo de canastas directo...... -----------");
                    const responseRechazo = await (0, motivos_rechazo_utils_js_1.saveRechazoCanastas)(headers, session, {
                        temp_purchase_order_id: `${apiResponses.authorizedPO.id}`,
                        webapp_row: {
                            data: webapp_table_object,
                        },
                    });
                    if (responseRechazo.error) {
                        throw new Error("Error al intentar guardar el rechazo de canastas directo: " +
                            responseRechazo?.userMsg);
                    }
                    apiResponses.apiCall = apiResponses.apiCall + 1;
                }
            }
        }
        else {
            //Si es centro de acopio, guardo los motivos de rechazo
            if (controlCalidadValues?.razonPrincipal ||
                controlCalidadValues?.razonSecundaria ||
                controlCalidadValues?.razonTerciaria ||
                controlCalidadValues?.otrasRazones) {
                if (apiResponses.apiCall === 6) {
                    console.log("========================================>");
                    console.log("paso 3: GUARDAR MOTIVOS DE RECHAZO");
                    const saveMotivosResponse = await (0, services_1.saveMotivosDeRechazoByPurchase)(headers, session, {
                        Razon_primaria: `${controlCalidadValues?.razonPrincipal ?? ""}`,
                        Razon_secundaria: `${controlCalidadValues?.razonSecundaria ?? ""}`,
                        Razon_terciaria: `${controlCalidadValues?.razonTerciaria ?? ""}`,
                        Otras_razones: `${controlCalidadValues?.otrasRazones ?? ""}`,
                    }, { temp_purchase_order_id: `${apiResponses.authorizedPO.id}` });
                    if (saveMotivosResponse.error) {
                        throw new Error("Error al intentar guardar los motivos de rechazo: " +
                            saveMotivosResponse?.userMsg);
                    }
                }
            }
        }
        console.log("========================================>");
        console.log("paso 4: ELIMINAR EL REGISTRO DE LA COLA");
        //ELIMINAR EL REGISTRO DE LA COLA
        await (0, _4pinos_receptions_form_history_utils_js_1.deleteQueueFormReceptionHistory)(headers, session, idWebAppTable);
    }
    catch (e) {
        //SI OCURRE ALGÚN ERROR, SE INTENTA GUARDAR EL RETRY
        console.log("========================================>");
        console.log("paso -1: ACTUALIZAR EL REGISTRO DE LA COLA A ERROR");
        await (0, _4pinos_receptions_form_history_utils_js_1.updateQueueFormReceptionHistory)(headers, session, {
            estado: _4pinos_receptions_form_history_utils_js_1.ESTADOS_COLA_RECEPCIONES.ERROR,
            description: e?.toString(),
            apiResponses,
        }, idWebAppTable);
    }
};
exports.register4pinosReception = register4pinosReception;
const retryPO = async (register, session, headers, hostname, cookie) => {
    console.log("REINTENTO DE REGISTRO DE ORDEN DE COMPRA =======================>");
    if (!register.data.apiResponses || register.data.apiResponses.apiCall === 1) {
        const responsePOSearch = await (0, services_1.getPurchasesOrderByIdNumber)(session, register.data?.formSubmited?.idNumberInput);
        if (responsePOSearch.error || !responsePOSearch.data) {
            console.error("Validate Exists: ", responsePOSearch.userMsg);
            return {
                error: true,
                title: "No se logró comunicar con la red.",
                type: "error",
                description: `No hay comunicación con la red para el reintento - Validate Exists: ${responsePOSearch.userMsg}`,
            };
        }
        const existentes = responsePOSearch?.data?.filter((x) => !x.voided);
        if (existentes?.length > 0) {
            const msg = `Ya existe una órden de compra con este número de contraseña asociado, revise el listado general. Peso: ${existentes[0].due}, Ingresado el: ${(0, common_1.getFormattedDate)(existentes[0].issue_date)}, Memo: ${existentes[0].memo}, Tipo: ${existentes[0].reference}`;
            console.error(msg);
            await (0, _4pinos_receptions_form_history_utils_js_1.updateQueueFormReceptionHistory)(headers, session, {
                description: msg,
                estado: _4pinos_receptions_form_history_utils_js_1.ESTADOS_COLA_RECEPCIONES.ERROR,
            }, register.id);
            return {
                error: true,
                title: "No se puede crear la órden de compra.",
                type: "error",
                description: msg,
            };
        }
    }
    const queueResponse = await (0, _4pinos_receptions_form_history_utils_js_1.updateQueueFormReceptionHistory)(headers, session, {
        estado: _4pinos_receptions_form_history_utils_js_1.ESTADOS_COLA_RECEPCIONES.REINTENTANDO,
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
        console.log("------- EJECUTANDO LOCALMENTE", ` para ${register.data?.formSubmited?.idNumberInput}`);
        (0, exports.register4pinosReception)({
            values: register.data?.formSubmited,
            cookie,
            idWebAppTable: register.id,
            agency_id: register.data?.agency_id,
            originApiResponses: register.data?.apiResponses,
        });
    }
    else {
        console.log("------- ENVIANDO A EJECUTAR NETLIFY FUNCTION: 4pinosNewPurchaseOrder-background", ` para ${register.data?.formSubmited?.idNumberInput}`);
        fetch(`https://${hostname}/.netlify/functions/4pinosNewPurchaseOrder-background`, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                values: register.data?.formSubmited,
                cookie,
                idWebAppTable: register.id,
                agency_id: register.data?.agency_id,
                originApiResponses: register.data?.apiResponses,
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
exports.retryPO = retryPO;
