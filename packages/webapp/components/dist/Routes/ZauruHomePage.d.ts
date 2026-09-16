import { type ReactNode } from "react";
export type ZauruHomePageProps = {
    title: string;
    includeAgency?: boolean;
    extra?: ReactNode;
};
export declare function ZauruHomePage({ title, includeAgency, extra, }: ZauruHomePageProps): import("react/jsx-runtime").JSX.Element;
