import { type ReactElement } from "react";
import type { LoaderFunction, Session } from "@remix-run/node";
import { getHeaders } from "@zauru-sdk/services";
import type { AxiosUtilsResponse } from "@zauru-sdk/types";
export type CatalogLoaderContext = {
    request: Request;
    session: Session;
    headers: Awaited<ReturnType<typeof getHeaders>>;
    url: URL;
    catalog: string;
    wheres: string[];
};
export type CatalogHandler = (ctx: CatalogLoaderContext) => Promise<AxiosUtilsResponse<unknown> | Response>;
/**
 * Remix loader for `/api/catalogs`. Shared catalog names live in the SDK;
 * pass `extras` to add or override handlers for a single webapp.
 */
export declare function createCatalogsLoader(extras?: Record<string, CatalogHandler>): LoaderFunction;
export declare function CatalogsRoute(): ReactElement;
