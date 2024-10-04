export declare const register4pinosShipment: ({ cookie, idWebAppTable, agency_id, values, }: {
    cookie: string;
    idWebAppTable: number;
    agency_id: number;
    values: {
        agency_from: number;
        transporter_id: number;
        date: string;
        shipment_number: string;
        agency_to: number;
        purchase_orders: {
            id: number;
            lot_id: number;
        }[];
    };
}) => Promise<void>;
