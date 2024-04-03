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
exports.DynamicPrintTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const index_js_1 = require("../Form/TextField/index.js");
const index_js_2 = require("../Form/SelectField/index.js");
const redux_1 = require("@zauru-sdk/redux");
const errorAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
};
const DynamicPrintTable = ({ forwardedRef, ...props }) => {
    const { items, onChange, className } = props;
    const { formValidations } = (0, redux_1.useAppSelector)((state) => state.formValidation);
    const createItemSelect = (rowIndex, defaultValue) => ((0, jsx_runtime_1.jsx)(index_js_2.SelectFieldWithoutValidation, { name: "item_select", isClearable: true, onChange: (value) => {
            const selectedItem = items?.find((x) => x.value === value?.value);
            updateRow(rowIndex, selectedItem);
        }, options: items, defaultValue: defaultValue }, rowIndex));
    const createItemQuantity = (rowIndex, defaultValue) => ((0, jsx_runtime_1.jsx)(index_js_1.TextFieldWithoutValidation, { name: "item_quantity", type: "number", integer: true, defaultValue: defaultValue ?? 1, min: 1, onChange: (value) => {
            updateRow(rowIndex, undefined, Number(value));
        } }, rowIndex));
    const createTemplateName = (rowIndex, defaultValue) => ((0, jsx_runtime_1.jsx)("div", { children: defaultValue != "" ? defaultValue : "No hay etiqueta" }, rowIndex));
    const createRow = (rowIndex, item, quantity) => {
        const itemCreated = createItemSelect(rowIndex, item ?? undefined);
        const quantityCreated = createItemQuantity(rowIndex, quantity ?? 1);
        const templateCreated = createTemplateName(rowIndex, item ? item.template : "Seleccione un item para visualizar su etiqueta.");
        return [itemCreated, quantityCreated, templateCreated];
    };
    const [tableData, setTableData] = (0, react_1.useState)([]);
    const [isInitialItemAdded, setIsInitialItemAdded] = (0, react_1.useState)(false);
    const insertItems = (0, react_1.useCallback)((newItems) => {
        setTableData((prevData) => [
            ...(prevData ?? []),
            ...newItems.map((item, index) => {
                const rowIndex = (prevData?.length ?? 0) + index;
                const [itemCreated, quantityCreated, templateCreated] = createRow(rowIndex, item);
                updateRow(rowIndex, item, 1);
                return [itemCreated, quantityCreated, templateCreated];
            }),
        ]);
    }, [items]);
    const getTableState = (temp) => {
        const updatedData = temp ?? tableData;
        const tableState = updatedData?.map((rowData) => {
            const firstElement = rowData[0];
            const item_id = react_1.default.isValidElement(firstElement)
                ? firstElement.props.defaultValue?.value
                : undefined;
            const secondElement = rowData[1];
            const quantity = react_1.default.isValidElement(secondElement)
                ? secondElement.props.defaultValue
                : undefined;
            return {
                item_id,
                quantity,
            };
        });
        return tableState;
    };
    const updateRow = (rowIndex, item, quantity) => {
        setTableData((prevData) => {
            const updatedData = prevData?.map((_, index) => {
                if (index === rowIndex) {
                    const firstElement = prevData[index][0];
                    const selectedItem = item ??
                        (react_1.default.isValidElement(firstElement)
                            ? items?.find((x) => x.value === firstElement.props.defaultValue?.value)
                            : undefined);
                    const secondElement = prevData[index][1];
                    const newQuantity = quantity
                        ? quantity
                        : react_1.default.isValidElement(secondElement)
                            ? secondElement.props.defaultValue
                            : undefined;
                    return createRow(rowIndex, selectedItem, newQuantity);
                }
                else {
                    return prevData[index];
                }
            });
            if (onChange) {
                const tableState = getTableState(updatedData);
                onChange(tableState);
            }
            return updatedData;
        });
    };
    const addRow = () => {
        setTableData((prevData) => [
            ...(prevData ?? []),
            createRow(prevData?.length ?? 0),
        ]);
    };
    const removeRow = (rowIndex) => {
        setTableData((prevData) => prevData?.filter((_, index) => index !== rowIndex));
    };
    react_1.default.useImperativeHandle(forwardedRef, () => ({
        insertItems,
        getTableState,
    }));
    const pastelGrayBackground = {
        backgroundColor: "#B69E99",
    };
    const renderHeader = () => ((0, jsx_runtime_1.jsxs)("tr", { style: { ...pastelGrayBackground }, children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left align-middle p-2", children: "Item" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left align-middle p-2", children: "Cantidad" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left align-middle p-2", children: "Etiqueta" }), (0, jsx_runtime_1.jsx)("th", { className: "w-16" })] }));
    const renderRow = (rowData, rowIndex) => ((0, jsx_runtime_1.jsxs)("tr", { children: [rowData.map((cellData, cellIndex) => ((0, jsx_runtime_1.jsx)("td", { className: "align-middle p-2", children: cellData }, cellIndex))), rowIndex !== 0 && ((0, jsx_runtime_1.jsx)("td", { className: "align-middle w-16", children: (0, jsx_runtime_1.jsx)("button", { className: "bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2", onClick: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeRow(rowIndex);
                    }, type: "button", children: "x" }) }))] }, rowIndex));
    const renderRows = () => {
        return tableData?.map((rowData, rowIndex) => renderRow(rowData, rowIndex));
    };
    const error = formValidations[props.formName ?? "-1"][props.name];
    const borderColor = error ? "border-red-500" : "border-transparent";
    (0, react_1.useEffect)(() => {
        if (!isInitialItemAdded && items?.length > 0) {
            insertItems([items[0]]);
            setIsInitialItemAdded(true);
        }
    }, [isInitialItemAdded, items, insertItems]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `${className} ${borderColor} border-2`, style: { overflowX: "auto" }, children: [!!error && (0, jsx_runtime_1.jsx)("div", { className: "text-red-500 text-sm mb-2", children: error }), (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: renderHeader() }), (0, jsx_runtime_1.jsx)("tbody", { children: renderRows() }), (0, jsx_runtime_1.jsx)("tfoot", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { className: "align-middle", children: (0, jsx_runtime_1.jsx)("button", { className: "bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded", onClick: (event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            addRow();
                                        }, type: "button", children: "+" }) }), (0, jsx_runtime_1.jsxs)("td", { colSpan: 2, children: ["Total de etiquetas a imprimir:", " ", tableData?.reduce((sum, x) => {
                                            const val = react_1.default.isValidElement(x[1])
                                                ? x[1]?.props?.defaultValue
                                                : undefined;
                                            if (!sum)
                                                return val;
                                            return sum + val;
                                        }, 0)] })] }) })] })] }));
};
exports.DynamicPrintTable = DynamicPrintTable;
