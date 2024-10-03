import React, { useEffect, useState } from "react";
import { SelectField } from "../Form/SelectField/index.js";
import { TextField } from "../Form/TextField/index.js";
import { CheckBox } from "../Form/Checkbox/index.js";
import { createModal } from "../Modal/index.js";
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

export type FooterColumnConfig = {
  content: React.ReactNode;
  className?: string;
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
};

const GenericDynamicTableErrorComponent = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
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
    searcheables = [],
    loading = false,
    paginated = true,
    defaultItemsPerPage = 10,
    itemsPerPageOptions = [10, 50, 100],
    name,
    withoutBg = false,
    orientation = "horizontal",
    maxRows,
  } = props;

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
  }, []);

  useEffect(() => {
    setFilteredTableData(tableData);
  }, [tableData]);

  useEffect(() => {
    changeFilteredData();
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
        x.type == "label" || x.type == "textField"
          ? ""
          : x.type == "selectField"
          ? 0
          : x.type == "checkbox"
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
    if (orientation === "horizontal") {
      return (
        <tr style={{ ...thCSSProperties }}>
          {columns.map((column, index) => {
            const ancho =
              column.width ?? (editable ? 94 : 100) / (columns.length ?? 1);
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
          {editable && <th style={{ width: "4%" }}></th>}
        </tr>
      );
    } else {
      return null;
    }
  };

  const renderRow = (rowData: RowDataType, index: number) => {
    if (orientation === "horizontal") {
      return (
        <tr
          key={rowData.id}
          className={index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : ""}
        >
          {columns.map((column) => renderCell(rowData, column))}
          {editable && renderDeleteButton(rowData)}
        </tr>
      );
    } else {
      return columns.map((column) => (
        <tr
          key={`${rowData.id}-${column.name}`}
          className={index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : ""}
        >
          <th
            className={`text-left align-middle p-2 ${thElementsClassName} ${
              column.headerClassName || ""
            }`}
          >
            {column.label}
          </th>
          {renderCell(rowData, column)}
          {editable &&
            column === columns[columns.length - 1] &&
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
    const tempVal = rowData[column.name as any];

    const defaultVal =
      column.type === "selectField"
        ? column.options?.find((x) => x.value === tempVal)
        : tempVal;

    if (column.type === "label") {
      return (
        <td
          key={`${rowData.id}-${column.name}`}
          className={`align-middle p-1 ${column.cellClassName || ""}`}
        >
          <div>{defaultVal}</div>
        </td>
      );
    }

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
            disabled={column.disabled}
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
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            event.stopPropagation();
            createModal({
              title: "¿Está seguro que quiere eliminar este registro?",
              description:
                "Una vez eliminada la información no podrá ser recuperada.",
            }).then((response) => {
              if (response === "OK") {
                removeRow(rowData.id);
              }
            });
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
              disabled={loading}
            />
          </div>
        )}
        <table className="w-full">
          {orientation === "horizontal" && <thead>{renderHeader()}</thead>}
          <tbody>{renderRows()}</tbody>
          {editable && (
            <tfoot>
              <tr>
                <td
                  colSpan={
                    orientation === "horizontal" ? columns.length + 1 : 2
                  }
                  className="align-middle"
                >
                  {(!maxRows || tableData.length < maxRows) && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded"
                      onClick={(
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        event.preventDefault();
                        event.stopPropagation();
                        addRow();
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
                {footerRow.map((column, index) => (
                  <td
                    key={index}
                    colSpan={orientation === "vertical" ? 2 : 1}
                    className={`align-middle ${column.className || ""}`}
                  >
                    {column.content}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
        {paginated && totalPages() > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Button
                type="button"
                disabled={currentPage === 1}
                onClickSave={() =>
                  setCurrentPage((old) => Math.max(old - 1, 1))
                }
              >
                Anterior
              </Button>
              <span className="mx-2">{`Página ${currentPage} de ${totalPages()}`}</span>
              <Button
                type="button"
                disabled={currentPage === totalPages()}
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
};
