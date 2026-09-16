import { type ReactElement } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { getHeaders, getSession } from "@zauru-sdk/services";
import type { AxiosUtilsResponse } from "@zauru-sdk/types";
import { type CatalogHandler } from "./catalogs.loader.js";
export type ApiHandlerContext = {
    request: Request;
    session: Awaited<ReturnType<typeof getSession>>;
    headers: Awaited<ReturnType<typeof getHeaders>>;
    url: URL;
    name: string;
};
export type ApiHandler = (ctx: ApiHandlerContext) => Promise<AxiosUtilsResponse<unknown> | Response>;
export type ZauruApiLoaderExtras = {
    catalogs?: Record<string, CatalogHandler>;
    profiles?: Record<string, ApiHandler>;
    templates?: Record<string, ApiHandler>;
};
/**
 * Remix loader for `/api/profiles`. Pass extras to add or override profile names.
 */
export declare function createProfilesLoader(extras?: Record<string, ApiHandler>): LoaderFunction;
/**
 * Remix loader for `/api/session`.
 * Modern query: `name` + `type` (`environment` | `sessionVariable` | session attr).
 * Legacy Remix 1: `attribute` only, read from the session.
 */
export declare function createSessionLoader(): LoaderFunction;
/**
 * Remix loader for `/api/templates`. Pass extras to add or override template names.
 */
export declare function createTemplatesLoader(extras?: Record<string, ApiHandler>): LoaderFunction;
/**
 * Single Remix splat loader for `/api/catalogs|profiles|session|templates`.
 * App-specific handlers go in `extras` under the matching resource.
 */
export declare function createZauruApiLoader(extras?: ZauruApiLoaderExtras): LoaderFunction;
export declare function ProfilesRoute(): ReactElement;
export declare function SessionRoute(): ReactElement;
export declare function TemplatesRoute(): ReactElement;
export declare function ZauruApiRoute(): ReactElement;
