import React from "react";
import { GenericDynamicTableColumn, RowDataType, SelectFieldOption } from "@zauru-sdk/types";
export type FooterColumnConfig = {
    content?: React.ReactNode;
    className?: string;
    name?: string;
    cell?: (rows: RowDataType[]) => React.ReactNode;
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
    /** Controla si se pueden o no editar los campos (oculta botones y/o deshabilita campos). */
    editable?: boolean;
    /** Opciones de búsqueda. */
    searcheables?: SelectFieldOption[];
    /** Activa o desactiva el “skeleton” de carga. */
    loading?: boolean;
    /** Controla la paginación. */
    paginated?: boolean;
    defaultItemsPerPage?: number;
    itemsPerPageOptions?: number[];
    /** Quita el color de fondo por defecto a las filas pares. */
    withoutBg?: boolean;
    /** Orientación de los encabezados (`horizontal` o `vertical`). */
    orientation?: "horizontal" | "vertical";
    /** Máximo número de filas permitidas al hacer clic en “agregar fila”. */
    maxRows?: number;
    /** Muestra un diálogo de confirmación antes de eliminar una fila. */
    confirmDelete?: boolean;
    /** Función personalizada para manejar el botón de “agregar fila”. */
    addRowButtonHandler?: (tableData: RowDataType[], setTableData: (data: RowDataType[]) => void) => void;
    /**
     * Controla si todo el componente se renderiza en modo de solo lectura,
     * es decir, sin permitir ningún tipo de interacción de edición o eliminación.
     */
    readOnly?: boolean;
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
    addRowButtonHandler={async (tableData, setTableData) => {
      const selectedItem = await createItemModal(ecommerceItems, {
        itemSize: {
          width: "150px",
          height: "150px",
        },
      });
      if (selectedItem) {
        setTableData([
          ...tableData,
          {
            id: crypto.randomUUID(),
            code: selectedItem.code,
          },
        ]);
      }
    }}
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
      {
        name: "code",
        content: "Total",
        className: "text-left font-bold",
      },
      {
        name: "total",
        className: "text-left font-bold",
        cell: (rows: any) => {
          return `${rows.reduce((acc: number, row: any) => {
            return acc + row.total;
          }, 0)}`;
        },
      },
    ]}
    maxRows={2}
    readOnly={false}
  />
 */
export declare const GenericDynamicTable: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
