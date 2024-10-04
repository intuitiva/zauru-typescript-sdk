import { getHeaders, getSession } from "@zauru-sdk/services";

export const register4pinosShipment = async ({
  cookie,
  idWebAppTable,
  agency_id,
  values,
}: {
  cookie: string;
  idWebAppTable: number;
  agency_id: number;
  values: {
    agency_from: number;
    transporter_id: number;
    date: string;
    shipment_number: string;
    agency_to: number;
    purchase_orders: { id: number; lot_id: number }[];
  };
}) => {
  const session = await getSession(cookie);
  const headers = await getHeaders(cookie, session);

  console.log(values);
};
