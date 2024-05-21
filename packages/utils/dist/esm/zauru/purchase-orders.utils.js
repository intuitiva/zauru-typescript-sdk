import { CURRENCY_PREFIX, getNewDateByFormat, getStringFullDate, getZauruDateByText, handlePossibleAxiosErrors, } from "@zauru-sdk/common";
import { commitSession, createNewPurchaseOrder, deleteDelivery, deletePurchaseOrder, deleteReception, generateDistinctCode, getLotesWithPurchaseFormated, getPurchaseOrder, getPurchasesListDataTables, getVariablesByName, inactivarLote, updateReceivedPurchaseOrder, } from "@zauru-sdk/services";
/**
 * Obtiene el listado de ordenes de compra, formateado especialmente para armar la tabla de edición de porcentajes y tolerancia
 * @param headers
 * @param session
 * @returns
 */
export const getPurchasesDataTableListFormated = async (headers, session, params) => {
    return handlePossibleAxiosErrors(async () => {
        //PASO 1: Obtengo las variables, para buscar mi tag_id y mi basket_id
        const { recepciones_tag_id: tag_id, recepciones_basket_item_id: basket_id, production_agency_id: temp_production_agency_id, } = await getVariablesByName(headers, session, [
            "recepciones_tag_id",
            "recepciones_basket_item_id",
            "production_agency_id",
        ]);
        const hashProductionAgencyId = JSON.parse(temp_production_agency_id ?? "{}");
        const production_agency_id = hashProductionAgencyId[session.get("agency_id")];
        const agency_id = params.from_production_agency_id
            ? production_agency_id
            : session.get("agency_id");
        //PASO 2: Busco mis ordenes de compra
        const ordersDataTablesResponse = await getOrdersDataTables(headers, params?.page ? Number(params?.page) : 1, params?.perPage ? Number(params?.perPage) : 10, params?.search ?? "", tag_id, agency_id);
        if (ordersDataTablesResponse.error) {
            throw new Error(ordersDataTablesResponse.userMsg);
        }
        const ordersDataTables = ordersDataTablesResponse?.data;
        //PASO 3: Busco mis lotes
        const lotesResponse = await getLotesWithPurchaseFormated(headers, agency_id, Number(basket_id), ordersDataTables?.orders ?? {}, ordersDataTables?.desde, ordersDataTables?.hasta);
        if (lotesResponse.error) {
            throw new Error(lotesResponse.userMsg);
        }
        //PASO 4: Retorno la información
        return {
            recordsTotal: ordersDataTables?.recordsTotal ?? 0,
            recordsFiltered: ordersDataTables?.recordsFiltered ?? 0,
            draw: ordersDataTables?.draw ?? 0,
            data: lotesResponse?.data ?? [],
        };
    });
};
/**
 *
 * @param headers
 * @param tag_id
 * @param agency_id
 * @param page
 * @param perPage
 * @param search
 * @returns
 */
const getOrdersDataTables = async (headers, page, perPage, search, tag_id, agency_id) => {
    return handlePossibleAxiosErrors(async () => {
        const body = {
            order: { "0": { column: "1", dir: "desc" } },
            start: ((page ?? 1) - 1) * (perPage ?? 0),
            length: perPage ?? 0,
            search: { value: search ?? "", regex: false },
            tag: tag_id,
            agency: agency_id,
        };
        //Voy por las ordenes y las ordeno por fecha de recepción
        const ordersDataTablesResponse = await getPurchasesListDataTables(headers, body);
        const ordersDataTables = ordersDataTablesResponse.data;
        const orders = ordersDataTables?.data.sort((a, b) => getNewDateByFormat(a.rd).getTime() - getNewDateByFormat(b.rd).getTime());
        const purchaseOrders = {};
        orders?.forEach((value) => {
            const id_i_pos = value.z.indexOf("purchase_orders/") + 16;
            const id_f_pos = value.z.indexOf('">');
            const zid_f_pos = value.z.indexOf("</a>");
            const id_n_i_pos = value.i.indexOf(">");
            const id_n_f_pos = value.i.indexOf("</a>");
            const new_date = getNewDateByFormat(value.dte);
            const ven_i_pos = value.ven.indexOf('">');
            const ven_f_pos = value.ven.indexOf("</a>");
            const id_number = value.i.substring(id_n_i_pos + 1, id_n_f_pos);
            const purchase_id = value.DT_RowId.replace("purchases-purchase-order-", "");
            purchaseOrders[id_number] = {
                id: value.z.substring(id_i_pos, id_f_pos),
                zid: value.z.substring(id_f_pos + 2, zid_f_pos),
                id_number: Number(id_number),
                no_orden: Number(purchase_id),
                dte: new_date,
                o: Boolean(value.o),
                vendor: value.ven.substring(ven_i_pos + 2, ven_f_pos),
                po_editable: parseInt(value.due.substring(1)) > 0,
                dis: Number(value.dis),
                och: Number(value.och),
                rd: value.rd,
            };
        });
        return {
            orders: purchaseOrders,
            draw: ordersDataTables?.draw ?? 0,
            recordsFiltered: ordersDataTables?.recordsFiltered ?? 0,
            recordsTotal: ordersDataTables?.recordsTotal ?? 0,
            desde: orders?.length ? getZauruDateByText(orders[0].rd) : undefined,
            hasta: orders?.length
                ? getZauruDateByText(orders[orders.length - 1].rd)
                : undefined,
        };
    });
};
/**
 * getPurchaseOrderDataTables Obtiene una orden de compra ya formateada con todos sus campos.
 * @param headers
 * @param tag_id
 * @param agency_id
 * @param search
 * @returns
 */
