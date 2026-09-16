import { cleanLocalStorage } from "@zauru-sdk/redux";
export type ZauruHomeLayoutColor = "green" | "blue" | "red" | "purple" | "yellow";
export type ZauruLoginPageProps = {
    cleanLocalStorageArgs?: Parameters<typeof cleanLocalStorage>[0];
    color?: ZauruHomeLayoutColor;
};
export declare function ZauruLoginPage({ cleanLocalStorageArgs, color, }: ZauruLoginPageProps): import("react/jsx-runtime").JSX.Element;
