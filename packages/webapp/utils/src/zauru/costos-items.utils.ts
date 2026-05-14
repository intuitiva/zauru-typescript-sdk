import type { Session } from "@remix-run/node";
import {
  handlePossibleAxiosErrors,
  localDateToUSDate,
} from "@zauru-sdk/common";
import {
  SpecialItem,
  WebAppRowGraphQL,
  RowDataType,
  AxiosUtilsResponse,
  CostoSemanalSpecialItem,
  PurchaseOrderCosto,
  CostoSemanal,
  BitacoraCostosItems,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";
import moment from "moment";
import { createSpecialItem, updateSpecialItem } from "./specialItem.utils.js";
import {
  createWebAppTableRegister,
  getPurchasesList,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import { updatePurchaseItemPrice } from "./purchase-orders.utils.js";

/**
 *
 * @param headers
 * @param session
 * @param configuration
 * @param specialItems
 */
export const guardarConfiguracionProductosEspeciales = (
  headers: any,
  session: Session,
  configuration: (RowDataType & SpecialItem)[],
  specialItems?: WebAppRowGraphQL<SpecialItem>[]
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    specialItems?.forEach(async (x) => {
      if (!configuration.some((y) => y.id === x.id)) {
        //Elimino los que ya no están
        const response = await updateSpecialItem(
          headers,
          session,
          x.id.toString(),
          {
            ...x.data,
            fechaEliminacion: moment().format("DD/MM/YYYY HH:mm:ss"),
          }
        );
        if (response.error) {
          throw new Error(
            `Ocurrió un error al intentar eliminar un item especial. - ${
              response.userMsg ?? ""
            }`
          );
        }
      }
    });

    configuration.forEach(async (x) => {
      if (typeof x.id === "string") {
        //Creación
        const response = await createSpecialItem(headers, session, {
          ...x,
        });
        if (response.error) {
          throw new Error(
            `Ocurrió un error al intentar guardar la configuración de items especiales. - ${
              response.userMsg ?? ""
            }`
          );
        }
      } else {
        //actualización
        const response = await updateSpecialItem(
          headers,
          session,
          x.id.toString(),
          {
            ...x,
          }
        );
        if (response.error) {
          throw new Error(
            `Ocurrió un error al intentar actualizar un item especial. - ${
              response.userMsg ?? ""
            }`
          );
        }
      }
    });
    return true;
  });
};

/**
 *
 * @returns
 */
export const obtenerSemanaAnterior = () => {
  const hoy = moment();

  const semanaAnterior = hoy.clone().subtract(7, "days");

  const fechaInicio = semanaAnterior.clone().startOf("isoWeek");
  const fechaInicioFormateada = fechaInicio.format("YYYY/MM/DD");

  const fechaFin = fechaInicio.clone().endOf("isoWeek");
  const fechaFinFormateada = fechaFin.format("YYYY/MM/DD");

  const label =
    "Semana anterior, del Lunes " +
    fechaInicio.date() +
    " al Domingo " +
    fechaFin.date() +
    ", de " +
    fechaFin.format("MMMM") +
    " de " +
    fechaFin.year();

  return {
    fechaInicio: fechaInicioFormateada,
    fechaFin: fechaFinFormateada,
    label: label,
    getDay: (dayIndex: number) => {
      if (dayIndex < 0 || dayIndex > 6) {
        throw new Error("Day index must be between 0 (Monday) and 6 (Sunday).");
      }

      const targetDate = fechaInicio.clone().add(dayIndex, "days");
      return targetDate.format("YYYY/MM/DD");
    },
  };
};

