import { useFetcher } from "@remix-run/react";
import {
  RECEPTION_NAMES,
  receptionFetchStart,
  receptionFetchSuccess,
  ReduxParamsConfig,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";
import {
  ItemAssociatedLots,
  ItemGraphQL,
  NewPurchaseOrderResponse,
  PayeeGraphQL,
  PurchaseOrderGraphQL,
  WebAppRowGraphQL,
  GenericDynamicTableColumn,
  QueueFormReceptionWebAppTable,
  RejectionWebAppTableObject,
  PurchaseOrderGeneralInfo,
  BasketSchema,
} from "@zauru-sdk/types";
import { useEffect, useMemo, useState } from "react";
import { AlertType, showAlert } from "./index.js";
import {
  getBasketsSchema,
  reduceAdd,
  toFixedIfNeeded,
} from "@zauru-sdk/common";

type ReturnType<T> = {
  data: T;
  loading: boolean;
};

type ConfigProps = { online?: boolean; wheres?: string[] };

const useGetReceptionObject = <T>(
  RECEPTION_NAME: RECEPTION_NAMES,
  { online = false, wheres = [] }: ReduxParamsConfig = {}
): ReturnType<T> => {
  const fetcher = useFetcher<
    | {
        title: string;
        description: string;
        type: AlertType;
      }
    | { [key: string]: T[] }
  >();
  const dispatch = useAppDispatch();
  const objectData = useAppSelector(
    (state) => state.receptions[RECEPTION_NAME]
  );

  const [data, setData] = useState<ReturnType<T>>({
    data: Array.isArray(objectData?.data)
      ? objectData?.data.length
        ? (objectData?.data as T)
        : ([] as unknown as T)
      : Object.keys(objectData?.data || {}).length
      ? (objectData?.data as T)
      : ({} as T),
    loading: objectData.loading,
  });

  useEffect(() => {
    if (fetcher.data?.title) {
      showAlert({
        description: fetcher.data?.description?.toString(),
        title: fetcher.data?.title?.toString(),
        type: fetcher.data?.type?.toString() as AlertType,
      });
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data != null) {
      const receivedData = fetcher.data as { [key: string]: T };
      if (receivedData) {
        setData({ data: receivedData[RECEPTION_NAME], loading: false });
        dispatch(
          receptionFetchSuccess({
            name: RECEPTION_NAME,
            data: receivedData[RECEPTION_NAME],
          })
        );
      }
    }
  }, [fetcher, dispatch, RECEPTION_NAME]);

  useEffect(() => {
    const isEmptyData = Array.isArray(objectData?.data)
      ? objectData?.data.length <= 0
      : Object.keys(objectData?.data || {}).length <= 0;

    if (isEmptyData || objectData.reFetch || online) {
      try {
        setData({ ...data, loading: true });
        dispatch(receptionFetchStart(RECEPTION_NAME));
        // Convierte cada elemento del array a una cadena codificada para URL
        const encodedWheres = wheres.map((where) => encodeURIComponent(where));
        // Une los elementos codificados con '&'
        const wheresQueryParam = encodedWheres.join("&");
        fetcher.load(
          `/api/receptions?object=${RECEPTION_NAME}&wheres=${wheresQueryParam}`
        );
      } catch (ex) {
        showAlert({
          type: "error",
          title: `Ocurrió un error al cargar el object de receptions: ${RECEPTION_NAME}.`,
          description: "Error: " + ex,
        });
      }
    }
  }, []);

  return data;
};

export const useGetProcesses = (
  config?: ConfigProps
): {
  loading: boolean;
  data: WebAppRowGraphQL<QueueFormReceptionWebAppTable>[];
} =>
  useGetReceptionObject<WebAppRowGraphQL<QueueFormReceptionWebAppTable>[]>(
    "queueReceptions",
    config
  );

export const useGetPOReceptions = (
  config?: ConfigProps
): {
  loading: boolean;
  data: PurchaseOrderGraphQL[];
} => useGetReceptionObject<PurchaseOrderGraphQL[]>("poReceptions", config);

export const useGetBasketLots = (): {
  loading: boolean;
  data: ItemAssociatedLots;
} => useGetReceptionObject<ItemAssociatedLots>("basketLots");

export const useGetRejectionInfo = (): {
  loading: boolean;
  data: RejectionWebAppTableObject;
} => useGetReceptionObject<RejectionWebAppTableObject>("rejectionInfo");

export const useGetNewPurchaseOrderInfo = (): {
  loading: boolean;
  data: NewPurchaseOrderResponse;
} => useGetReceptionObject<NewPurchaseOrderResponse>("newPurchaseOrderInfo");

export const useGetPurchaseOrderGeneralInfo = (): {
  loading: boolean;
  data: PurchaseOrderGeneralInfo;
} =>
  useGetReceptionObject<PurchaseOrderGeneralInfo>("purchaseOrderGeneralInfo");

/**
 * ---------------- Hooks personalizados
 */
type FormInput = {
  idNumberInput: string;
  rType: string;
  vendor: string;
  porcentajeRechazo: string;
  [key: string]: string | undefined;
};

type PesadaBody = {
  id: number;
  baskets: number;
  totalWeight: number;
  discount: number;
  netWeight: string;
  weightByBasket: string;
  probableUtilization: number;
  lbDiscounted: number;
};

export const useGetPesadas = (
  purchaseOrder?: PurchaseOrderGraphQL,
  stocks_only_integer: boolean = false
): [PesadaBody[], any[], GenericDynamicTableColumn[]] => {
  const [pesadas, footerPesadas, headersPesadas] = useMemo(() => {
    if (!purchaseOrder) return [[], [], []];

    const tempPesadas: PesadaBody[] = [
      ...purchaseOrder.purchase_order_details?.map((x, index) => {
        const parsedReference = x.reference?.split(","); //eg: "reference": "698,25,0", // peso neto, canastas, descuento
        const totalWeight = parsedReference[0]
          ? Number(parsedReference[0]) ?? 0
          : 0;
        const baskets = parsedReference[1]
          ? Number(parsedReference[1]) ?? 0
          : 0;
        const discount = parsedReference[2]
          ? isNaN(Number(parsedReference[2]))
            ? 0
            : Number(parsedReference[2])
          : 0;
        //TODO sacar el peso de la canasta de la API de Zauru, ahorita se supone que no debería cambiar de 5 libras.
        const basketWeight = 5;
        let netWeight = totalWeight - baskets * basketWeight; //Se le resta el peso de las canastas
        netWeight = netWeight * ((100 - discount) / 100); //Se le aplica el descuento
        if (stocks_only_integer) netWeight = totalWeight; //si es en unidades no divido el peso entre las canastas
        const weightByBasket = netWeight / baskets;

        //Probable aprovechamiento en planta
        const probableUtilization =
          netWeight * ((100 - purchaseOrder?.discount) / 100);

        //libras o unidades descontadas
        const lbDiscounted = netWeight - probableUtilization;

        return {
          id: index + 1,
          baskets,
          totalWeight,
          discount,
          netWeight: toFixedIfNeeded(netWeight)?.toString(),
          weightByBasket: toFixedIfNeeded(weightByBasket)?.toString(),
          probableUtilization,
          lbDiscounted,
        };
      }),
    ];

    const totales = [
      //#
      {
        contennt: "",
      },
      //baskets
      {
        contennt: toFixedIfNeeded(
          tempPesadas?.map((x) => x.baskets).reduce(reduceAdd, 0)
        )?.toString(),
      },
      //totalWeight
      {
        contennt: toFixedIfNeeded(
          tempPesadas?.map((x) => x.totalWeight).reduce(reduceAdd, 0)
        )?.toString(),
      },
      //discount
      {
        contennt: "-",
      },
      //netWeight
      {
        contennt: toFixedIfNeeded(
          tempPesadas?.map((x) => Number(x.netWeight)).reduce(reduceAdd, 0)
        )?.toString(),
      },
      //weightByBasket
      {
        contennt: "-",
      },
      //lbDiscounted
      {
        contennt: toFixedIfNeeded(
          tempPesadas?.map((x) => Number(x.lbDiscounted)).reduce(reduceAdd, 0)
        )?.toString(),
      },
      //probableUtilization
      {
        contennt: toFixedIfNeeded(
          tempPesadas
            ?.map((x) => Number(x.probableUtilization))
            .reduce(reduceAdd, 0)
        ),
      },
    ];

    const headers: GenericDynamicTableColumn[] = [
      { label: "#", name: "id", type: "label", width: 5 },
      { label: "Canastas", name: "baskets", type: "label" },
      {
        label: `${stocks_only_integer ? "Unidades" : "Peso báscula"}`,
        name: "totalWeight",
        type: "label",
      },
      { label: "Descuento (%)", name: "discount", type: "label" },
      {
        label: `${stocks_only_integer ? "Unidades" : "Peso Neto"}`,
        name: "netWeight",
        type: "label",
      },
      {
        label: `${stocks_only_integer ? "Unidades" : "Peso Neto"} - %Rechazo`,
        name: "probableUtilization",
        type: "label",
      },
      {
        label: `${stocks_only_integer ? "Unidades" : "Libras"} descontadas`,
        name: "lbDiscounted",
        type: "label",
      },
      {
        label: `${stocks_only_integer ? "Unidades" : "Peso Neto"} por canasta`,
        name: "weightByBasket",
        type: "label",
      },
    ];
    return [tempPesadas, totales, headers];
  }, [purchaseOrder]);

  return [pesadas, footerPesadas, headersPesadas];
};

/**
 * Sirve para imprimir offline
 * @param formInput
 * @returns
 */
export const getPesadasByForm = (
  formInput: FormInput,
  stocks_only_integer: boolean = false
) => {
  // Inicializar array de pesadas
  const tempPesadas: PesadaBody[] = [];

  // Iterar sobre los campos del formulario y extraer la información de pesadas
  let index = 0;
  while (formInput.hasOwnProperty(`basket${index}`)) {
    const baskets = isNaN(Number(formInput[`basket${index}`]))
      ? 0
      : Number(formInput[`basket${index}`]);
    const totalWeight = isNaN(Number(formInput[`weight${index}`]))
      ? 0
      : Number(formInput[`weight${index}`]);
    const discount = isNaN(Number(formInput[`discount${index}`]))
      ? 0
      : Number(formInput[`discount${index}`]);

    // Realizar los cálculos necesarios
    const basketWeight = 5;
    let netWeight = totalWeight - baskets * basketWeight;
    netWeight = netWeight * ((100 - discount) / 100);
    netWeight = stocks_only_integer ? totalWeight : netWeight;
    const weightByBasket = netWeight / baskets;

    //Probable aprovechamiento en planta
    const probableUtilization =
      netWeight * ((100 - (Number(formInput.porcentajeRechazo) ?? 0)) / 100);

    //libras o unidades descontadas
    const lbDiscounted = netWeight - probableUtilization;

    // Añadir al array de pesadas
    tempPesadas.push({
      id: index + 1,
      baskets,
      totalWeight,
      discount,
      netWeight: toFixedIfNeeded(netWeight)?.toString(),
      weightByBasket: toFixedIfNeeded(weightByBasket)?.toString(),
      probableUtilization,
      lbDiscounted,
    });

    index++;
  }

  const totales = [
    //#
    {
      contennt: "",
    },
    //baskets
    {
      contennt: toFixedIfNeeded(
        tempPesadas?.map((x) => x.baskets).reduce(reduceAdd, 0)
      )?.toString(),
    },
    //totalWeight
    {
      contennt: toFixedIfNeeded(
        tempPesadas?.map((x) => x.totalWeight).reduce(reduceAdd, 0)
      )?.toString(),
    },
    //netWeight
    {
      contennt: toFixedIfNeeded(
        tempPesadas?.map((x) => Number(x.netWeight)).reduce(reduceAdd, 0)
      )?.toString(),
    },
    //weightByBasket
    {
      contennt: "-",
    },
  ];

  const headers: GenericDynamicTableColumn[] = [
    { label: "#", name: "id", type: "label", width: 5 },
    { label: "Canastas", name: "baskets", type: "label" },
    {
      label: `${stocks_only_integer ? "Unidades" : "Peso báscula"}`,
      name: "totalWeight",
      type: "label",
    },
    {
      label: `${stocks_only_integer ? "Unidades" : "Peso Neto"}`,
      name: "netWeight",
      type: "label",
    },
    {
      label: `${stocks_only_integer ? "Unidades" : "Peso Neto"} por canasta`,
      name: "weightByBasket",
      type: "label",
    },
  ];

  return { tempPesadas, totales, headers };
};

type BasketDetailsBody = {
  id: number;
  total: number;
  color: string;
  cc: number;
};

export const useGetBasketDetails = (
  purchaseOrder?: PurchaseOrderGraphQL
): [BasketDetailsBody[], any[], GenericDynamicTableColumn[]] => {
  const [basketsJoined, footerBasketsJoined, headersBasketsJoined] =
    useMemo(() => {
      if (!purchaseOrder) return [[], [], []];

      const bsq =
        purchaseOrder?.lots.length > 0
          ? purchaseOrder?.lots
              ?.map((x) => {
                const basket = getBasketsSchema(x.description);
                return basket;
              })
              .flat(2)
          : //------- INTENTO IMPRIMIR EL TOTAL DE CANASTAS DEL PURCHASE ORDER DETAILS, PORQUE DEPLANO HUBO UN ERROR EN LA CREACION DE LOS LOTES Y POR ESO VIENE VACIO
          //ESTO SOLO ES UNA CONTINGENCIA PARA QUE POR LO MENOS PUEDAN IMPRIMIR EL NUMERO DE CANASTAS, PERO NO LES ESTARÁ MOSTRANDO EL COLOR
          //--- TODO
          purchaseOrder?.purchase_order_details.length > 0
          ? purchaseOrder?.purchase_order_details
              ?.map((x) => {
                return {
                  id: 0,
                  color: "-",
                  total: Number(x.reference.split(",")[1]) ?? 0,
                } as BasketSchema;
              })
              .flat(2)
          : [];

      const bsqToCC = getBasketsSchema(purchaseOrder.memo);

      const joinedBaskets: {
        id: number;
        total: number;
        color: string;
        cc: number;
        // granTotal: number;
      }[] = [];
      for (let i = 0; i < bsq.length; i++) {
        let found = joinedBaskets.find((item) => item.color === bsq[i].color);
        let foundCC = bsqToCC.find((item) => item.color === bsq[i].color);

        if (found) {
          found.total += bsq[i].total;
        } else {
          joinedBaskets.push({
            id: i,
            total: bsq[i].total - (foundCC ? foundCC.total : 0),
            //granTotal: bsq[i].total,
            color: bsq[i].color,
            cc: foundCC ? foundCC.total : 0,
          });
        }
      }

      const totales = [
        //color
        {
          contennt: "",
        },
        //total
        {
          contennt: toFixedIfNeeded(
            joinedBaskets?.map((x) => x.total).reduce(reduceAdd, 0)
          )?.toString(),
        },
        //cc
        {
          contennt: joinedBaskets?.map((x) => x.cc).reduce(reduceAdd, 0),
        },
      ];

      const headers: GenericDynamicTableColumn[] = [
        { label: "Color", name: "color", type: "label" },
        { label: "Canastas recibidas", name: "total", type: "label" },
        { label: "Enviadas a CC", name: "cc", type: "label" },
        //{ label: "Total", name: "granTotal", type: "label" },
      ];

      return [joinedBaskets, totales, headers];
    }, [purchaseOrder]);

  return [basketsJoined, footerBasketsJoined, headersBasketsJoined];
};

/**
 * Para imprimir en modo offline
 * @param formInput
 * @returns
 */
export const getBasketDetailsByForm = (formInput: FormInput) => {
  const basketDetailsArray: BasketDetailsBody[] = [];

  if (!formInput)
    return {
      basketDetailsArray,
      totales: [],
      headers: [],
    };

  // Regex para identificar los campos relevantes
  const recPattern = /^rec\d+-(.+)$/;
  const qCPattern = /^qC\d+-(.+)$/;

  for (const key in formInput) {
    if (formInput.hasOwnProperty(key)) {
      let match;

      // Comprobar si la clave es un campo "rec" y extraer el color y la cantidad
      if ((match = recPattern.exec(key))) {
        const color = match[1];
        const total = isNaN(Number(formInput[key]))
          ? 0
          : Number(formInput[key]);

        const existingBasket = basketDetailsArray.find(
          (item) => item.color === color
        );
        if (existingBasket) {
          existingBasket.total += total;
        } else {
          if (total > 0) {
            basketDetailsArray.push({
              id: basketDetailsArray.length,
              total,
              color,
              cc: 0, // Inicializar cc a 0, se actualizará más adelante si existe
            });
          }
        }
      }

      // Comprobar si la clave es un campo "qC" y actualizar el campo cc correspondiente
      if ((match = qCPattern.exec(key))) {
        const color = match[1];
        const cc = isNaN(Number(formInput[key])) ? 0 : Number(formInput[key]);

        const existingBasket = basketDetailsArray.find(
          (item) => item.color === color
        );
        if (existingBasket) {
          existingBasket.cc += cc;
        }
      }
    }
  }

  const totales = [
    //color
    {
      contennt: "",
    },
    //total
    {
      contennt: toFixedIfNeeded(
        basketDetailsArray.map((x) => x.total).reduce(reduceAdd, 0)
      )?.toString(),
    },
    //cc
    {
      contennt: basketDetailsArray.map((x) => x.cc).reduce(reduceAdd, 0),
    },
  ];

  // Definir los encabezados de la tabla
  const headers: GenericDynamicTableColumn[] = [
    { label: "Color", name: "color", type: "label" },
    { label: "Canastas recibidas", name: "total", type: "label" },
    { label: "Enviadas a CC", name: "cc", type: "label" },
  ];

  return { basketDetailsArray, totales, headers };
};

export const useGetProviderNameByPurchaseOrder = (
  payees: PayeeGraphQL[],
  purchaseOrder?: PurchaseOrderGraphQL
) => {
  const providerName = useMemo(() => {
    if (!purchaseOrder) return null;
    const provider = payees.find((x) => x.id == purchaseOrder.payee_id);
    if (provider) {
      return `<${provider.id_number}> ${
        provider.tin ? `${provider.tin} | ` : ""
      }${provider.name}`;
    }
    return null;
  }, [payees, purchaseOrder]);

  return providerName;
};

export const useGetItemNameByPurchaseOrder = (
  items: ItemGraphQL[],
  purchaseOrder?: PurchaseOrderGraphQL
) => {
  const itemName = useMemo(() => {
    if (!purchaseOrder) return null;
    if (purchaseOrder.purchase_order_details.length > 0 && items.length > 0) {
      const item = items.find(
        (x) => x.id == purchaseOrder.purchase_order_details[0].item_id
      );
      return `${item?.id} - ${item?.code} - ${item?.name}`;
    }
    return null;
  }, [items, purchaseOrder]);

  return itemName;
};

export const useGetItemByPurchaseOrder = (
  items: ItemGraphQL[],
  purchaseOrder?: PurchaseOrderGraphQL
) => {
  const item = useMemo(() => {
    if (!purchaseOrder) return null;
    if (purchaseOrder.purchase_order_details.length > 0 && items.length > 0) {
      const item = items.find(
        (x) => x.id == purchaseOrder.purchase_order_details[0].item_id
      );
      return item;
    }
    return null;
  }, [items, purchaseOrder]);

  return item;
};
