import type { ZauruHomeLayoutColor } from "./ZauruLoginPage.js";
export type ZauruLogoutPageProps = {
    requireOnline?: boolean;
    beforeLogout?: () => boolean | void;
    color?: ZauruHomeLayoutColor;
};
export declare function ZauruLogoutPage({ requireOnline, beforeLogout, color, }: ZauruLogoutPageProps): import("react/jsx-runtime").JSX.Element;