const getPriceByDate = (
  date: string,
  fechas: {
    lunes: string;
    martes: string;
    miercoles: string;
    jueves: string;
    viernes: string;
    sabado: string;
    domingo: string;
  },
  costo?: CostoSemanal | CostoSemanalSpecialItem
) => {
  const originDate = new Date(date).setHours(0, 0, 0, 0);
  const lunesDate = new Date(fechas.lunes).setHours(0, 0, 0, 0);
  const martesDate = new Date(fechas.martes).setHours(0, 0, 0, 0);
  const miercolesDate = new Date(fechas.miercoles).setHours(0, 0, 0, 0);
  const juevesDate = new Date(fechas.jueves).setHours(0, 0, 0, 0);
  const viernesDate = new Date(fechas.viernes).setHours(0, 0, 0, 0);
  const sabadoDate = new Date(fechas.sabado).setHours(0, 0, 0, 0);
  const domingoDate = new Date(fechas.domingo).setHours(0, 0, 0, 0);

  if (originDate === lunesDate || originDate === martesDate) {
    return costo?.lunMar ?? 1;
  } else if (originDate === miercolesDate || originDate === juevesDate) {
    return costo?.mieJue ?? 1;
  } else if (
    originDate === viernesDate ||
    originDate === sabadoDate ||
    originDate === domingoDate
  ) {
    return costo?.vieSabDom ?? 1;
  } else {
    return 1;
  }
};

const logTotal = (total: number) => {
  console.log(
    "========================================================================"
  );
  console.log(
    "========================================================================"
  );
  console.log(
    "========================================================================"
  );
  console.log(
    "========================================================================"
  );
  console.log(`A PUNTO DE ACTUALIZAR: ${total} órdenes de compra`);
  console.log(
    "========================================================================"
  );
  console.log(
    "========================================================================"
  );
  console.log(
    "========================================================================"
  );
  console.log(
    "========================================================================"
  );
};

/**
 * updateOneItemPrice
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export const updateOneItemPrice = (
  headers: any,
  session: Session,
  body: {
    fechaInicio: string;
    fechaFin: string;
    item: number;
    price: number;
  }
): Promise<AxiosUtilsResponse<any>> => {
  return handlePossibleAxiosErrors(async () => {
    //PASO 1
    //Obtengo todas las órdenes de compra dentro del rango de fechas
    const fechaInicio = localDateToUSDate(body.fechaInicio);
    const fechaFin = localDateToUSDate(body.fechaFin);
    console.log(
      `==============================> OBTENIENDO ÓRDENES DE COMPRA EN EL RANGO ${fechaInicio} - ${fechaFin}`
    );
    const allPurchases = await getPurchasesList(headers, session, {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    });
    console.log("ORDENES DE COMPRA OBTENIDAS: ", allPurchases.data?.length);

    if (allPurchases.error || !allPurchases.data) {
      //TODO: REGISTRAR EL FALLO EN LA ACTUALIZACIÓN
      return "error";
    }

    //PASO 2
    //Por cada órden de compra, voy a buscar su item para verificar el precio a colocarle en el día que fue emitida
    //Obtengo todos los id's de las órdenes de compra en ese rango de fechas
    const costosWithPurchaseIds: PurchaseOrderCosto[] = [];
    const purchaseIterations = allPurchases.data.filter((x) =>
      x.purchase_order_details.some((y) => y.item_id === body.item)
    );
    for (const purchase of purchaseIterations) {
      const purchase_order_details = purchase.purchase_order_details.map(
        (details) => {
          return {
            id: details.id,
            item_id: details.item_id,
            unit_cost: body.price,
          };
        }
      );

      costosWithPurchaseIds.push({
        id: purchase.id,
        fecha: purchase.created_at,
        finalizado: true,
        msgResultado: "",
        purchase_order_details,
      });
    }

    //PASO 3
    //Editar los precios de todas las órdenes de compra
    logTotal(costosWithPurchaseIds.length);
    for (let i = 0; i < costosWithPurchaseIds.length; i++) {
      const x = costosWithPurchaseIds[i];
      console.log(
        `==============================> ACTUALIZANDO ÓRDEN DE COMPRA: ID: ${
          x.id
        } PRICE: ${x.purchase_order_details
          .map((x) => x.unit_cost)
          .join(",")} ID_ITEM: ${x.purchase_order_details
          .map((x) => x.item_id)
          .join(",")}`
      );

      const updateResponse = await updatePurchaseItemPrice(
        headers,
        {
          purchase_order_details_attributes: {
            ...x.purchase_order_details
              .map((detail, index) => {
                return {
                  [`${index}`]: {
                    id: detail.id,
                    item_id: detail.item_id,
                    unit_cost: detail.unit_cost,
                  },
                };
              })
              .reduce((acc, curr) => Object.assign(acc, curr), {}),
          } as any,
        },
        x.id
      );
      if (updateResponse.error) {
        // Si hay error
        costosWithPurchaseIds[i].finalizado = false;
        costosWithPurchaseIds[i].msgResultado =
          updateResponse.userMsg ?? JSON.stringify(updateResponse);
      }
    }

    //PASO 4
    //Guardo la bitácora de cambios
    console.log(
      `==============================> GUARDANDO BITÁCORA DE CAMBIOS`
    );
    const response = await saveBitacoraCostos(headers, session, {
      costosEspeciales: [
        { specialItemId: body.item, lunMar: 1, mieJue: 1, vieSabDom: 1 },
      ],
      accion: "Costos individualmente",
      fechaCreacion: moment().format("DD/MM/YYYY HH:mm:ss"),
      fechas: {
        lunes: "",
        martes: "",
        miercoles: "",
        jueves: "",
        viernes: "",
        sabado: "",
        domingo: "",
      },
      modificadoPor: session.get("name"),
      costos: [{ item: body.item, lunMar: 1, mieJue: 1, vieSabDom: 1 }],
      costosActualizados: costosWithPurchaseIds,
      costosEspecialesActualizados: [],
    });

    if (response.error || !response.data) {
      throw new Error(
        response.userMsg ??
          "Respuesta vacía de saveBitacoraCostos en updateOneItemPrice"
      );
    }

    return response.data;
  });
};

/**
 * changePricesInit
 * @param headers
 * @param session
 * @param specialItems
 * @param body
 * @returns
 */
