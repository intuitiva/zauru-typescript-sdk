import { ItemAssociatedLots, ItemGraphQL, NewPurchaseOrderResponse, PayeeGraphQL, PurchaseOrderGraphQL, WebAppRowGraphQL, QueueFormReceptionWebAppTable, RejectionWebAppTableObject, PurchaseOrderGeneralInfo } from "@zauru-sdk/types";
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
export type FooterColumnConfig = {
    content: React.ReactNode;
    className?: string;
    name?: string;
};
export declare const useGetProviderNameByPurchaseOrder: (payees: PayeeGraphQL[], purchaseOrder?: PurchaseOrderGraphQL) => string;
export declare const useGetItemNameByPurchaseOrder: (items: ItemGraphQL[], purchaseOrder?: PurchaseOrderGraphQL) => string;
export declare const useGetItemByPurchaseOrder: (items: ItemGraphQL[], purchaseOrder?: PurchaseOrderGraphQL) => ItemGraphQL;
export {};
