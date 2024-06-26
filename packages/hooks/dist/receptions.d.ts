import { ItemAssociatedLots, ItemGraphQL, NewPurchaseOrderResponse, PayeeGraphQL, PurchaseOrderGeneralInfo, PurchaseOrderGraphQL, QueueFormReceptionWebAppTable, RejectionWebAppTableObject, WebAppRowGraphQL, GenericDynamicTableColumn } from "@zauru-sdk/types";
type ConfigProps = {
    online?: boolean;
    wheres?: string[];
};
export declare const useGetProcesses: (config?: ConfigProps) => {
    loading: boolean;
    data: WebAppRowGraphQL<QueueFormReceptionWebAppTable>[];
};
export declare const useGetPOReceptions: (config?: ConfigProps) => {
    loading: boolean;
    data: PurchaseOrderGraphQL[];
};
export declare const useGetBasketLots: () => {
    loading: boolean;
    data: ItemAssociatedLots;
};
export declare const useGetRejectionInfo: () => {
    loading: boolean;
    data: RejectionWebAppTableObject;
};
export declare const useGetNewPurchaseOrderInfo: () => {
    loading: boolean;
    data: NewPurchaseOrderResponse;
};
export declare const useGetPurchaseOrderGeneralInfo: () => {
    loading: boolean;
    data: PurchaseOrderGeneralInfo;
};
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
export declare const useGetPesadas: (purchaseOrder: PurchaseOrderGraphQL, stocks_only_integer?: boolean) => [PesadaBody[], PesadaFooter, GenericDynamicTableColumn[]];
/**
 * Sirve para imprimir offline
 * @param formInput
 * @returns
 */
export declare const getPesadasByForm: (formInput: FormInput) => {
    tempPesadas: PesadaBody[];
    totales: {
        id: string;
        baskets: string;
        totalWeight: string;
        discount: string;
        netWeight: string;
        weightByBasket: string;
        lbDiscounted: string;
        probableUtilization: string;
    };
    headers: GenericDynamicTableColumn[];
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
export declare const useGetBasketDetails: (purchaseOrder: PurchaseOrderGraphQL) => [BasketDetailsBody[], BasketDetailsFooter, GenericDynamicTableColumn[]];
/**
 * Para imprimir en modo offline
 * @param formInput
 * @returns
 */
export declare const getBasketDetailsByForm: (formInput: FormInput) => {
    basketDetailsArray: BasketDetailsBody[];
    totales: BasketDetailsFooter;
    headers: GenericDynamicTableColumn[];
};
export declare const useGetProviderNameByPurchaseOrder: (payees: PayeeGraphQL[], purchaseOrder: PurchaseOrderGraphQL) => string;
export declare const useGetItemNameByPurchaseOrder: (items: ItemGraphQL[], purchaseOrder: PurchaseOrderGraphQL) => string;
export declare const useGetItemByPurchaseOrder: (items: ItemGraphQL[], purchaseOrder: PurchaseOrderGraphQL) => ItemGraphQL;
export {};