export const changePricesInit = (
  headers: any,
  session: Session,
  specialItems: WebAppRowGraphQL<SpecialItem>[],
  body: BitacoraCostosItems
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    //PASO 1
    //Obtengo todas las órdenes de compra dentro del rango de fechas
    console.log("=======================> FECHAS: ", body.fechas);
    const fechaInicio = body.fechas.lunes;
    const fechaFin = body.fechas.domingo;
    console.log(
      `==============================> OBTENIENDO ÓRDENES DE COMPRA EN EL RANGO ${fechaInicio} - ${fechaFin}`
    );
    const allPurchases = await getPurchasesList(headers, session, {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    });

    if (allPurchases.error || !allPurchases.data) {
      throw new Error(
        `Error al ubicar las órdenes de compra en el rango de fechas establecido: ${allPurchases.userMsg}`
      );
    }
    //PASO 2
    //Por cada órden de compra, voy a buscar su item para verificar el precio a colocarle en el día que fue emitida
    //Obtengo todos los id's de las órdenes de compra en ese rango de fechas
    const costosWithPurchaseIds: PurchaseOrderCosto[] = [];
    const costosEspecialesWithPurchaseIds: PurchaseOrderCosto[] = []; //Para las verduras especiales

    ForPrincipal: for (const purchase of allPurchases.data) {
      //Pregunto si la órden de compra coincide con alguno de los casos especiales
      for (const costoEspecial of body.costosEspeciales) {
        //Ubico la configuración de item especial.
        const specialItem = specialItems.find(
          (x) => x.id === costoEspecial.specialItemId
        );
        for (const details of purchase.purchase_order_details) {
          //Tengo que preguntar por proveedor, region, categoría de proveedores, tipo e item.
          if (
            specialItem?.data.region === purchase.incoterm_destination &&
            specialItem?.data?.tipo === purchase.reference &&
            specialItem.data.item === details.item_id
          ) {
            const costo = body.costosEspeciales.find(
              (x) => x.specialItemId === specialItem.id
            );
            const price = getPriceByDate(
              purchase.created_at,
              body.fechas,
              costo
            );
            costosWithPurchaseIds.push({
              id: purchase.id,
              fecha: purchase.created_at,
              purchase_order_details: [
                {
                  id: details.id,
                  item_id: details.item_id,
                  unit_cost: price,
                },
              ],
            });
            continue ForPrincipal;
          }
        }
      }

      //SI SIGUE AQUÍ, ES POR QUE NO ES VERDURA ESPECIAL
      const purchase_order_details = purchase.purchase_order_details.map(
        (details) => {
          const costo = body.costos.find((x) => x.item === details.item_id);
          const price = getPriceByDate(purchase.created_at, body.fechas, costo);
          return { id: details.id, item_id: details.item_id, unit_cost: price };
        }
      );

      costosWithPurchaseIds.push({
        id: purchase.id,
        fecha: purchase.created_at,
        purchase_order_details,
      });
    }

    //PASO 5
    //Guardo la bitácora de cambios
    console.log(
      `==============================> GUARDANDO BITÁCORA DE CAMBIOS`
    );
    const response = await saveBitacoraCostos(headers, session, {
      ...body,
      costosActualizados: costosWithPurchaseIds,
      costosEspecialesActualizados: costosEspecialesWithPurchaseIds,
    });

    if (response.error || !response.data) {
      const errorMsg = response.userMsg
        ? `Error al guardar la bitácora de costos ${response.userMsg}`
        : "Respuesta vacía de saveBitacoraCostos en changePrices";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    return response.data;
  });
};