export const getPurchaseOrderDataTables = async (headers, search, tag_id, agency_id) => {
    const body = {
        order: { "0": { column: "1", dir: "desc" } },
        start: 0,
        length: 0,
        search: { value: search, regex: false },
        tag: tag_id,
        agency: agency_id,
    };
    //Voy por las ordenes y las ordeno por fecha de recepción
    const ordersDataTablesResponse = await getPurchasesListDataTables(headers, body);
    const ordersDataTables = ordersDataTablesResponse.data;
    const getPurchaseOrderFormated = (value) => {
        const id_i_pos = value.z.indexOf("purchase_orders/") + 16;
        const id_f_pos = value.z.indexOf('">');
        const zid_f_pos = value.z.indexOf("</a>");
        const id_n_i_pos = value.i.indexOf(">");
        const id_n_f_pos = value.i.indexOf("</a>");
        const new_date = getNewDateByFormat(value.dte);
        const ven_i_pos = value.ven.indexOf('">');
        const ven_f_pos = value.ven.indexOf("</a>");
        const id_number = value.i.substring(id_n_i_pos + 1, id_n_f_pos);
        const purchase_id = value.DT_RowId.replace("purchases-purchase-order-", "");
        return {
            id: value.z.substring(id_i_pos, id_f_pos),
            zid: value.z.substring(id_f_pos + 2, zid_f_pos),
            id_number: Number(id_number),
            no_orden: Number(purchase_id),
            dte: new_date,
            o: Boolean(value.o),
            vendor: value.ven.substring(ven_i_pos + 2, ven_f_pos),
            po_editable: parseInt(value.due.substring(1)) > 0,
            dis: Number(value.dis),
            och: Number(value.och),
            rd: value.rd,
        };
    };
    !ordersDataTables?.data?.length &&
        console.log("========== NO SE ENCONTRO NINGUNA ORDEN DE COMPRA ===========");
    const purchaseOrderDataTable = getPurchaseOrderFormated(ordersDataTables?.data[0]);
    return purchaseOrderDataTable;
};
/**
 * updatePurchaseItemPrice
 * @param headers
 * @param data
 * @param purchase_id
 */
export const updatePurchaseItemPrice = async (headers, data, purchase_id) => {
    return handlePossibleAxiosErrors(async () => {
        const body = {
            purchase_order: {
                purchase_order_details_attributes: data.purchase_order_details_attributes,
            },
        };
        const responseUpdate = await updateReceivedPurchaseOrder(headers, body, purchase_id);
        if (responseUpdate.error) {
            throw new Error(responseUpdate.userMsg);
        }
        return true;
    });
};
/**
 * updateOchAndDis
 * @param headers
 * @param session
 * @returns
 */
export const updateOchAndDis = async (headers, data, purchase_id) => {
    return handlePossibleAxiosErrors(async () => {
        const body = {
            purchase_order: {
                discount: data?.discount,
            },
        };
        if (data.other_charges) {
            body.purchase_order.other_charges = Number(data.other_charges);
        }
        await updateReceivedPurchaseOrder(headers, body, purchase_id);
        return true;
    });
};
/**
 * updatePurchaseOrderReception
 * @param headers
 * @param data
 * @param purchase_id
 * @returns
 */
export const updatePurchaseOrderReception = async (headers, data, purchase_id) => {
    return handlePossibleAxiosErrors(async () => {
        const body = {
            purchase_order: {
                payee_id: data.payee_id,
                purchase_order_details_attributes: data.purchase_order_details_attributes,
            },
        };
        await updateReceivedPurchaseOrder(headers, body, purchase_id);
        return true;
    });
};
/**
 * Obtengo los id's de las órdenes de compra en un arreglo numérico
 * @param headers
 * @param session
 * @param extraParams
 * @returns
 */
export const getOrderIDS = async (headers, session, extraParams) => {
    return handlePossibleAxiosErrors(async () => {
        const { recepciones_tag_id: tag_id } = await getVariablesByName(headers, session, ["recepciones_tag_id", "recepciones_basket_item_id"]);
        const body = {
            order: { "0": { column: "1", dir: "desc" } },
            start: 0,
            length: 2000, //para ir por todas
            search: { value: "", regex: false },
            tag: tag_id,
            agency: session.get("agency_id") ?? undefined,
            vendor: extraParams.vendor,
            vendor_category: extraParams.vendor_category,
            item: extraParams.item,
            Desde: extraParams.desde,
            Hasta: extraParams.hasta,
        };
        //Voy por las ordenes y las ordeno por fecha de recepción
        const ordersDataTablesResponse = await getPurchasesListDataTables(headers, body);
        const ordersDataTables = ordersDataTablesResponse.data;
        return (ordersDataTables?.data?.map((x) => Number(x.DT_RowId.replace("purchases-purchase-order-", ""))) ?? []);
    });
};
/**
 * deleteOrder
 * @returns
 */
