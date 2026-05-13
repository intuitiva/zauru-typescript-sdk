import type { RouteModule } from "../route-types.js";
export type CreateLoginPopupRouteOptions = {
    /** Message shown while the page is redirecting to the OAuth dialog. */
    redirectingMessage?: string;
};
export declare function createLoginPopupRoute(options?: CreateLoginPopupRouteOptions): RouteModule;
