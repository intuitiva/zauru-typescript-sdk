import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, CloseOpenWorkOrderBody, CloseOpenWorkOrderDetailInput, CloseOpenWorkOrderResponse, DataTablesFilterBody, OpenWorkOrdersDataTableResponse, ProductionWorkOrderDetailGraphQL, ProductionWorkOrderGraphQL } from "@zauru-sdk/types";
type CloseDetailSource = ProductionWorkOrderDetailGraphQL | CloseOpenWorkOrderDetailInput;
/**
 * getProductionWorkOrder
 * @param session
 * @param config
 * @returns
 */
export declare function getProductionWorkOrder(session: Session, config: {
    id: number | string;
    closed?: boolean;
    voided?: boolean;
}): Promise<AxiosUtilsResponse<ProductionWorkOrderGraphQL>>;
/**
 * getOpenWorkOrdersDataTables
 * @param headers
 * @param body
 * @returns
 */
export declare const getOpenWorkOrdersDataTables: (headers: any, body: DataTablesFilterBody) => Promise<AxiosUtilsResponse<OpenWorkOrdersDataTableResponse>>;
/**
 * buildCloseOpenWorkOrderBody
 * @param details
 * @param options
 * @returns
 */
export declare const buildCloseOpenWorkOrderBody: (details: CloseDetailSource[], options?: {
    defaultDeliveredToBooked?: boolean;
}) => CloseOpenWorkOrderBody;
/**
 * closeOpenWorkOrder
 * @param headers
 * @param id
 * @param body
 * @returns
 */
export declare const closeOpenWorkOrder: (headers: any, id: number | string, body?: CloseOpenWorkOrderBody) => Promise<AxiosUtilsResponse<CloseOpenWorkOrderResponse>>;
/**
 * closeOpenWorkOrderWithBookedQuantities
 * @param headers
 * @param session
 * @param id
 * @returns
 */
export declare const closeOpenWorkOrderWithBookedQuantities: (headers: any, session: Session, id: number | string) => Promise<AxiosUtilsResponse<CloseOpenWorkOrderResponse>>;
export {};