/**
 * changePrice
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export const changePrice = async (
  headers: any,
  costo: PurchaseOrderCosto
): Promise<PurchaseOrderCosto> => {
  const x = costo;

  const msgActualizando = `==============================> ACTUALIZANDO ÓRDEN DE COMPRA: ID: ${
    x.id
  } PRICE: ${x.purchase_order_details
    .map((x) => x.unit_cost)
    .join(",")} ID_ITEM: ${x.purchase_order_details
    .map((x) => x.item_id)
    .join(",")}`;

  const body = {
    purchase_order_details_attributes: {
      ...x.purchase_order_details
        .map((detail, index) => {
          return {
            [`${index}`]: {
              id: detail.id,
              item_id: detail.item_id,
              unit_cost: detail.unit_cost,
            },
          };
        })
        .reduce((acc, curr) => Object.assign(acc, curr), {}),
    } as any,
  };
  console.log(msgActualizando);
  const updateResponse = await updatePurchaseItemPrice(headers, body, x.id);
  if (updateResponse.error) {
    // Si hay error
    costo.finalizado = false;
    costo.msgResultado =
      updateResponse.userMsg ??
      `Ocurrió un error al editar la órden de compra ${JSON.stringify(
        updateResponse
      )}`;
  } else {
    costo.finalizado = true;
  }
  return costo;
};

/**
 * changePrices
 * @param headers
 * @param session
 * @param body
 * @returns
 */
