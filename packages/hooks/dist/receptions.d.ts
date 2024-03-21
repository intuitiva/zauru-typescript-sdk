import { type ItemAssociatedLots } from "~/services/zauru/zauru-lotes.server";
import type { RejectionWebAppTableObject } from "~/utils/zauru/webapp-tables.utils";
import type { GenericDynamicTableColumn } from "~/components/DynamicTable/GenericDynamicTable";
import type { PayeeGraphQL, PurchaseOrderGraphQL, WebAppRowGraphQL } from "~/graphql/queries";
import type { ItemCategorySchema } from "~/services/zauru/zauru-items.server";
import type { NewPurchaseOrderResponse, PurchaseOrderGeneralInfo } from "~/services/zauru/zauru-purchase-orders.server";
import type { QueueFormReceptionWebAppTable } from "~/utils/zauru/4pinos-reception-form-history.utils";
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
export declare const useGetPesadas: (purchaseOrder: PurchaseOrderGraphQL) => [PesadaBody[], PesadaFooter, GenericDynamicTableColumn[]];
/**
 * Sirve para imprimir offline
 * @param formInput
 * @returns
 */
export declare const getPesadasByForm: (formInput: FormInput) => {
    tempPesadas: PesadaBody[];
    totales: {
        id: string;
        baskets: any;
        totalWeight: any;
        discount: string;
        netWeight: any;
        weightByBasket: string;
        lbDiscounted: any;
        probableUtilization: any;
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
export declare const useGetProviderNameByPurchaseOrder: (payees: PayeeGraphQL[], purchaseOrder: PurchaseOrderGraphQL) => string | null;
export declare const useGetItemNameByPurchaseOrder: (items: ItemCategorySchema[], purchaseOrder: PurchaseOrderGraphQL) => string | null;
export {};
