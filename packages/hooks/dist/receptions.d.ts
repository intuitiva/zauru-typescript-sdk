import { ItemAssociatedLots, ItemGraphQL, NewPurchaseOrderResponse, PayeeGraphQL, PurchaseOrderGraphQL, WebAppRowGraphQL, GenericDynamicTableColumn, QueueFormReceptionWebAppTable, RejectionWebAppTableObject, PurchaseOrderGeneralInfo } from "@zauru-sdk/types";
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
    probableUtilization: string;
    lbDiscounted: string;
};
export type FooterColumnConfig = {
    content: React.ReactNode;
    className?: string;
    name?: string;
};
export declare const useGetPesadas: (purchaseOrder?: PurchaseOrderGraphQL, stocks_only_integer?: boolean) => [PesadaBody[], FooterColumnConfig[], GenericDynamicTableColumn[]];
/**
 * Sirve para imprimir offline
 * @param formInput
 * @returns
 */
export declare const getPesadasByForm: (formInput: FormInput, stocks_only_integer?: boolean) => {
    tempPesadas: PesadaBody[];
    totales: {
        content: string;
        name: string;
    }[];
    headers: GenericDynamicTableColumn[];
};
type BasketDetailsBody = {
    id: number;
    total: number;
    color: string;
    cc: number;
};
export declare const useGetBasketDetails: (purchaseOrder?: PurchaseOrderGraphQL) => [BasketDetailsBody[], FooterColumnConfig[], GenericDynamicTableColumn[]];
/**
 * Para imprimir en modo offline
 * @param formInput
 * @returns
 */
export declare const getBasketDetailsByForm: (formInput: FormInput) => {
    basketDetailsArray: BasketDetailsBody[];
    totales: ({
        content: string;
        name: string;
    } | {
        content: number;
        name: string;
    })[];
    headers: GenericDynamicTableColumn[];
};
export declare const useGetProviderNameByPurchaseOrder: (payees: PayeeGraphQL[], purchaseOrder?: PurchaseOrderGraphQL) => string;
export declare const useGetItemNameByPurchaseOrder: (items: ItemGraphQL[], purchaseOrder?: PurchaseOrderGraphQL) => string;
export declare const useGetItemByPurchaseOrder: (items: ItemGraphQL[], purchaseOrder?: PurchaseOrderGraphQL) => ItemGraphQL;
export {};
