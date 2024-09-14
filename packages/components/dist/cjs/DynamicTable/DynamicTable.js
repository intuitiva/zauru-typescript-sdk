"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const index_js_1 = require("../Form/TextArea/index.js");
const index_js_2 = require("../Form/TextField/index.js");
const index_js_3 = require("../Form/Checkbox/index.js");
const DynamicTable = ({ forwardedRef, ...props }, ref) => {
    const [tableData, setTableData] = (0, react_1.useState)({});
    const { cellInputs, intersectionTitle, className, onChange, defaultValue, margins, } = props;
    (0, react_1.useEffect)(() => {
        if (onChange) {
            onChange(JSON.stringify(tableData));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableData]);
    (0, react_1.useEffect)(() => {
        if (defaultValue) {
            initializeTable(defaultValue);
        }
        else {
            initializeTableWithDefaults();
        }
    }, [defaultValue]);
    const getRows = () => {
        const rowsIds = Object.keys(tableData)
            .filter((key) => key.startsWith("row"))
            .map((key) => parseInt(key.slice(3)));
        return rowsIds.sort().map((id) => ({ id }));
    };
    const getCols = () => {
        const colsIds = Object.keys(tableData)
            .filter((key) => key.startsWith("column"))
            .map((key) => parseInt(key.slice(6)));
        return colsIds.sort().map((id) => ({ id }));
    };
    const addRow = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const rows = getRows();
        const lastId = rows[rows.length - 1].id;
        handleInputChange(`row${lastId + 1}`, 1);
    };
    const addCol = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const cols = getCols();
        const lastId = cols[cols.length - 1].id;
        handleInputChange(`column${lastId + 1}`, 1);
    };
    const removeRow = (rowId) => {
        const newRowData = { ...tableData };
        for (const key in newRowData) {
            if (key.startsWith(`row${rowId}`) || key.startsWith(`cell-${rowId}-`)) {
                delete newRowData[key];
            }
        }
        setTableData(newRowData);
    };
    const removeCol = (colId) => {
        const newRowData = { ...tableData };
        for (const key in newRowData) {
            if (key.startsWith(`column${colId}`) || key.endsWith(`-${colId}`)) {
                delete newRowData[key];
            }
        }
        setTableData(newRowData);
    };
    const getTotalForRow = (rowId) => {
        return Number(tableData[`row${rowId}`] ?? 0) ?? 0;
    };
    const getTotalForColumn = (colId) => {
        return Number(tableData[`column${colId}`] ?? 0) ?? 0;
    };
    const getTotalForRows = () => {
        return getRows()
            .map((row) => getTotalForRow(row.id))
            .reduce((a, b) => a + b, 0);
    };
    const getTotalForColumns = () => {
        return getCols()
            .map((col) => getTotalForColumn(col.id))
            .reduce((a, b) => a + b, 0);
    };
    const getRowsCount = () => {
        return getRows().length;
    };
    const getColumnsCount = () => {
        return getCols().length;
    };
    const handleInputChange = (name, value) => {
        setTableData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleValidation = (cellId, colId, rowId) => {
        const headerValue = tableData[`column${colId}`];
        const rowValue = tableData[`row${rowId}`];
        if (props.onValidate && props.onValidate(headerValue, rowValue)) {
            return handleInputChange(cellId, true);
        }
        return { stopUIChange: true };
    };
    const handleRemoveValidation = (cellId) => {
        handleInputChange(cellId, false);
    };
    const initializeTableWithDefaults = () => {
        const initialData = { row0: 1, column0: 1 };
        setTableData(initialData);
    };
    const initializeTable = (tableJson) => {
        try {
            const initialData = JSON.parse(tableJson);
            setTableData(initialData);
        }
        catch (error) {
            console.error("Error al inicializar la tabla:", error);
        }
    };
    const cellBordered = {
        border: "1px solid #ccc",
    };
    const pastelGrayBackground = {
        backgroundColor: "#B69E99",
    };
    const cellCenteredContent = {
        textAlign: "center",
        verticalAlign: "middle",
    };
    const renderTotalHeight = () => {
        const sumaFilas = getRows()
            .map((row) => getTotalForRow(row.id))
            .reduce((a, b) => a + b, 0);
        const sumTotalFilas = sumaFilas +
            (margins?.marginTop ?? 0) +
            (getRows().length - 1) * (margins?.verticalGap ?? 0);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "ml-4 inline-block", children: [(0, jsx_runtime_1.jsxs)("strong", { children: ["Total alto: ", sumTotalFilas, " "] }), margins && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["(Celdas: ", sumaFilas, " + M\u00E1rgen superior: ", margins?.marginTop ?? 0, " +", " ", getRows().length - 1, " Brechas verticales:", " ", Math.round((getRows().length - 1) * (margins?.verticalGap ?? 0)), ")"] }))] }));
    };
    const renderTotalWidth = () => {
        const cols = getCols();
        const sumaColumnas = cols
            .map((col) => getTotalForColumn(col.id))
            .reduce((a, b) => a + b, 0);
        const sumaTotal = sumaColumnas +
            (margins?.marginLeft ?? 0) +
            (getCols().length - 1) * (margins?.horizontalGap ?? 0);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "ml-4 inline-block", children: [(0, jsx_runtime_1.jsxs)("strong", { children: ["Total ancho: ", sumaTotal, " "] }), margins && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["(Celdas: ", sumaColumnas, " + M\u00E1rgen izquierdo:", " ", margins?.marginLeft ?? 0, " + ", getCols().length - 1, " Brechas horizontales:", " ", Math.round((getCols().length - 1) * (margins?.horizontalGap ?? 0)), ")"] }))] }));
    };
    const renderHeader = () => {
        const cols = getCols();
        return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "align-middle py-2 text-center", style: {
                        ...cellBordered,
                        ...pastelGrayBackground,
                    }, children: intersectionTitle ?? "" }), cols.map((col) => ((0, jsx_runtime_1.jsx)("th", { className: "align-middle py-2 text-center", style: { ...cellBordered, ...pastelGrayBackground }, children: (0, jsx_runtime_1.jsxs)("div", { className: "inline-flex", children: [(0, jsx_runtime_1.jsx)(index_js_2.TextField, { style: { maxWidth: "45%", minWidth: "45%" }, name: `column${col.id}`, defaultValue: tableData[`column${col.id}`] || 1, type: "number", onChange: (value) => handleInputChange(`column${col.id}`, value) }), col.id > 0 && ((0, jsx_runtime_1.jsx)("button", { className: "bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2", onClick: () => removeCol(col.id), children: "x" }))] }) }, col.id))), (0, jsx_runtime_1.jsx)("th", { children: (0, jsx_runtime_1.jsx)("button", { className: "bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded", onClick: addCol, children: "+" }) })] }));
    };
    const renderRow = (rowId) => {
        const cols = getCols();
        return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { className: "align-middle", style: {
                        ...cellBordered,
                        ...pastelGrayBackground,
                        textOverflow: "ellipsis",
                        msTextOverflow: "ellipsis",
                        maxWidth: "200px",
                    }, children: (0, jsx_runtime_1.jsxs)("div", { className: "inline-flex", children: [(0, jsx_runtime_1.jsx)(index_js_2.TextField, { style: { maxWidth: "45%", minWidth: "45%" }, name: `row${rowId}`, defaultValue: tableData[`row${rowId}`] || 1, type: "number", onChange: (value) => handleInputChange(`row${rowId}`, value) }), rowId > 0 && ((0, jsx_runtime_1.jsx)("button", { className: "bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2", onClick: () => {
                                    removeRow(rowId);
                                }, children: "x" }))] }) }), cols.map((col) => {
                    const cellId = `cell-${rowId}-${col.id}`;
                    const cellValidation = tableData[cellId] === true;
                    if (!cellInputs)
                        tableData[cellId] = cellValidation;
                    return ((0, jsx_runtime_1.jsx)("td", { id: cellId, style: { ...cellBordered, ...cellCenteredContent }, children: cellInputs ? ((0, jsx_runtime_1.jsx)(index_js_1.TextArea, { name: cellId, defaultValue: tableData[cellId] || "", onChange: (value) => handleInputChange(cellId, value) })) : ((0, jsx_runtime_1.jsx)(index_js_3.CheckBox, { name: cellId, defaultValue: cellValidation, onChange: (value) => {
                                if (value) {
                                    return handleValidation(cellId, col.id, rowId);
                                }
                                else {
                                    handleRemoveValidation(cellId);
                                }
                            } })) }, col.id));
                }), rowId === 0 && ((0, jsx_runtime_1.jsx)("td", { rowSpan: getRows().length, style: { maxWidth: "100px" }, children: renderTotalHeight() }))] }, rowId));
    };
    const renderRows = () => {
        const rows = getRows();
        return rows.map((row) => renderRow(row.id));
    };
    // Use el "useImperativeHandle" para que el componente padre pueda acceder a los métodos deseados
    react_1.default.useImperativeHandle(forwardedRef, () => ({
        getTotalForRows,
        getTotalForColumns,
        getColumnsCount,
        getRowsCount,
    }));
    return ((0, jsx_runtime_1.jsx)("div", { className: `${className}`, children: (0, jsx_runtime_1.jsxs)("table", { className: "border-collapse", children: [(0, jsx_runtime_1.jsx)("thead", { children: renderHeader() }), (0, jsx_runtime_1.jsx)("tbody", { children: renderRows() }), (0, jsx_runtime_1.jsx)("tfoot", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("button", { className: "bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded", onClick: addRow, children: "+" }) }), (0, jsx_runtime_1.jsx)("td", { colSpan: getCols().length + 1, className: "text-left align-middle", style: {
                                    textOverflow: "ellipsis",
                                    msTextOverflow: "ellipsis",
                                }, children: renderTotalWidth() })] }) })] }) }));
};
exports.DynamicTable = DynamicTable;
