import type { TableProps } from "react-data-table-component";
type Props = TableProps<any> & {
    columns: any;
    conditionalRowStyles?: any;
    data: any[];
    loading?: boolean;
    pagination?: {
        totalRows: number;
        rowsPerPageOptions: number[];
    };
    whitOutPagination?: boolean;
    offlineSearch?: string[];
    search?: {
        placeholderSearch?: string;
    };
    theme?: "solarized" | "subTable";
    className?: string;
};
export declare const ZauruTable: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
