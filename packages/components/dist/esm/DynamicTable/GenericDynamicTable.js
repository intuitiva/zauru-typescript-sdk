import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { SelectField } from "../Form/SelectField/index.js";
import { TextField } from "../Form/TextField/index.js";
import { CheckBox } from "../Form/Checkbox/index.js";
import { createModal } from "../Modal/index.js";
import { Button } from "../Buttons/index.js";
import { generateClientUUID } from "@zauru-sdk/common";
import { LoadingInputSkeleton } from "../Skeletons/index.js";
import { WithTooltip } from "../WithTooltip/index.js";
import { TrashSvg } from "@zauru-sdk/icons";
import { useFormContext } from "react-hook-form";
const GenericDynamicTableErrorComponent = ({ name }) => {
    const { formState: { errors }, } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
    const error = errors ? errors[name ?? "-1"] : undefined;
    return error ? (_jsxs("p", { className: `mt-2 text-sm text-red-600 dark:text-red-500`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error?.message?.toString()] })) : (_jsx(_Fragment, {}));
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
export const GenericDynamicTable = (props) => {
    const { columns, onChange, className, footerRow, defaultValue = [], thCSSProperties, thElementsClassName = "", editable = true, searcheables = [], loading = false, paginated = true, defaultItemsPerPage = 10, itemsPerPageOptions = [10, 50, 100], name, withoutBg = false, orientation = "horizontal", maxRows, } = props;
    const [tableData, setTableData] = useState(defaultValue);
    const [deletedData, setDeletedData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredTableData, setFilteredTableData] = useState(tableData);
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
        const defs = {};
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
    const removeRow = (rowId) => {
        const newDeletedData = [...deletedData];
        const deletedItem = tableData?.find((x) => x.id === rowId);
        if (deletedItem && !isNaN(deletedItem.id)) {
            newDeletedData.push(deletedItem);
        }
        setDeletedData(newDeletedData);
        setTableData((prevData) => prevData?.filter((x) => x.id !== rowId));
    };
    const handleChange = (name, value, rowId) => {
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
            return (_jsxs("tr", { style: { ...thCSSProperties }, children: [columns.map((column, index) => {
                        const ancho = column.width ?? (editable ? 94 : 100) / (columns.length ?? 1);
                        return (_jsx("th", { className: `text-left align-middle p-2 ${thElementsClassName} ${column.headerClassName || ""}`, style: { width: `${ancho}%` }, children: column.label }, index));
                    }), editable && _jsx("th", { style: { width: "4%" } })] }));
        }
        else {
            return null;
        }
    };
    const renderRow = (rowData, index) => {
        if (orientation === "horizontal") {
            return (_jsxs("tr", { className: index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : "", children: [columns.map((column) => renderCell(rowData, column)), editable && renderDeleteButton(rowData)] }, rowData.id));
        }
        else {
            return columns.map((column) => (_jsxs("tr", { className: index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : "", children: [_jsx("th", { className: `text-left align-middle p-2 ${thElementsClassName} ${column.headerClassName || ""}`, children: column.label }), renderCell(rowData, column), editable &&
                        column === columns[columns.length - 1] &&
                        renderDeleteButton(rowData)] }, `${rowData.id}-${column.name}`)));
        }
    };
    const renderCell = (rowData, column) => {
        if (loading) {
            return (_jsx("td", { className: `align-middle p-1 ${column.cellClassName || ""}`, children: _jsx(LoadingInputSkeleton, {}) }, `${rowData.id}-${column.name}`));
        }
        const tempVal = rowData[column.name];
        const defaultVal = column.type === "selectField"
            ? column.options?.find((x) => x.value === tempVal)
            : tempVal;
        if (column.type === "label") {
            return (_jsx("td", { className: `align-middle p-1 ${column.cellClassName || ""}`, children: _jsx("div", { children: defaultVal }) }, `${rowData.id}-${column.name}`));
        }
        const FieldComponent = column.type === "textField"
            ? TextField
            : column.type === "checkbox"
                ? CheckBox
                : SelectField;
        const setTableValue = (columnName, newValue) => {
            handleChange(columnName, newValue, rowData.id);
        };
        return (_jsx("td", { className: `align-middle p-1 ${column.cellClassName || ""}`, children: column.loadingOptions ? (_jsx(LoadingInputSkeleton, {})) : (_jsx(FieldComponent, { name: `${rowData.id}-${column.name}`, type: column.textFieldType, integer: !!column.integer, disabled: column.disabled, isClearable: true, onChange: (value) => {
                    const sendValue = value?.value ?? value;
                    handleChange(column.name, sendValue, rowData.id);
                    column.onChange &&
                        column.onChange(rowData, sendValue, setTableValue);
                }, defaultValue: defaultVal, options: column.options ?? [] }, `${rowData.id}-${column.name}`)) }, `${rowData.id}-${column.name}`));
    };
    const renderDeleteButton = (rowData) => (_jsx("td", { className: "align-middle w-16", children: _jsx(WithTooltip, { text: "Eliminar", children: _jsx("button", { className: "bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2", onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    createModal({
                        title: "¿Está seguro que quiere eliminar este registro?",
                        description: "Una vez eliminada la información no podrá ser recuperada.",
                    }).then((response) => {
                        if (response === "OK") {
                            removeRow(rowData.id);
                        }
                    });
                }, type: "button", children: _jsx(TrashSvg, {}) }) }) }));
    const renderRows = () => {
        let mapeable = filteredTableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
            ];
        }
        return mapeable.map((rowData, index) => renderRow(rowData, index));
    };
    const handleChangeSearch = (newSearch) => {
        setSearch(newSearch);
    };
    const changeFilteredData = () => {
        if (search) {
            const filteredData = tableData.filter((rowData) => {
                for (const searchable of searcheables) {
                    const column = columns.find((col) => col.name === searchable.value);
                    if (column) {
                        const tempVal = rowData[column.name];
                        const defaultVal = column.type === "selectField"
                            ? column.options?.find((x) => x.value === tempVal)?.label
                            : tempVal;
                        if (defaultVal
                            ?.toString()
                            .toLowerCase()
                            .includes(search.toLowerCase())) {
                            return true;
                        }
                    }
                }
                return false;
            });
            setFilteredTableData(filteredData);
        }
        else {
            setFilteredTableData(tableData);
        }
    };
    return (_jsxs(_Fragment, { children: [name && (_jsxs(_Fragment, { children: [_jsx(GenericDynamicTableErrorComponent, { name: name }), _jsx("input", { name: name, type: "hidden", value: JSON.stringify(tableData), hidden: true }), _jsx("input", { name: `deleted_${name}`, type: "hidden", value: JSON.stringify(deletedData), hidden: true })] })), _jsxs("div", { className: `${className}`, children: [searcheables.length > 0 && (_jsx("div", { children: _jsx(TextField, { className: "mb-2", name: "search", title: `Buscar por: ${searcheables
                                .map((x) => x.label)
                                .join(", ")}`, onChange: handleChangeSearch, disabled: loading }) })), _jsxs("table", { className: "w-full", children: [orientation === "horizontal" && _jsx("thead", { children: renderHeader() }), _jsx("tbody", { children: renderRows() }), editable && (_jsx("tfoot", { children: _jsx("tr", { children: _jsx("td", { colSpan: orientation === "horizontal" ? columns.length + 1 : 2, className: "align-middle", children: (!maxRows || tableData.length < maxRows) && (_jsx("button", { className: "bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded", onClick: (event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                addRow();
                                            }, type: "button", children: "+" })) }) }) })), footerRow && (_jsx("tfoot", { className: "border-t-2 border-black", children: _jsx("tr", { children: footerRow.map((column, index) => (_jsx("td", { colSpan: orientation === "vertical" ? 2 : 1, className: `align-middle ${column.className || ""}`, children: column.content }, index))) }) }))] }), paginated && totalPages() > 1 && (_jsxs("div", { className: "flex justify-between items-center mt-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Button, { type: "button", disabled: currentPage === 1, onClickSave: () => setCurrentPage((old) => Math.max(old - 1, 1)), children: "Anterior" }), _jsx("span", { className: "mx-2", children: `Página ${currentPage} de ${totalPages()}` }), _jsx(Button, { type: "button", disabled: currentPage === totalPages(), onClickSave: () => setCurrentPage((old) => Math.min(old + 1, totalPages())), children: "Siguiente" })] }), _jsx("div", { children: _jsx("select", { value: itemsPerPage, onChange: (e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1); // resetear la página al cambiar los elementos por página
                                    }, children: itemsPerPageOptions.map((option) => (_jsxs("option", { value: option, children: [option, " elementos por p\u00E1gina"] }, option))) }) })] }))] })] }));
};
