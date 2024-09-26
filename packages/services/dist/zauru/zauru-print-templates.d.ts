import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, PrintTemplateGraphQL } from "@zauru-sdk/types";
/**
 * getPayees
 * @param headers
 * @returns
 */
export declare function getPrintTemplates(session: Session): Promise<AxiosUtilsResponse<PrintTemplateGraphQL[]>>;
