import { Session } from "@remix-run/node";
import { getHeaders, getSession } from "@zauru-sdk/services";
import { QueueShipmentsForm } from "@zauru-sdk/types";
import { WebAppRowGraphQL } from "@zauru-sdk/types";
import { updateQueueShipmentsFormHistory } from "./4pinos-shipments-form-history.utils.js";
import { ESTADOS_COLA_RECEPCIONES } from "./4pinos-receptions-form-history.utils.js";

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

export const retryShipmennt = async (
  register: WebAppRowGraphQL<QueueShipmentsForm>,
  session: Session,
  headers: any,
  hostname: string,
  cookie: string | null
) => {
  console.log("REINTENTO DE REGISTRO DE ENVÍO =======================>");

  const queueResponse = await updateQueueShipmentsFormHistory(
    headers,
    session,
    {
      estado: ESTADOS_COLA_RECEPCIONES.REINTENTANDO,
    },
    register.id
  );

  if (queueResponse.error || !queueResponse.data?.id) {
    return {
      error: true,
      title: "No se logró comunicar con la red.",
      type: "error",
      description: `No hay comunicación con la red para el reintento: ${queueResponse?.userMsg}`,
    };
  }

  if (hostname.includes("localhost")) {
    console.log(
      "------- EJECUTANDO LOCALMENTE",
      ` para ${register.data?.formSubmited?.shipment_number}`
    );
    register4pinosShipment({
      values: register.data?.formSubmited,
      cookie: cookie || "",
      idWebAppTable: register.id,
      agency_id: register.data?.agency_id,
    });
  } else {
    console.log(
      "------- ENVIANDO A EJECUTAR NETLIFY FUNCTION: 4pinosNewShipment-background",
      ` para ${register.data?.formSubmited?.shipment_number}`
    );
    fetch(
      `https://${hostname}/.netlify/functions/4pinosNewShipment-background`,
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          values: register.data?.formSubmited,
          cookie: cookie || "",
          idWebAppTable: register.id,
          agency_id: register.data?.agency_id,
        }),
      }
    );
  }

  return {
    error: false,
    title: "Reintento iniciado con éxito.",
    type: "success",
    description: `Se está procesando el reintento de ingreso de recepción!.`,
  };
};