export const changePrices = (
  headers: any,
  session: Session,
  bitacora: BitacoraCostosItems,
  id_bitacora: string
): Promise<AxiosUtilsResponse<any>> => {
  return handlePossibleAxiosErrors(async () => {
    const costosWithPurchaseIds = bitacora.costosActualizados;
    const costosEspecialesWithPurchaseIds =
      bitacora.costosEspecialesActualizados;

    //PASO 3
    //Editar los precios de todas las órdenes de compra
    logTotal(costosWithPurchaseIds.length);
    for (let i = 0; i < costosWithPurchaseIds.length; i++) {
      const x = costosWithPurchaseIds[i];
      const msgActualizando = `==============================> ACTUALIZANDO ÓRDEN DE COMPRA: ID: ${
        x.id
      } PRICE: ${x.purchase_order_details
        .map((x) => x.unit_cost)
        .join(",")} ID_ITEM: ${x.purchase_order_details
        .map((x) => x.item_id)
        .join(",")}`;
      console.log(msgActualizando);
      const updateResponse = await updatePurchaseItemPrice(
        headers,
        {
          purchase_order_details_attributes: {
            ...x.purchase_order_details
              .map((detail, index) => {
                return {
                  [`${index}`]: {
                    id: detail.id,
                    item_id: detail.item_id,
                    unit_cost: detail.unit_cost,
                  },
                };
              })
              .reduce((acc, curr) => Object.assign(acc, curr), {}),
          } as any,
        },
        x.id
      );
      if (updateResponse.error) {
        // Si hay error
        costosWithPurchaseIds[i].finalizado = false;
        costosWithPurchaseIds[i].msgResultado =
          updateResponse.userMsg ?? JSON.stringify(updateResponse);
      }
    }

    //PASO 4
    //EDITO LAS ORDENES DE COMPRA PARA ITEMS ESPECIALES
    logTotal(costosEspecialesWithPurchaseIds.length);
    for (let i = 0; i < costosEspecialesWithPurchaseIds.length; i++) {
      const x = costosEspecialesWithPurchaseIds[i];
      console.log(
        `==============================> ACTUALIZANDO ÓRDEN DE COMPRA (ESPECIAL): ID: ${
          x.id
        } PRICE: ${x.purchase_order_details
          .map((x) => x.unit_cost)
          .join(",")} ID_ITEM: ${x.purchase_order_details
          .map((x) => x.item_id)
          .join(",")}`
      );
      const updateResponse = await updatePurchaseItemPrice(
        headers,
        {
          purchase_order_details_attributes: {
            ...x.purchase_order_details
              .map((detail, index) => {
                return {
                  [`${index}`]: {
                    id: detail.id,
                    item_id: detail.item_id,
                    unit_cost: detail.unit_cost,
                  },
                };
              })
              .reduce((acc, curr) => Object.assign(acc, curr), {}),
          } as any,
        },
        x.id
      );
      if (updateResponse.error) {
        // Si hay error
        costosEspecialesWithPurchaseIds[i].finalizado = false;
        costosEspecialesWithPurchaseIds[i].msgResultado =
          updateResponse.userMsg ?? JSON.stringify(updateResponse);
      }
    }

    //PASO 5
    //Actualizo la bitácora de cambios
    console.log(
      `==============================> GUARDANDO BITÁCORA DE CAMBIOS`
    );
    const response = await updateBitacoraCostos(
      headers,
      session,
      {
        ...bitacora,
        costosActualizados: costosWithPurchaseIds,
        costosEspecialesActualizados: costosEspecialesWithPurchaseIds,
      },
      id_bitacora
    );

    if (response.error || !response.data) {
      const errorMsg =
        response.userMsg ?? "Respuesta vacía de updateBitacora en changePrices";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    return response.data;
  });
};

/**
 * corregirCostos
 * @param headers
 * @param session
 * @param costos
 * @returns
 */
export const corregirCostos = (
  headers: any,
  session: Session,
  costos: PurchaseOrderCosto[],
  costosEspeciales: PurchaseOrderCosto[]
) => {
  return handlePossibleAxiosErrors(async () => {
    //PASO 1
    //Hago una copia
    const costosTemp = costos;
    const costosEspecialesTemp = costosEspeciales;
    //PASO 2
    //Editar los precios de todas las órdenes de compra
    logTotal(costosTemp.length);
    for (let i = 0; i < costosTemp.length; i++) {
      const x = costosTemp[i];
      console.log(
        `==============================> ACTUALIZANDO ÓRDEN DE COMPRA: ID: ${
          x.id
        } PRICE: ${x.purchase_order_details
          .map((x) => x.unit_cost)
          .join(",")} ID_ITEM: ${x.purchase_order_details
          .map((x) => x.item_id)
          .join(",")}`
      );

      const updateResponse = await updatePurchaseItemPrice(
        headers,
        {
          purchase_order_details_attributes: {
            ...x.purchase_order_details
              .map((detail, index) => {
                return {
                  [`${index}`]: {
                    id: detail.id,
                    item_id: detail.item_id,
                    unit_cost: detail.unit_cost,
                  },
                };
              })
              .reduce((acc, curr) => Object.assign(acc, curr), {}),
          } as any,
        },
        x.id
      );

      if (!updateResponse.error) {
        // Si hay error
        costosTemp[i].finalizado = true;
      } else {
        costosTemp[i].finalizado = false;
        costosTemp[i].msgResultado =
          updateResponse.userMsg ?? JSON.stringify(updateResponse);
      }
    }

    //PASO 3
    //Editar los precios de todas las órdenes de compra de precios especiales
    logTotal(costosEspecialesTemp.length);
    for (let i = 0; i < costosEspecialesTemp.length; i++) {
      const x = costosEspecialesTemp[i];
      console.log(
        `==============================> ACTUALIZANDO ÓRDEN DE COMPRA (ESPECIAL): ID: ${
          x.id
        } PRICE: ${x.purchase_order_details
          .map((x) => x.unit_cost)
          .join(",")} ID_ITEM: ${x.purchase_order_details
          .map((x) => x.item_id)
          .join(",")}`
      );

      const updateResponse = await updatePurchaseItemPrice(
        headers,
        {
          purchase_order_details_attributes: {
            ...x.purchase_order_details
              .map((detail, index) => {
                return {
                  [`${index}`]: {
                    id: detail.id,
                    item_id: detail.item_id,
                    unit_cost: detail.unit_cost,
                  },
                };
              })
              .reduce((acc, curr) => Object.assign(acc, curr), {}),
          } as any,
        },
        x.id
      );

      if (!updateResponse.error) {
        // Si hay error
        costosEspecialesTemp[i].finalizado = true;
      } else {
        costosEspecialesTemp[i].finalizado = false;
        costosEspecialesTemp[i].msgResultado =
          updateResponse.userMsg ?? JSON.stringify(updateResponse);
      }
    }

    //PASO 3
    //Guardo la bitácora de cambios
    console.log(
      `==============================> GUARDANDO BITÁCORA DE CAMBIOS`
    );
    const response = await saveBitacoraCostos(headers, session, {
      accion: "Reintento de asignación de costos",
      costos: [],
      costosEspeciales: [],
      fechaCreacion: moment().format("DD/MM/YYYY HH:mm:ss"),
      fechas: {
        domingo: "",
        jueves: "",
        lunes: "",
        martes: "",
        miercoles: "",
        sabado: "",
        viernes: "",
      },
      modificadoPor: session.get("name"),
      costosActualizados: costosTemp,
      costosEspecialesActualizados: costosEspecialesTemp,
    });

    if (response.error || !response.data) {
      throw new Error(
        response.userMsg ??
          "Respuesta vacía de saveBitacoraCostos en changePrices"
      );
    }

    return response.data;
  });
};

/**
 * Get saveBitacoraCostos from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>.
 */
export const saveBitacoraCostos = (
  headers: any,
  session: Session,
  body: BitacoraCostosItems
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { bitacora_costos_verduras_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "bitacora_costos_verduras_web_app_table_id",
      ]);

    const response = await createWebAppTableRegister<BitacoraCostosItems>(
      headers,
      bitacora_costos_verduras_web_app_table_id,
      { ...body, modificadoPor: session.get("name") }
    );

    return response;
  });
};

/**
 * Put updateBitacoraCostos from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>.
 */
export const updateBitacoraCostos = (
  headers: any,
  session: Session,
  body: BitacoraCostosItems,
  id_registro: string | number
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const { bitacora_costos_verduras_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "bitacora_costos_verduras_web_app_table_id",
      ]);

    const response = await updateWebAppTableRegister<BitacoraCostosItems>(
      headers,
      bitacora_costos_verduras_web_app_table_id,
      id_registro,
      { ...body, modificadoPor: session.get("name") }
    );

    return response;
  });
};

/**
 * Get getCostosBitacora from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>.
 */
export const getCostosBitacora = (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<BitacoraCostosItems>[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { bitacora_costos_verduras_web_app_table_id } =
      await getVariablesByName(headers, session, [
        "bitacora_costos_verduras_web_app_table_id",
      ]);

    const response = await getWebAppTableRegisters<BitacoraCostosItems>(
      session,
      bitacora_costos_verduras_web_app_table_id
    );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al tratar de obtener la bitácora de costos: ${response.userMsg}`
      );
    }

    const bitacora = response.data ?? [];

    return bitacora;
  });
};
