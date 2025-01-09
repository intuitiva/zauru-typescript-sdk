import { AxiosUtilsResponse } from "@zauru-sdk/types";
export type CMSGeneralQueryResponse<T> = {
    [key: string]: {
        docs: T[];
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
        nextPage: number | null;
        offset: number;
        page: number;
        pagingCounter: number;
        prevPage: number | null;
        totalDocs: number;
        totalPages: number;
    };
};
/**
 * getCMSGeneralQuery
 * @param query
 * @returns
 */
export declare const getCMSGeneralQuery: <T>(query: string) => Promise<AxiosUtilsResponse<CMSGeneralQueryResponse<T>>>;
