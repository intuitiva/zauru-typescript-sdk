import { GenericDynamicTableColumn } from "@zauru-sdk/types";
export declare const BasicTableHTML: (props: {
    data: {
        [key: string]: string;
    }[];
    headers: GenericDynamicTableColumn[];
    footer: {
        [key: string]: string;
    };
}) => import("react/jsx-runtime").JSX.Element;
