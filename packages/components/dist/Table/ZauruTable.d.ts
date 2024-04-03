import type { TableProps } from "react-data-table-component";
import { ExpandableRowsComponent } from "react-data-table-component/dist/DataTable/types.js";
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
    expandable?: {
        expandableRowExpanded?: (row: any) => boolean;
        expandableRowsComponent?: ExpandableRowsComponent<any>;
    };
    theme?: "solarized" | "subTable";
    className?: string;
};
export declare const ZauruTable: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
