import type { Session } from "@remix-run/node";
import {
  getBasketsSchema,
  handlePossibleAxiosErrors,
  reduceAdd,
  truncateDecimals,
} from "@zauru-sdk/common";
import {
  AxiosUtilsResponse,
  ItemAssociatedLots,
  LotGraphQL,
  LotStockGraphQL,
  LoteDescription,
  LoteProcesadoSchema,
  LoteSchema,
  LoteWithPurchaseFormatedSchema,
  ObjectKeyString,
  PoBasketType,
  PurchasesDataTableListFormatedSchema,
  UpdateLoteBody,
} from "@zauru-sdk/types";
import moment from "moment";
import { getGraphQLAPIHeaders, getVariablesByName } from "../common.server.js";
import httpZauru from "./httpZauru.server.js";
import { createLoteRecord } from "./zauru-lote-record.server.js";
import httpGraphQLAPI from "./httpGraphQL.server.js";
import {
  getLotStocksByAgencyIdStringQuery,
  getLotsByNameStringQuery,
} from "@zauru-sdk/graphql";
import { getDeliveriesDataTables } from "./zauru-deliveries.server.js";

/**
 * getBasketsLots
 * @param headers
 * @param session
 * @returns
 */
export const getBasketsLots = async (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<ItemAssociatedLots>> => {
  return handlePossibleAxiosErrors(async () => {
    const { recepciones_basket_item_id } = await getVariablesByName(
      headers,
      session,
      ["recepciones_basket_item_id"]
    );

    const basketLotsResponse = await httpZauru.get<ItemAssociatedLots>(
      `/inventories/lots/${recepciones_basket_item_id}/item`,
      { headers }
    );

    const poBasket: PoBasketType = {};
    basketLotsResponse?.data?.lots.map(
      (basket: any) =>
        (poBasket[basket.name] = {
          lot_id: basket.id,
          rBaskets: 0,
          qcBaskets: 0,
        })
    );

    return {
      ...basketLotsResponse.data,
      recepciones_basket_item_id: Number(recepciones_basket_item_id),
      poBasket,
    } as ItemAssociatedLots;
  });
};

//LIBERAR/RETENER LOTES
/**
 *
 * @param headers
 * @param lot_id
 * @param lot_name
 * @returns
 */
export const retenerLote = async (
  headers: any,
  session: Session,
  lot_id: string,
  lot_name: string
) => {
  await httpZauru.patch(
    `/inventories/lots/${lot_id}.json`,
    { lot: { name: `${lot_name}-RETENIDO` } },
    { headers }
  );

  return await createLoteRecord(headers, session, {
    agency_id: session.get("agency_id"),
    created_at: moment().toISOString(),
    employee_id: session.get("employee_id"),
    employee_name: session.get("name"),
    lote_id: lot_id,
    lote_name: lot_name,
    retenido: 1,
  });
};

/**
 *
 * @param headers
 * @param lot_id
 * @param lot_name
 * @returns
 */
export const liberarLote = async (
  headers: any,
  session: Session,
  lot_id: string,
  lot_name: string
) => {
  await httpZauru.patch(
    `/inventories/lots/${lot_id}.json`,
    { lot: { name: `${lot_name.split("-")[0]}` } },
    { headers }
  );

  return await createLoteRecord(headers, session, {
    agency_id: session.get("agency_id"),
    created_at: moment().toISOString(),
    employee_id: session.get("employee_id"),
    employee_name: session.get("name"),
    lote_id: lot_id,
    lote_name: lot_name,
    retenido: 0,
  });
};

/**
 * getLote Function for get all details of the current lote
 * @param headers
 * @param agency_id
 * @returns
 */
export async function getLote(
  headers: any,
  lot_id: number | string,
  agency_id?: string
): Promise<LoteDescription> {
  const response = await httpZauru.get<LoteDescription>(
    `/inventories/lots/${lot_id}.json`,
    {
      headers,
    }
  );

  //Paso de 23-1234-VERDE, 34-34242-AZUL => a un objeto completo de canastas
  const baskets = getBasketsSchema(response.data.description);
  response.data.description_baskets = baskets;

  //Calculo el total de canastas, la suma de todas
  response.data.baskets_quantity = baskets
    .map((x) => x.total)
    .reduce(reduceAdd, 0);

  if (agency_id) {
    //Saco el available actual
    response.data.stock_actual = response.data.stocks[
      agency_id
    ] as LotStockGraphQL;
    //El available by basket
    response.data.availableByBaskets =
      Number(response.data.stock_actual.available) /
      response.data.baskets_quantity;
  }

  return response.data;
}

/**
 * getLoteByName
 * @param headers
 * @param lot_name
 * @returns
 */
export async function getLoteByName(
  session: Session,
  lot_name: string
): Promise<AxiosUtilsResponse<LotGraphQL>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { lots: LotGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getLotsByNameStringQuery,
        variables: {
          name: lot_name,
          entity_id: session.get("selectedEntity"),
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(
        `Ocurrió un error al obtener el lote por nombre: ${response.data.errors
          .map((x) => x.message)
          .join(";")}`
      );
    }

    if (response?.data?.data.lots?.length <= 0) {
      throw new Error(
        `No se encontró ningún resultado para el name del lote enviado: ${lot_name}`
      );
    }

    const registerFound = response.data?.data?.lots[0];

    return registerFound;
  });
}

