import { getDatePickerCurrentDate, handlePossibleAxiosErrors, reduceAdd, } from "@zauru-sdk/common";
import { getDeliveryByBooking, getMyAgencyLotStocks, getShipmentsByToAgencyLast100Id_booking, getVariablesByName, insertBookings, } from "@zauru-sdk/services";
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getShipmentsToMyAgency = async (session) => {
    return handlePossibleAxiosErrors(async () => {
        const response = await getShipmentsByToAgencyLast100Id_booking(session, session.get("agency_id"));
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar los envíos a mi agencia actual: ${response.userMsg}`);
        }
        return response?.data ?? [];
    });
};
/**
 *
 * @param headers
 * @param session
 * @param props
 * @returns
 */
export const shipmentToVirtualClientAgency = async (headers, session, props) => {
    return handlePossibleAxiosErrors(async () => {
        const { virtual_client_agency_id } = await getVariablesByName(headers, session, ["virtual_client_agency_id"]);
        let bookingBody = {};
        if (props?.esPerecedero) {
            const responseStocks = await getMyAgencyLotStocks(session);
            if (!responseStocks.data || responseStocks.error) {
                throw new Error(`Ocurrió un error al tratar de obtener los stocks de mi agencia. ${responseStocks.userMsg}`);
            }
            let deliverQuantity = props.deliver_quantity;
            const itemStocks = responseStocks.data
                .filter((x) => x.lot.item_id === props.item_id)
                .sort((a, b) => b.available - a.available);
            if (itemStocks.map((x) => x.available).reduce(reduceAdd, 0) <
                props.deliver_quantity) {
                throw new Error(`No hay suficiente stock en los lotes para realizar el descuento.`);
            }
            const movements = itemStocks.reduce((acc, stock) => {
                if (deliverQuantity > 0 && stock.available > 0) {
                    const bookedQuantity = Math.min(stock.available, deliverQuantity);
                    deliverQuantity -= bookedQuantity;
                    acc.push({
                        item_id: props.item_id,
                        booked_quantity: bookedQuantity,
                        lot_id: stock.lot_id,
                    });
                }
                return acc;
            }, []);
            bookingBody = {
                reference: "LABORATORIO - Descuento de stock, desde webapp.",
                agency_from_id: session.get("agency_id"),
                agency_to_id: Number(virtual_client_agency_id),
                booker_id: session.get("employee_id"),
                transporter_id: session.get("employee_id"),
                planned_delivery: getDatePickerCurrentDate(),
                needs_transport: false,
                movements,
            };
        }
        else {
            bookingBody = {
                reference: "LABORATORIO - Descuento de stock, desde webapp.",
                agency_from_id: session.get("agency_id"),
                agency_to_id: Number(virtual_client_agency_id),
                booker_id: session.get("employee_id"),
                transporter_id: session.get("employee_id"),
                planned_delivery: getDatePickerCurrentDate(),
                needs_transport: false,
                movements: [
                    { item_id: props.item_id, booked_quantity: props.deliver_quantity },
                ],
            };
        }
        const response1 = await insertBookings(headers, bookingBody);
        if (response1.error || !response1.data) {
            throw new Error(`Ocurrió un error al tratar de crear el envío a agencia virtual de cliente: ${response1.userMsg}`);
        }
        //Entregar el envío
        const response2 = await getDeliveryByBooking(headers, response1.data.id);
        if (response2.error || !response2.data) {
            throw new Error(`Ocurrió un error al tratar de recibir: ${response1.userMsg}`);
        }
        return true;
    });
};
