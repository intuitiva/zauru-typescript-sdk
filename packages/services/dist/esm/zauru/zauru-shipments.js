import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
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
            ...config,
            agency_to_id: config.agency_to_id
                ? Number(config.agency_to_id)
                : undefined,
            agency_from_id: config.agency_from_id
                ? Number(config.agency_from_id)
                : undefined,
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
        await httpZauru.get(`/inventories/bookings/${id}/deliver.json`, {
            headers,
        });
        return true;
    });
}
export async function receiveTransit(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            shipment: {
                ...body,
                movements_attributes: arrayToObject(body.movements),
            },
        };
        delete sendBody.shipment.movements;
        await httpZauru.put(`/inventories/transits/${body.id}.json`, sendBody, {
            headers,
        });
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