/**
 * getMyAgencyLotStocks
 * @param session
 * @returns
 */
export async function getMyAgencyLotStocks(
  session: Session
): Promise<AxiosUtilsResponse<LotStockGraphQL[]>> {
  return handlePossibleAxiosErrors(async () => {
    const headers = await getGraphQLAPIHeaders(session);

    const response = await httpGraphQLAPI.post<{
      data: { lot_stocks: LotStockGraphQL[] };
      errors?: {
        message: string;
        extensions: { path: string; code: string };
      }[];
    }>(
      "",
      {
        query: getLotStocksByAgencyIdStringQuery,
        variables: {
          agency_id: session.get("agency_id"),
        },
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(
        `Ocurrió un error al obtener el stock de lotes por agencia: ${response.data.errors
          .map((x) => x.message)
          .join(";")}`
      );
    }

    if (response?.data?.data.lot_stocks?.length <= 0) {
      throw new Error(
        `No se encontró ningún resultado para el stock de lotes por agencia: ${session.get(
          "agency_id"
        )}`
      );
    }

    const registerFound = response.data?.data?.lot_stocks;

    return registerFound;
  });
}

/**
 * getLote Function for get all details of the current lote
 * @param headers
 * @param agency_id
 * @returns
 */
export async function updateLote(
  headers: any,
  lot_id: number,
  updatedData: UpdateLoteBody
): Promise<any> {
  const response = await httpZauru.patch<any>(
    `/inventories/lots/${lot_id}.json`,
    updatedData,
    {
      headers,
    }
  );

  return response.data;
}

/**
 * getLotesExportJSON Function for get all zauru lotes by id_agencia
 * @param headers
 * @param agency_id
 * @returns
 */
export async function getLotesExportJSON(
  headers: any,
  agency_id: string,
  desde?: string,
  hasta?: string
): Promise<LoteSchema[]> {
  const response = await httpZauru.get<LoteSchema[]>(
    `/inventories/lots/lots_export.json`,
    {
      headers,
      params: {
        warehouse: agency_id,
        //Desde: desde,
        //Hasta: hasta,
      },
    }
  );

  return response.data;
}

/**
 *
 * @param headers
 * @param agency_id
 * @param baskets
 * @param basket_id
 * @returns
 */
export async function getLotesFiltered(
  headers: any,
  agency_id: string,
  baskets?: boolean,
  basket_id?: number
) {
  let lotes = await getLotesExportJSON(headers, agency_id);

  if (!baskets && basket_id) {
    //quito los que son de tipo canasta
    lotes = lotes.filter((lot: LoteSchema) => lot.lot?.item_id !== basket_id);
  } else if (baskets && basket_id) {
    //jalo sólo los que son de tipo canasta
    lotes = lotes.filter((lot: LoteSchema) => lot.lot?.item_id === basket_id);
  }

  lotes = lotes.map((lot: LoteSchema) => {
    const baskets = getBasketsSchema(lot.lot.description);
    const baskets_quantity = baskets.map((x) => x.total).reduce(reduceAdd, 0);
    const availableByBasket = truncateDecimals(
      Number(lot.available) / baskets_quantity,
      2
    );

    return {
      ...lot,
      baskets,
      availableByBasket,
      baskets_quantity,
    } as LoteSchema;
  });

  return lotes;
}

/**
 *
 * @param headers
 * @param agency_id
 * @param basket_id
 * @param orders
 * @param desde
 * @param hasta
 * @returns
 */
export async function getLotesWithPurchaseFormated(
  headers: any,
  agency_id: string,
  basket_id: number,
  orders: ObjectKeyString<PurchasesDataTableListFormatedSchema>,
  desde?: string,
  hasta?: string
): Promise<AxiosUtilsResponse<LoteWithPurchaseFormatedSchema[]>> {
  return handlePossibleAxiosErrors(async () => {
    const TODAY = new Date().getTime();

    const lotes = (await getLotesExportJSON(headers, agency_id, desde, hasta))
      //quito los que son de tipo canasta
      .filter((lot: LoteSchema) => lot.lot?.item_id !== basket_id)
      //filtro sólo los de las ordenes que vienen
      .filter((lot: LoteSchema) => Object.keys(orders).includes(lot.lot.name))
      .map((lot: LoteSchema) => {
        return {
          ...orders[lot.lot.name],
          id_lote: lot.lot?.id,
          name_lote: lot.lot?.name,
          item: lot.lot?.item?.name,
          created_at: lot.lot?.created_at,
          weight: lot.available,
          baskets:
            lot?.lot?.description !== null && lot?.lot?.description?.length > 0
              ? lot.lot?.description
                  .split(",")
                  .map((basket: any) => parseInt(basket.split("-")[0]))
                  .reduce((sum: number, qty: number) => sum + qty)
              : 0,
          editable:
            Math.floor(
              (TODAY - new Date(lot.lot?.created_at).getTime()) /
                (1000 * 3600 * 24)
            ) < 1,
        } as LoteWithPurchaseFormatedSchema;
      })
      .sort(
        (
          a: LoteWithPurchaseFormatedSchema,
          b: LoteWithPurchaseFormatedSchema
        ) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return lotes;
  });
}

export async function getLotesProcesados(
  headers: any,
  agency_id: string
): Promise<LoteProcesadoSchema[]> {
  const deliveries = await getDeliveriesDataTables(headers, {
    length: 0,
    order: {
      "0": {
        column: "0",
        dir: "desc",
      },
    },
    start: 0,
    agency_from: agency_id,
  });
  const dataFormateada = deliveries?.data?.data
    ?.filter((result) => result.mem)
    .map((result) => {
      //Ejemplo: "53876;351693;MINI ZANAHORIA (NARANJA);1775.0;35;25;2022-06-10"
      //${LOTE_ID};${LOTE_NAME};${VERDURA};${booked_quantity};${CANTIDAD_CANASTAS_ENVIADAS_A_CC};${porcentajeRechazo};${DELIVERY_DATE}
      const memSplited = result.mem.split(";");
      return {
        lote_id: memSplited[0],
        lote_name: memSplited[1],
        verdura: memSplited[2],
        pesoNeto: memSplited[3],
        canastas: memSplited[4],
        rechazo: `${truncateDecimals(Number(memSplited[5]), 2)}`,
        delivery_date: memSplited[6],
        pesoNetoPorCanasta: `${truncateDecimals(
          (Number(memSplited[3]) ?? 0) / (Number(memSplited[4]) ?? 1),
          2
        )}`,
      } as LoteProcesadoSchema;
    });

  return dataFormateada ?? [];
}

/**
 *
 * @param headers
 * @param lot_id
 * @returns
 */
export const inactivarLote = (
  headers: any,
  lot_id: string | number
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    await httpZauru.patch<any>(
      `/inventories/lots/${lot_id}.json`,
      { active: false },
      { headers }
    );
    return true;
  });
};
