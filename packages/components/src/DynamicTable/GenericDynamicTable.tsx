import React, { useEffect, useState } from "react";
import { SelectField } from "../Form/SelectField/index.js";
import { TextField } from "../Form/TextField/index.js";
import { CheckBox } from "../Form/Checkbox/index.js";
import { createItemModal, createModal } from "../Modal/index.js";
import { Button } from "../Buttons/index.js";
import {
  GenericDynamicTableColumn,
  RowDataType,
  SelectFieldOption,
} from "@zauru-sdk/types";
import { generateClientUUID } from "@zauru-sdk/common";
import { LoadingInputSkeleton } from "../Skeletons/index.js";
import { WithTooltip } from "../WithTooltip/index.js";
import { TrashSvg } from "@zauru-sdk/icons";
import { useFormContext } from "react-hook-form";
import { ComponentError } from "../Alerts/index.js";

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
  addRowButtonHandler?: (
    tableData: RowDataType[],
    setTableData: (data: RowDataType[]) => void
  ) => void;
  /**
   * Controla si todo el componente se renderiza en modo de solo lectura,
   * es decir, sin permitir ningún tipo de interacción de edición o eliminación.
   */
  readOnly?: boolean;
};

const GenericDynamicTableErrorComponent = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext() || { formState: {} };
  const error = errors ? errors[name ?? "-1"] : undefined;

  return error ? (
    <p className={`mt-2 text-sm text-red-600 dark:text-red-500`}>
      <span className="font-medium">Oops!</span> {error?.message?.toString()}
    </p>
  ) : (
    <></>
  );
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
export const GenericDynamicTable = (props: Props) => {
  const {
    columns,
    onChange,
    className,
    footerRow,
    defaultValue = [],
    thCSSProperties,
    thElementsClassName = "",
    editable = true,
    readOnly = false, // Nuevo prop
    searcheables = [],
    loading = false,
    paginated = true,
    defaultItemsPerPage = 10,
    itemsPerPageOptions = [10, 50, 100],
    name,
    withoutBg = false,
    orientation = "horizontal",
    maxRows,
    confirmDelete = true,
    addRowButtonHandler,
  } = props;

  /**
   * Definimos una variable interna para saber si los campos son
   * efectivamente editables: solo si `editable` es true y `readOnly` es false.
   */
  const isEditable = editable && !readOnly;

  try {
    const [tableData, setTableData] = useState<RowDataType[]>(defaultValue);
    const [deletedData, setDeletedData] = useState<RowDataType[]>([]);
    const [search, setSearch] = useState("");
    const [filteredTableData, setFilteredTableData] =
      useState<RowDataType[]>(tableData);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

    useEffect(() => {
      if (defaultValue.length) {
        setTableData(defaultValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      setFilteredTableData(tableData);
    }, [tableData]);

    useEffect(() => {
      changeFilteredData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableData, search]);

    const totalPages = () => {
      return Math.ceil(filteredTableData.length / itemsPerPage);
    };

    const addRow = () => {
      if (maxRows && tableData.length >= maxRows) {
        return;
      }
      const defs: { [key: string]: any } = {};
      columns.forEach((x) => {
        defs[`${x.name}`] =
          x.type === "label" || x.type === "textField"
            ? ""
            : x.type === "selectField"
            ? 0
            : x.type === "checkbox"
            ? false
            : 0;
      });
      setTableData((prevData) => [
        ...prevData,
        { id: generateClientUUID(), ...defs },
      ]);
    };

    const removeRow = (rowId: string) => {
      const newDeletedData = [...deletedData];
      const deletedItem = tableData?.find((x) => x.id === rowId);

      // Si la fila tenía un "id" no numérico (ej. generamos un UUID al vuelo),
      // igual se procede a eliminar, aunque no se guarde en "deletedData".
      if (deletedItem && !isNaN(deletedItem.id)) {
        newDeletedData.push(deletedItem);
      }

      setDeletedData(newDeletedData);
      setTableData((prevData) => prevData?.filter((x) => x.id !== rowId));
    };

    const handleChange = (name: string, value: any, rowId: string) => {
      setTableData((prevData) => {
        const updatedData = prevData.map((row) => {
          if (row.id === rowId) {
            return { ...row, [name]: value };
          }
          return row;
        });
        onChange && onChange(updatedData);
        return updatedData;
      });
    };

    const renderHeader = () => {
      const rendereableColumns = columns.filter(
        (column) => column.type !== "hidden"
      );
      if (orientation === "horizontal") {
        return (
          <tr style={{ ...thCSSProperties }}>
            {rendereableColumns.map((column, index) => {
              const ancho =
                column.width ??
                (isEditable ? 94 : 100) / (rendereableColumns.length ?? 1);
              return (
                <th
                  key={index}
                  className={`text-left align-middle p-2 ${thElementsClassName} ${
                    column.headerClassName || ""
                  }`}
                  style={{ width: `${ancho}%` }}
                >
                  {column.label}
                </th>
              );
            })}
            {isEditable && <th style={{ width: "4%" }}></th>}
          </tr>
        );
      } else {
        return null;
      }
    };

    const renderRow = (rowData: RowDataType, index: number) => {
      const rendereableColumns = columns.filter(
        (column) => column.type !== "hidden"
      );

      if (orientation === "horizontal") {
        return (
          <tr
            key={rowData.id}
            className={
              index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : ""
            }
          >
            {rendereableColumns.map((column) => renderCell(rowData, column))}
            {isEditable && renderDeleteButton(rowData)}
          </tr>
        );
      } else {
        // Orientación vertical
        return rendereableColumns.map((column) => (
          <tr
            key={`${rowData.id}-${column.name}`}
            className={
              index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : ""
            }
          >
            <th
              className={`text-left align-middle p-2 ${thElementsClassName} ${
                column.headerClassName || ""
              }`}
            >
              {column.label}
            </th>
            {renderCell(rowData, column)}
            {isEditable &&
              column === rendereableColumns[rendereableColumns.length - 1] &&
              renderDeleteButton(rowData)}
          </tr>
        ));
      }
    };

    const renderCell = (
      rowData: RowDataType,
      column: GenericDynamicTableColumn
    ) => {
      if (loading) {
        return (
          <td
            key={`${rowData.id}-${column.name}`}
            className={`align-middle p-1 ${column.cellClassName || ""}`}
          >
            <LoadingInputSkeleton />
          </td>
        );
      }

      if (column.type === "hidden") {
        return <></>;
      }

      const tempVal = rowData[column.name as any];

      const defaultVal =
        column.type === "selectField"
          ? column.options?.find((x) => x.value === tempVal)
          : tempVal;

      // Solo lectura: en este caso mostramos el valor como label
      if (readOnly) {
        return (
          <td
            key={`${rowData.id}-${column.name}`}
            className={`align-middle p-1 ${column.cellClassName || ""}`}
          >
            <div>
              {column.cell
                ? column.cell(rowData)
                : defaultVal?.label ?? tempVal}
            </div>
          </td>
        );
      }

      // Modo normal
      if (column.type === "label") {
        return (
          <td
            key={`${rowData.id}-${column.name}`}
            className={`align-middle p-1 ${column.cellClassName || ""}`}
          >
            <div>{column.cell ? column.cell(rowData) : defaultVal}</div>
          </td>
        );
      }

      // Determinamos el componente que usaremos según "type"
      const FieldComponent =
        column.type === "textField"
          ? TextField
          : column.type === "checkbox"
          ? CheckBox
          : SelectField;

      const setTableValue = (columnName: string, newValue: any) => {
        handleChange(columnName, newValue, rowData.id);
      };

      return (
        <td
          key={`${rowData.id}-${column.name}`}
          className={`align-middle p-1 ${column.cellClassName || ""}`}
        >
          {column.loadingOptions ? (
            <LoadingInputSkeleton />
          ) : (
            <FieldComponent
              key={`${rowData.id}-${column.name}`}
              name={`${rowData.id}-${column.name}`}
              type={column.textFieldType}
              integer={!!column.integer}
              /** Se deshabilita si la columna lo exige o si la tabla está en modo no editable */
              disabled={column.disabled || !isEditable}
              isClearable
              onChange={(value: any) => {
                const sendValue = value?.value ?? value;
                handleChange(column.name, sendValue, rowData.id);
                column.onChange &&
                  column.onChange(rowData, sendValue, setTableValue);
              }}
              defaultValue={defaultVal}
              options={column.options ?? []}
            />
          )}
        </td>
      );
    };

    const renderDeleteButton = (rowData: RowDataType) => (
      <td className="align-middle w-16">
        <WithTooltip text="Eliminar">
          <button
            className="bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              event.stopPropagation();
              if (confirmDelete) {
                createModal({
                  title: "¿Está seguro que quiere eliminar este registro?",
                  description:
                    "Una vez eliminada la información no podrá ser recuperada.",
                }).then((response) => {
                  if (response === "OK") {
                    removeRow(rowData.id);
                  }
                });
              } else {
                removeRow(rowData.id);
              }
            }}
            type="button"
          >
            <TrashSvg />
          </button>
        </WithTooltip>
      </td>
    );

    const renderRows = () => {
      let mapeable = filteredTableData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      // Si estamos cargando, mostramos celdas skeleton
      if (loading) {
        mapeable = [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
        ] as RowDataType[];
      }

      return mapeable.map((rowData, index) => renderRow(rowData, index));
    };

    const handleChangeSearch = (newSearch: string) => {
      setSearch(newSearch);
    };

    const changeFilteredData = () => {
      if (search) {
        const filteredData = tableData.filter((rowData) => {
          for (const searchable of searcheables) {
            const column = columns.find((col) => col.name === searchable.value);
            if (column) {
              const tempVal = rowData[column.name as any];
              const defaultVal =
                column.type === "selectField"
                  ? column.options?.find((x) => x.value === tempVal)?.label
                  : tempVal;
              if (
                defaultVal
                  ?.toString()
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ) {
                return true;
              }
            }
          }
          return false;
        });
        setFilteredTableData(filteredData);
      } else {
        setFilteredTableData(tableData);
      }
    };

    return (
      <>
        {name && (
          <>
            <GenericDynamicTableErrorComponent name={name} />
            <input
              name={name}
              type="hidden"
              value={JSON.stringify(tableData)}
              hidden
            />
            <input
              name={`deleted_${name}`}
              type="hidden"
              value={JSON.stringify(deletedData)}
              hidden
            />
          </>
        )}
        <div className={`${className}`}>
          {searcheables.length > 0 && (
            <div>
              <TextField
                className="mb-2"
                name="search"
                title={`Buscar por: ${searcheables
                  .map((x) => x.label)
                  .join(", ")}`}
                onChange={handleChangeSearch}
                disabled={loading || readOnly}
              />
            </div>
          )}
          <table className="w-full">
            {orientation === "horizontal" && <thead>{renderHeader()}</thead>}
            <tbody>{renderRows()}</tbody>
            {isEditable && (
              <tfoot>
                <tr>
                  <td
                    colSpan={
                      orientation === "horizontal" ? columns.length + 1 : 2
                    }
                    className="align-middle text-right"
                  >
                    {(!maxRows || tableData.length < maxRows) && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (addRowButtonHandler) {
                            addRowButtonHandler(tableData, setTableData);
                          } else {
                            addRow();
                          }
                        }}
                        type="button"
                      >
                        +
                      </button>
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
            {footerRow && (
              <tfoot className="border-t-2 border-black">
                <tr>
                  {columns
                    .filter((column) => column.type !== "hidden")
                    .map((column, index) => {
                      const footerCell = footerRow.find(
                        (fc) => fc.name === column.name
                      );
                      return (
                        <td
                          key={index}
                          colSpan={orientation === "vertical" ? 2 : 1}
                          className={`align-middle ${
                            footerCell?.className || ""
                          }`}
                        >
                          {footerCell ? (
                            footerCell.cell ? (
                              footerCell.cell(tableData)
                            ) : (
                              footerCell.content
                            )
                          ) : (
                            <></>
                          )}
                        </td>
                      );
                    })}
                  {isEditable && <td></td>}
                </tr>
              </tfoot>
            )}
          </table>
          {paginated && totalPages() > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <Button
                  type="button"
                  disabled={currentPage === 1 || readOnly}
                  onClickSave={() =>
                    setCurrentPage((old) => Math.max(old - 1, 1))
                  }
                >
                  Anterior
                </Button>
                <span className="mx-2">{`Página ${currentPage} de ${totalPages()}`}</span>
                <Button
                  type="button"
                  disabled={currentPage === totalPages() || readOnly}
                  onClickSave={() =>
                    setCurrentPage((old) => Math.min(old + 1, totalPages()))
                  }
                >
                  Siguiente
                </Button>
              </div>
              <div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // resetear la página al cambiar los elementos por página
                  }}
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} elementos por página
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </>
    );
  } catch (error: any) {
    return <ComponentError error={error} componentName="GenericDynamicTable" />;
  }
};
