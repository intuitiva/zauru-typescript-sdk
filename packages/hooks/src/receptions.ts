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
  try {
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
      const isEmptyData =
        (objectData?.data &&
          Array.isArray(objectData?.data) &&
          objectData?.data.length <= 0) ||
        (objectData?.data && Object.keys(objectData?.data).length <= 0);

      if (isEmptyData || objectData.reFetch || online) {
        try {
          setData({ ...data, loading: true });
          dispatch(receptionFetchStart(RECEPTION_NAME));
          // Convierte cada elemento del array a una cadena codificada para URL
          const encodedWheres = wheres.map((where) =>
            encodeURIComponent(where)
          );
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
  } catch (ex) {
    showAlert({
      type: "error",
      title: `Ocurrió un error al cargar el object de receptions: ${RECEPTION_NAME}.`,
      description: "Error: " + ex,
    });
    return { data: {} as T, loading: false };
  }
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
export type FooterColumnConfig = {
  content: React.ReactNode;
  className?: string;
  name?: string;
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
