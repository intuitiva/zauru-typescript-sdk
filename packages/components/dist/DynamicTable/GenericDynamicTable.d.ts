import React from "react";
import { GenericDynamicTableColumn, RowDataType, SelectFieldOption } from "@zauru-sdk/types";
export type FooterColumnConfig = {
    content: React.ReactNode;
    className?: string;
    name?: string;
};
type Props = {
    name?: string;
    className?: string;
    columns: GenericDynamicTableColumn[];
    onChange?: (tableState?: any[]) => void;
    defaultValue?: RowDataType[];
    footerRow?: FooterColumnConfig[];
    thCSSProperties?: React.CSSProperties;
    thElementsClassName?: string;
    editable?: boolean;
    searcheables?: SelectFieldOption[];
    loading?: boolean;
    paginated?: boolean;
    defaultItemsPerPage?: number;
    itemsPerPageOptions?: number[];
    withoutBg?: boolean;
    orientation?: "horizontal" | "vertical";
    maxRows?: number;
    confirmDelete?: boolean;
    addRowButtonHandler?: (tableData: RowDataType[], setTableData: (data: RowDataType[]) => void) => void;
};
/**
 *
 * @param props
 * @returns
 *
 * @example
 *<GenericDynamicTable
    name="invoice_details"
    withoutBg
    editable={!show}
    searcheables={[{ value: "id_number", label: "No. Contraseña" }]}
    defaultValue={
      invoiceDetailsDefaultValue ?? [{ id: crypto.randomUUID() }]
    }
    columns={[
      {
        label: "Producto",
        name: "item_id",
        type: "selectField",
        options: productOptions,
        disabled: show,
        onChange: (rowData, value, setTableValue) => {
          const price = getProductPrice(value);
          setTableValue("price", price);
        },
        headerClassName: "text-center font-bold",
        cellClassName: "text-center",
      },
      {
        label: "Cantidad",
        name: "quantity",
        type: "textField",
        textFieldType: "number",
        disabled: show,
        onChange: (rowData, value, setTableValue) => {
          const price = rowData["price"] ?? 0;
          const quantity = Number(value) || 0;
          setTableValue("total", price * quantity);
        },
        headerClassName: "text-right font-semibold",
        cellClassName: "text-right",
      }
    ]}
    footerRow={[
      { content: "Total", className: "text-left font-bold" },
      { content: calculateTotal(), className: "text-center" },
      { content: "", className: "text-center" }
    ]}
    maxRows={2}
  />
 */
export declare const GenericDynamicTable: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
