import { Session } from "@remix-run/node";
import { QueueShipmentsForm } from "@zauru-sdk/types";
import { WebAppRowGraphQL } from "@zauru-sdk/types";
export declare const register4pinosShipment: ({ cookie, idWebAppTable, values, }: {
    cookie: string;
    idWebAppTable: number;
    values: {
        agency_from: number;
        transporter_id: number;
        planned_shipping: string;
        planned_delivery: string;
        shipment_number: string;
        agency_to: number;
        purchase_orders: {
            id: number;
            lot_id: number;
        }[];
    };
}) => Promise<void>;
export declare const retryShipmennt: (register: WebAppRowGraphQL<QueueShipmentsForm>, session: Session, headers: any, hostname: string, cookie: string | null) => Promise<{
    error: boolean;
    title: string;
    type: string;
    description: string;
}>;
