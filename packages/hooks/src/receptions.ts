import { useFetcher } from "@remix-run/react";
import {
  RECEPTION_NAMES,
  ReduxParamsConfig,
  receptionFetchStart,
  receptionFetchSuccess,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";
import {
  ItemAssociatedLots,
  ItemGraphQL,
  NewPurchaseOrderResponse,
  PayeeGraphQL,
  PurchaseOrderGeneralInfo,
  PurchaseOrderGraphQL,
  QueueFormReceptionWebAppTable,
  RejectionWebAppTableObject,
  WebAppRowGraphQL,
  GenericDynamicTableColumn,
} from "@zauru-sdk/types";
import { useEffect, useMemo, useState } from "react";
import { showAlert } from "src";
import {
  getBasketsSchema,
  reduceAdd,
  toFixedIfNeeded,
} from "../../common/dist";

type ReturnType<T> = {
  data: T;
  loading: boolean;
};

type ConfigProps = { online?: boolean; wheres?: string[] };

const useGetReceptionObject = <T>(
  RECEPTION_NAME: RECEPTION_NAMES,
  { online = false, wheres = [] }: ReduxParamsConfig = {}
): ReturnType<T> => {
  const fetcher = useFetcher();
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
        description: fetcher.data?.description,
        title: fetcher.data?.title,
        type: fetcher.data?.type,
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
    "queueNewReceptions",
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

type PesadaFooter = {
  id: string;
  baskets: string;
  totalWeight: string;
  discount: string;
  netWeight: string;
  weightByBasket: string;
};

export const useGetPesadas = (
  purchaseOrder: PurchaseOrderGraphQL
): [PesadaBody[], PesadaFooter, GenericDynamicTableColumn[]] => {
  const [pesadas, footerPesadas, headersPesadas] = useMemo(() => {
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
          ? Number(parsedReference[2]) ?? 0
          : 0;
        //TODO sacar el peso de la canasta de la API de Zauru
        const basketWeight = 5;
        let netWeight = totalWeight - baskets * basketWeight; //Se le resta el peso de las canastas
        netWeight = netWeight * ((100 - discount) / 100); //Se le aplica el descuento
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
          netWeight: toFixedIfNeeded(netWeight),
          weightByBasket: toFixedIfNeeded(weightByBasket),
          probableUtilization,
          lbDiscounted,
        };
      }),
    ];

    const totales = {
      id: "",
      baskets: toFixedIfNeeded(
        tempPesadas?.map((x) => x.baskets).reduce(reduceAdd, 0)
      ),
      totalWeight: toFixedIfNeeded(
        tempPesadas?.map((x) => x.totalWeight).reduce(reduceAdd, 0)
      ),
      discount: "-",
      netWeight: toFixedIfNeeded(
        tempPesadas?.map((x) => Number(x.netWeight)).reduce(reduceAdd, 0)
      ),
      weightByBasket: "-",
      lbDiscounted: toFixedIfNeeded(
        tempPesadas?.map((x) => Number(x.lbDiscounted)).reduce(reduceAdd, 0)
      ),
      probableUtilization: toFixedIfNeeded(
        tempPesadas
          ?.map((x) => Number(x.probableUtilization))
          .reduce(reduceAdd, 0)
      ),
    };

    const headers: GenericDynamicTableColumn[] = [
      { label: "#", name: "id", type: "label", width: 5 },
      { label: "Canastas", name: "baskets", type: "label" },
      { label: "Peso báscula", name: "totalWeight", type: "label" },
      { label: "Descuento (%)", name: "discount", type: "label" },
      { label: "Peso Neto", name: "netWeight", type: "label" },
      {
        label: "Peso Neto - %Rechazo",
        name: "probableUtilization",
        type: "label",
      },
      {
        label: "Lb o Unidades descontadas",
        name: "lbDiscounted",
        type: "label",
      },
      {
        label: "Peso Neto por canasta",
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
export const getPesadasByForm = (formInput: FormInput) => {
  // Inicializar array de pesadas
  const tempPesadas: PesadaBody[] = [];

  // Iterar sobre los campos del formulario y extraer la información de pesadas
  let index = 0;
  while (formInput.hasOwnProperty(`basket${index}`)) {
    const baskets = Number(formInput[`basket${index}`] || 0);
    const totalWeight = Number(formInput[`weight${index}`] || 0);
    const discount = Number(formInput[`discount${index}`] || 0);

    // Realizar los cálculos necesarios
    const basketWeight = 5;
    let netWeight = totalWeight - baskets * basketWeight;
    netWeight = netWeight * ((100 - discount) / 100);
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
      netWeight: toFixedIfNeeded(netWeight),
      weightByBasket: toFixedIfNeeded(weightByBasket),
      probableUtilization,
      lbDiscounted,
    });

    index++;
  }

  const totales = {
    id: "",
    baskets: toFixedIfNeeded(
      tempPesadas?.map((x) => x.baskets).reduce(reduceAdd, 0)
    ),
    totalWeight: toFixedIfNeeded(
      tempPesadas?.map((x) => x.totalWeight).reduce(reduceAdd, 0)
    ),
    discount: "-",
    netWeight: toFixedIfNeeded(
      tempPesadas?.map((x) => Number(x.netWeight)).reduce(reduceAdd, 0)
    ),
    weightByBasket: "-",
    lbDiscounted: toFixedIfNeeded(
      tempPesadas?.map((x) => Number(x.lbDiscounted)).reduce(reduceAdd, 0)
    ),
    probableUtilization: toFixedIfNeeded(
      tempPesadas
        ?.map((x) => Number(x.probableUtilization))
        .reduce(reduceAdd, 0)
    ),
  };

  const headers: GenericDynamicTableColumn[] = [
    { label: "#", name: "id", type: "label", width: 5 },
    { label: "Canastas", name: "baskets", type: "label" },
    { label: "Peso báscula", name: "totalWeight", type: "label" },
    { label: "Descuento (%)", name: "discount", type: "label" },
    { label: "Peso Neto", name: "netWeight", type: "label" },
    {
      label: "Peso Neto - %Rechazo",
      name: "probableUtilization",
      type: "label",
    },
    {
      label: "Lb o Unidades descontadas",
      name: "lbDiscounted",
      type: "label",
    },
    {
      label: "Peso Neto por canasta",
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

type BasketDetailsFooter = {
  id: string;
  total: string;
  cc: number;
};

export const useGetBasketDetails = (
  purchaseOrder: PurchaseOrderGraphQL
): [BasketDetailsBody[], BasketDetailsFooter, GenericDynamicTableColumn[]] => {
  const [basketsJoined, footerBasketsJoined, headersBasketsJoined] =
    useMemo(() => {
      const bsq =
        purchaseOrder?.lots
          ?.map((x) => {
            const basket = getBasketsSchema(x.description);
            return basket;
          })
          .flat(2) ?? [];

      const bsqToCC = getBasketsSchema(purchaseOrder.memo);

      const joinedBaskets: {
        id: number;
        total: number;
        color: string;
        cc: number;
      }[] = [];
      for (let i = 0; i < bsq.length; i++) {
        const found = joinedBaskets.find((item) => item.color === bsq[i].color);
        const foundCC = bsqToCC.find((item) => item.color === bsq[i].color);

        if (found) {
          found.total += bsq[i].total;
        } else {
          joinedBaskets.push({
            id: i,
            total: bsq[i].total + (foundCC ? foundCC.total : 0),
            color: bsq[i].color,
            cc: foundCC ? foundCC.total : 0,
          });
        }
      }

      const totales = {
        id: "",
        total: toFixedIfNeeded(
          joinedBaskets?.map((x) => x.total).reduce(reduceAdd, 0)
        ),
        cc: joinedBaskets?.map((x) => x.cc).reduce(reduceAdd, 0),
      };

      const headers: GenericDynamicTableColumn[] = [
        { label: "Color", name: "color", type: "label" },
        { label: "Canastas recibidas", name: "total", type: "label" },
        { label: "Enviadas a CC", name: "cc", type: "label" },
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

  // Regex para identificar los campos relevantes
  const recPattern = /^rec\d+-(.+)$/;
  const qCPattern = /^qC\d+-(.+)$/;

  for (const key in formInput) {
    if (formInput.hasOwnProperty(key)) {
      let match;

      // Comprobar si la clave es un campo "rec" y extraer el color y la cantidad
      if ((match = recPattern.exec(key))) {
        const color = match[1];
        const total = Number(formInput[key] || 0);

        const existingBasket = basketDetailsArray.find(
          (item) => item.color === color
        );
        if (existingBasket) {
          existingBasket.total += total;
        } else {
          basketDetailsArray.push({
            id: basketDetailsArray.length,
            total,
            color,
            cc: 0, // Inicializar cc a 0, se actualizará más adelante si existe
          });
        }
      }

      // Comprobar si la clave es un campo "qC" y actualizar el campo cc correspondiente
      if ((match = qCPattern.exec(key))) {
        const color = match[1];
        const cc = Number(formInput[key] || 0);

        const existingBasket = basketDetailsArray.find(
          (item) => item.color === color
        );
        if (existingBasket) {
          existingBasket.cc += cc;
        }
      }
    }
  }

  // Calcular los totales para footerBasketsDetails
  const totales: BasketDetailsFooter = {
    id: "",
    total: basketDetailsArray
      .map((x) => x.total)
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2),
    cc: basketDetailsArray.map((x) => x.cc).reduce((acc, val) => acc + val, 0),
  };

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
  purchaseOrder: PurchaseOrderGraphQL
) => {
  const providerName = useMemo(() => {
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
  purchaseOrder: PurchaseOrderGraphQL
) => {
  const itemName = useMemo(() => {
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
