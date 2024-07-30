"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericDynamicTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const index_js_1 = require("../Form/SelectField/index.js");
const index_js_2 = require("../Form/TextField/index.js");
const index_js_3 = require("../Form/Checkbox/index.js");
const index_js_4 = require("../Modal/index.js");
const index_js_5 = require("../Buttons/index.js");
const redux_1 = require("@zauru-sdk/redux");
const common_1 = require("@zauru-sdk/common");
const index_js_6 = require("../Skeletons/index.js");
const index_js_7 = require("../WithTooltip/index.js");
const icons_1 = require("@zauru-sdk/icons");
const GenericDynamicTableErrorComponent = ({ name, formName, }) => {
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const error = formValidations[formName ?? "-1"]?.[name ?? "-1"];
    return error ? ((0, jsx_runtime_1.jsxs)("p", { className: `mt-2 text-sm text-red-600 dark:text-red-500`, children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Oops!" }), " ", error] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
};
const GenericDynamicTable = (props) => {
    const { columns, onChange, className, footerRow, defaultValue = [], thCSSProperties, thElementsClassName = "", editable = true, searcheables = [], loading = false, paginated = true, defaultItemsPerPage = 10, itemsPerPageOptions = [10, 50, 100], name, withoutBg = false, } = props;
    const [tableData, setTableData] = (0, react_1.useState)(defaultValue);
    const [deletedData, setDeletedData] = (0, react_1.useState)([]);
    const [search, setSearch] = (0, react_1.useState)("");
    const [filteredTableData, setFilteredTableData] = (0, react_1.useState)(tableData);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [itemsPerPage, setItemsPerPage] = (0, react_1.useState)(defaultItemsPerPage);
    (0, react_1.useEffect)(() => {
        if (defaultValue.length) {
            setTableData(defaultValue);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        setFilteredTableData(tableData);
    }, [tableData]);
    (0, react_1.useEffect)(() => {
        changeFilteredData();
    }, [tableData, search]);
    const totalPages = () => {
        return Math.ceil(filteredTableData.length / itemsPerPage);
    };
    const addRow = () => {
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
            { id: (0, common_1.generateClientUUID)(), ...defs },
        ]);
    };
    const removeRow = (rowId) => {
        const newDeletedData = [...deletedData];
        const deletedItem = tableData?.find((x) => x.id === rowId);
        if (deletedItem && !isNaN(deletedItem.id)) {
            newDeletedData.push(deletedItem);
        }
        setDeletedData(newDeletedData);
        onChange && onChange(tableData?.filter((x) => x.id !== rowId));
        setTableData((prevData) => prevData?.filter((x) => x.id !== rowId));
    };
    const handleChange = (name, value, rowId) => {
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
    const renderHeader = () => ((0, jsx_runtime_1.jsxs)("tr", { style: { ...thCSSProperties }, children: [columns.map((column, index) => {
                const ancho = column.width ?? (editable ? 94 : 100) / (columns.length ?? 1);
                return ((0, jsx_runtime_1.jsx)("th", { className: `text-left align-middle p-2 ${thElementsClassName}`, style: { width: `${ancho}%` }, children: column.label }, index));
            }), editable && (0, jsx_runtime_1.jsx)("th", { style: { width: "4%" } })] }));
    const renderRow = (rowData, index) => {
        return ((0, jsx_runtime_1.jsxs)("tr", { className: index % 2 === 0 ? `${withoutBg ? "" : "bg-gray-200"}` : "", children: [columns.map((column) => {
                    if (loading) {
                        return ((0, jsx_runtime_1.jsx)("td", { className: "align-middle p-1", children: (0, jsx_runtime_1.jsx)(index_js_6.LoadingInputSkeleton, {}) }, `${rowData.id}-${column.name}`));
                    }
                    const tempVal = rowData[column.name];
                    const defaultVal = column.type === "selectField"
                        ? column.options?.find((x) => x.value === tempVal)
                        : tempVal;
                    if (column.type === "label") {
                        return ((0, jsx_runtime_1.jsx)("td", { className: "align-middle p-1", children: (0, jsx_runtime_1.jsx)("div", { children: defaultVal }) }, `${rowData.id}-${column.name}`));
                    }
                    const FieldComponent = column.type === "textField"
                        ? index_js_2.TextFieldWithoutValidation
                        : column.type === "checkbox"
                            ? index_js_3.CheckboxWithoutValidation
                            : index_js_1.SelectFieldWithoutValidation;
                    const setTableValue = (columnName, newValue) => {
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
                    return ((0, jsx_runtime_1.jsx)("td", { className: "align-middle p-1", children: column.loadingOptions ? ((0, jsx_runtime_1.jsx)(index_js_6.LoadingInputSkeleton, {})) : ((0, jsx_runtime_1.jsx)(FieldComponent, { 
                            //name={column.name}
                            type: column.textFieldType, integer: !!column.integer, disabled: column.disabled, isClearable: true, onChange: (value) => {
                                const sendValue = value?.value ?? value;
                                handleChange(column.name, sendValue, rowData.id);
                                column.onChange &&
                                    column.onChange(rowData, sendValue, setTableValue);
                            }, defaultValue: defaultVal, options: column.options ?? [] }, `${rowData.id}-${column.name}`)) }, `${rowData.id}-${column.name}`));
                }), editable && ((0, jsx_runtime_1.jsx)("td", { className: "align-middle w-16", children: (0, jsx_runtime_1.jsx)(index_js_7.WithTooltip, { text: "Eliminar", children: (0, jsx_runtime_1.jsx)("button", { className: "bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2", onClick: (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                (0, index_js_4.createModal)({
                                    title: "¿Está seguro que quiere eliminar este registro?",
                                    description: "Una vez eliminada la información no podrá ser recuperada.",
                                }).then((response) => {
                                    if (response === "OK") {
                                        removeRow(rowData.id);
                                    }
                                });
                            }, type: "button", children: (0, jsx_runtime_1.jsx)(icons_1.TrashSvg, {}) }) }) }))] }, rowData.id));
    };
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [name && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericDynamicTableErrorComponent, { name: name }), (0, jsx_runtime_1.jsx)("input", { name: name, type: "hidden", value: JSON.stringify(tableData), hidden: true }), (0, jsx_runtime_1.jsx)("input", { name: `deleted_${name}`, type: "hidden", value: JSON.stringify(deletedData), hidden: true })] })), (0, jsx_runtime_1.jsxs)("div", { className: `${className}`, children: [searcheables.length > 0 && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(index_js_2.TextFieldWithoutValidation, { className: "mb-2", name: "search", title: `Buscar por: ${searcheables
                                .map((x) => x.label)
                                .join(", ")}`, onChange: handleChangeSearch, disabled: loading }) })), (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: renderHeader() }), (0, jsx_runtime_1.jsx)("tbody", { children: renderRows() }), footerRow && !editable ? ((0, jsx_runtime_1.jsx)("tfoot", { className: "border-t-2 border-black", children: (0, jsx_runtime_1.jsx)("tr", { children: Object.keys(footerRow ?? {})?.map((x, indx) => {
                                        return ((0, jsx_runtime_1.jsx)("td", { className: "align-middle", children: footerRow[x] }, indx));
                                    }) }) })) : editable ? ((0, jsx_runtime_1.jsx)("tfoot", { children: (0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { className: "align-middle", children: (0, jsx_runtime_1.jsx)("button", { className: "bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded", onClick: (event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                addRow();
                                            }, type: "button", children: "+" }) }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }), paginated && totalPages() > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mt-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(index_js_5.Button, { type: "button", disabled: currentPage === 1, onClickSave: () => setCurrentPage((old) => Math.max(old - 1, 1)), children: "Anterior" }), (0, jsx_runtime_1.jsx)("span", { className: "mx-2", children: `Página ${currentPage} de ${totalPages()}` }), (0, jsx_runtime_1.jsx)(index_js_5.Button, { type: "button", disabled: currentPage === totalPages(), onClickSave: () => setCurrentPage((old) => Math.min(old + 1, totalPages())), children: "Siguiente" })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("select", { value: itemsPerPage, onChange: (e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1); // resetear la página al cambiar los elementos por página
                                    }, children: itemsPerPageOptions.map((option) => ((0, jsx_runtime_1.jsxs)("option", { value: option, children: [option, " elementos por p\u00E1gina"] }, option))) }) })] }))] })] }));
};
exports.GenericDynamicTable = GenericDynamicTable;
