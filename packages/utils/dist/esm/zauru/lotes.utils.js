import { getLote, getLotesFiltered, getPurchase, getVariablesByName, } from "@zauru-sdk/services";
import { getPurchaseOrderDataTables } from "./purchase-orders.utils.js";
/**
 * Obtiene el listado de ordenes de compra, formateado especialmente para armar la tabla de edición de porcentajes de rechazo
 * @param headers
 * @param session
 * @returns
 */
export const getLotesFormated = async (headers, session) => {
    //PASO 1: Obtengo las variables, para buscar mi tag_id y mi basket_id
    const { recepciones_basket_item_id: basket_id, production_agency_id /**{5693: 5696} */, } = await getVariablesByName(headers, session, [
        "recepciones_basket_item_id",
        "production_agency_id",
    ]);
    const hashAgencyId = JSON.parse(production_agency_id ?? "{}");
    const agency_id = hashAgencyId[session.get("agency_id")];
    //PASO 2: Busco mis lotes
    if (agency_id) {
        return await getLotesFiltered(headers, agency_id, false, Number(basket_id));
    }
    return [];
};
/**
 * Obtiene toda la información de lote, con las canastas y razones de rechazo
 * @param headers
 * @param session
 * @returns
 */
export const getLoteDescription = async (headers, session, lote_id) => {
    //PASO 1: Obtengo las variables, para buscar mi basket_id
    const { production_agency_id /**{5693: 5696} */ } = await getVariablesByName(headers, session, ["production_agency_id"]);
    const hashAgencyId = JSON.parse(production_agency_id ?? "{}");
    const agency_id = hashAgencyId[session.get("agency_id")];
    //PASO 2: Busco mi lote
    const lote = await getLote(headers, lote_id, agency_id);
    //PASO 3: Obtener listado de canastas enviadas a bodega control de calidad
    //El primer paso es ubicar la orden de compra original, la cual permitirá ubicar el envío que se
    //realizó a la bodega de control de calidad
    const purchase_order = await getPurchaseOrderDataTables(headers, lote.name.replace("-RETENIDO", "") // por si trae la palabra RETENIDO,
    );
    //PASO 4: Obtener los envíos asociados a la orden de compra
    const purchaseResponse = await getPurchase(headers, purchase_order.no_orden);
    return {
        lote,
        purchase_order,
        purchase: purchaseResponse.data,
    };
};