export const deletePurchaseOrderProcess = async (headers, session, id) => {
    return handlePossibleAxiosErrors(async () => {
        const { data: purchaseOrder, error: poError, userMsg: poUserMsg, } = await getPurchaseOrder(session, id);
        if (poError || !purchaseOrder) {
            throw new Error(poUserMsg);
        }
        //Elimino las recepciones si es que tiene
        for (const reception of purchaseOrder.receptions) {
            if (reception.received && !reception.voided) {
                const responseDeleteReception = await deleteReception(headers, reception.id, purchaseOrder.id);
                if (responseDeleteReception.error || !responseDeleteReception.data) {
                    throw new Error(responseDeleteReception.userMsg);
                }
            }
        }
        //Elimino los envíos si es que tiene
        for (const ship of purchaseOrder.shipment_purchase_orders) {
            const responseDeleteShip = await deleteDelivery(headers, ship.shipment_id);
            if (responseDeleteShip.error || !responseDeleteShip.data) {
                throw new Error(responseDeleteShip.userMsg);
            }
        }
        //Inactivo los lotes que tenga
        for (const lot of purchaseOrder.lots) {
            await inactivarLote(headers, lot.id);
        }
        const responseDeletePO = await deletePurchaseOrder(headers, id);
        if (responseDeletePO.error) {
            throw new Error(responseDeletePO.userMsg);
        }
        return true;
    });
};
/**
 * Commitea una task iniciada para la pantalla de edición masiva de órdenes de compra
 * @param session
 * @param ordenes
 * @param timeStamp
 */
export const commitTask = async (session, ordenes, timeStamp) => {
    const newTask = {
        timeStamp,
        iniciada: getStringFullDate(new Date()),
        total_ordenes: ordenes.length,
        completadas: 0,
    };
    const updateTasks = (session.get("updateTasks") ?? []);
    session.set("updateTasks", [...updateTasks, newTask]);
    await commitSession(session);
};
/**
 * Comitea una task finalizada para la pantalla de edición de órdenes de compra masiva
 * @param session
 * @param timeStamp
 */
export const commitEndTask = async (session, timeStamp) => {
    let updateTasks = session.get("updateTasks");
    if (Array.isArray(updateTasks) &&
        updateTasks.some((task) => task.timeStamp === timeStamp)) {
        updateTasks = updateTasks.map((x) => {
            if (x.timeStamp === timeStamp) {
                return {
                    ...x,
                    completadas: Number(x.completadas) + 1,
                };
            }
            return x;
        });
        session.set("updateTasks", updateTasks);
        await commitSession(session);
    }
};
/**
 * Elimina de la sesión una task.
 * @param session
 * @param timeStamp
 */
export const deleteTask = async (session, timeStamp) => {
    let updateTasks = session.get("updateTasks");
    if (Array.isArray(updateTasks) &&
        updateTasks.some((task) => task.timeStamp === timeStamp)) {
        //La elimino de la lista
        updateTasks = updateTasks.filter((task) => task.timeStamp !== timeStamp);
        session.set("updateTasks", updateTasks);
        await commitSession(session);
        return true;
    }
    return false;
};
/**
 * createNewLabItemRequest
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export const createNewLabItemRequest = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_charge_term_default_id, lab_agency_id, laboratory_proyect_id } = await getVariablesByName(headers, session, [
            "lab_charge_term_default_id",
            "lab_agency_id",
            "laboratory_proyect_id",
        ]);
        const id_number = generateDistinctCode("POLAB");
        const insumos = JSON.parse(body.insumos);
        const sendBody = {
            ...body,
            shipping_date: body.issue_date,
            charge_term_id: Number(lab_charge_term_default_id),
            agency_id: Number(lab_agency_id),
            currency_id: CURRENCY_PREFIX.find((x) => x.prefix === "Q")?.id,
            incoterm_id: 1,
            taxable: false,
            import: false,
            id_number,
            reference: "LABORATORIO - Solicitud de insumos desde WebApp",
            origin: "LABORATORIO",
            purchase_order_details: insumos.map((x) => {
                return {
                    booked_quantity: x.booked_quantity,
                    item_id: x.item_id,
                    unit_cost: 1,
                    tag_id: Number(laboratory_proyect_id),
                };
            }),
            taggings: [{ tag_id: Number(laboratory_proyect_id) }],
        };
        const response = await createNewPurchaseOrder(headers, sendBody);
        if (!response.data || response.error) {
            throw new Error("Ocurrió un error al crear la recepción de insumos: " + response.userMsg);
        }
        return response.data;
    });
};
