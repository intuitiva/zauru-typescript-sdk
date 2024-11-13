import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getShipmentsStringQuery } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";
/**
 * getShipments
 */
export async function getShipments(session, config) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const query = getShipmentsStringQuery({
            agency_to_id: config.agency_to_id
                ? Number(config.agency_to_id)
                : undefined,
            agency_from_id: config.agency_from_id
                ? Number(config.agency_from_id)
                : undefined,
            suffix: config.suffix,
            id_number: config.id_number,
            id_number_not_null: config.id_number_not_null,
            id_number_not_empty: config.id_number_not_empty,
            withMovementLots: config.withMovementLots,
            memoILike: config.memoILike,
            voided: config.voided,
            delivered: config.delivered,
            shipped: config.shipped,
            returned: config.returned,
        });
        const response = await httpGraphQLAPI.post("", {
            query,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.shipments;
        return registers;
    });
}
/**
 * receiveShipment_booking
 * @param headers
 * @param id
 * @returns
 */
export async function receiveShipment_booking(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        const response = await httpZauru.get(`/inventories/bookings/${id}/deliver.json`, { headers });
        if (!response.data) {
            throw new Error("Sin respuesta de: /inventories/bookings/id/deliver.json");
        }
        return true;
    });
}
/**
 * despacharShipment_booking
 * Esta función cambia el atributo 'shipment' de los envíos a 'true', lo que indica que el envío está en tránsito.
 * Esto es utilizado para marcar los envíos que necesitan ser entregados en las tablas como "En tránsito".
 * @param headers
 * @param id
 * @returns
 */
export async function despacharShipment_booking(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.get(`/inventories/bookings/${id}/ship`, { headers });
        return true;
    });
}
/**
 * deleteShipment_booking
 * Esta función se utiliza para cancelar una Reservación, cancelando un shipment que todavía no ha sido puesto en tránsito ni entregado. Está cancelando prácticamente la primera fase, el borrador.
 * @param headers
 * @param id
 * @returns
 */
export async function deleteShipment_booking(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/inventories/bookings/${id}.json?destroy=true`, {
            headers,
        });
        return true;
    });
}
