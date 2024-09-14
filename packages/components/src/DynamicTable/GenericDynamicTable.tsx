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
import { useAppSelector } from "@zauru-sdk/redux";
import { generateClientUUID } from "@zauru-sdk/common";
import { LoadingInputSkeleton } from "../Skeletons/index.js";
import { WithTooltip } from "../WithTooltip/index.js";
import { TrashSvg } from "@zauru-sdk/icons";

type Props = {
  name?: string;
  className?: string;
  columns: GenericDynamicTableColumn[];
  onChange?: (tableState?: any[]) => void;
  defaultValue?: RowDataType[];
  footerRow?: RowDataType;
  thCSSProperties?: React.CSSProperties;
  thElementsClassName?: string;
  editable?: boolean;
  searcheables?: SelectFieldOption[];
  loading?: boolean;
  paginated?: boolean;
  defaultItemsPerPage?: number;
  itemsPerPageOptions?: number[];
  withoutBg?: boolean;
};

const GenericDynamicTableErrorComponent = ({
  name,
  formName,
}: {
  name: string;
  formName?: string;
}) => {
  const { formValidations } = useAppSelector((state) => state.formValidation);
  const error = formValidations[formName ?? "-1"]?.[name ?? "-1"];

  return error ? (
    <p className={`mt-2 text-sm text-red-600 dark:text-red-500`}>
      <span className="font-medium">Oops!</span> {error}
    </p>
  ) : (
    <></>
  );
};

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
    // Encontrar el índice de la fila que está cambiando
    const rowIndex = tableData.findIndex((x) => x.id === rowId);

    // Crear una copia del objeto en esa fila
    const updatedRow = { ...tableData[rowIndex], [name]: value };

    // Copiar todo el array
    const updatedData = [...tableData];

    // Reemplazar el objeto en la fila que cambió
    updatedData[rowIndex] = updatedRow;

    // Actualizar el estado con el nuevo array
    setTableData(updatedData);
    onChange && onChange(updatedData);
  };

  const renderHeader = () => (
    <tr style={{ ...thCSSProperties }}>
      {columns.map((column, index) => {
        const ancho =
          column.width ?? (editable ? 94 : 100) / (columns.length ?? 1);
        return (
          <th
            key={index}
            className={`text-left align-middle p-2 ${thElementsClassName}`}
            style={{ width: `${ancho}%` }}
          >
            {column.label}
          </th>
        );
      })}
      {editable && <th style={{ width: "4%" }}></th>}
    </tr>
  );

  const renderRow = (rowData: RowDataType, index: number) => {
    return (
      <tr
        key={rowData.id}
        className={index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : ""}
      >
        {columns.map((column) => {
          if (loading) {
            return (
              <td
                key={`${rowData.id}-${column.name}`}
                className="align-middle p-1"
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
                className="align-middle p-1"
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
            setTableData((prevState) => {
              // Encontrar el índice de la fila que está cambiando
              const rowIndex = prevState.findIndex((x) => x.id === rowData.id);
              // Crear una copia del objeto en esa fila
              const updatedRow = {
                ...prevState[rowIndex],
                [columnName]: newValue,
              };
              // Copiar todo el array
              const updatedData = [...prevState];

              // Reemplazar el objeto en la fila que cambió
              updatedData[rowIndex] = updatedRow;
              return updatedData;
            });
          };

          return (
            <td
              key={`${rowData.id}-${column.name}`}
              className="align-middle p-1"
            >
              {column.loadingOptions ? (
                <LoadingInputSkeleton />
              ) : (
                <FieldComponent
                  key={`${rowData.id}-${column.name}`}
                  //name={column.name}
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
        })}
        {editable && (
          <td className="align-middle w-16">
            <WithTooltip text="Eliminar">
              <button
                className="bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
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
        )}
      </tr>
    );
  };

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
          <thead>{renderHeader()}</thead>
          <tbody>{renderRows()}</tbody>
          {footerRow && !editable ? (
            <tfoot className="border-t-2 border-black">
              <tr>
                {Object.keys(footerRow ?? {})?.map((x, indx) => {
                  return (
                    <td className="align-middle" key={indx}>
                      {(footerRow as any)[x]}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          ) : editable ? (
            <tfoot>
              <tr>
                <td className="align-middle">
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
                </td>
              </tr>
            </tfoot>
          ) : (
            <></>
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
