import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useCallback, useState } from "react";
import { TextFieldWithoutValidation } from "./../index";
import { SelectFieldWithoutValidation } from "./../index";
import { useAppSelector } from "@zauru-sdk/redux";
const errorAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
};
const DynamicPrintTable = ({ forwardedRef, ...props }) => {
    const { items, onChange, className } = props;
    const { formValidations } = useAppSelector((state) => state.formValidation);
    const createItemSelect = (rowIndex, defaultValue) => (_jsx(SelectFieldWithoutValidation, { name: "item_select", isClearable: true, onChange: (value) => {
            const selectedItem = items?.find((x) => x.value === value?.value);
            updateRow(rowIndex, selectedItem);
        }, options: items, defaultValue: defaultValue }, rowIndex));
    const createItemQuantity = (rowIndex, defaultValue) => (_jsx(TextFieldWithoutValidation, { name: "item_quantity", type: "number", integer: true, defaultValue: defaultValue ?? 1, min: 1, onChange: (value) => {
            updateRow(rowIndex, undefined, Number(value));
        } }, rowIndex));
    const createTemplateName = (rowIndex, defaultValue) => (_jsx("div", { children: defaultValue != "" ? defaultValue : "No hay etiqueta" }, rowIndex));
    const createRow = (rowIndex, item, quantity) => {
        const itemCreated = createItemSelect(rowIndex, item ?? undefined);
        const quantityCreated = createItemQuantity(rowIndex, quantity ?? 1);
        const templateCreated = createTemplateName(rowIndex, item ? item.template : "Seleccione un item para visualizar su etiqueta.");
        return [itemCreated, quantityCreated, templateCreated];
    };
    const [tableData, setTableData] = useState([]);
    const [isInitialItemAdded, setIsInitialItemAdded] = useState(false);
    const insertItems = useCallback((newItems) => {
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
            const item_id = React.isValidElement(firstElement)
                ? firstElement.props.defaultValue?.value
                : undefined;
            const secondElement = rowData[1];
            const quantity = React.isValidElement(secondElement)
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
                        (React.isValidElement(firstElement)
                            ? items?.find((x) => x.value === firstElement.props.defaultValue?.value)
                            : undefined);
                    const secondElement = prevData[index][1];
                    const newQuantity = quantity
                        ? quantity
                        : React.isValidElement(secondElement)
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
    React.useImperativeHandle(forwardedRef, () => ({
        insertItems,
        getTableState,
    }));
    const pastelGrayBackground = {
        backgroundColor: "#B69E99",
    };
    const renderHeader = () => (_jsxs("tr", { style: { ...pastelGrayBackground }, children: [_jsx("th", { className: "text-left align-middle p-2", children: "Item" }), _jsx("th", { className: "text-left align-middle p-2", children: "Cantidad" }), _jsx("th", { className: "text-left align-middle p-2", children: "Etiqueta" }), _jsx("th", { className: "w-16" })] }));
    const renderRow = (rowData, rowIndex) => (_jsxs("tr", { children: [rowData.map((cellData, cellIndex) => (_jsx("td", { className: "align-middle p-2", children: cellData }, cellIndex))), rowIndex !== 0 && (_jsx("td", { className: "align-middle w-16", children: _jsx("button", { className: "bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2", onClick: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeRow(rowIndex);
                    }, type: "button", children: "x" }) }))] }, rowIndex));
    const renderRows = () => {
        return tableData?.map((rowData, rowIndex) => renderRow(rowData, rowIndex));
    };
    const error = formValidations[props.formName ?? "-1"][props.name];
    const borderColor = error ? "border-red-500" : "border-transparent";
    useEffect(() => {
        if (!isInitialItemAdded && items?.length > 0) {
            insertItems([items[0]]);
            setIsInitialItemAdded(true);
        }
    }, [isInitialItemAdded, items, insertItems]);
    return (_jsxs("div", { className: `${className} ${borderColor} border-2`, style: { overflowX: "auto" }, children: [!!error && _jsx("div", { className: "text-red-500 text-sm mb-2", children: error }), _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: renderHeader() }), _jsx("tbody", { children: renderRows() }), _jsx("tfoot", { children: _jsxs("tr", { children: [_jsx("td", { className: "align-middle", children: _jsx("button", { className: "bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded", onClick: (event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            addRow();
                                        }, type: "button", children: "+" }) }), _jsxs("td", { colSpan: 2, children: ["Total de etiquetas a imprimir:", " ", tableData?.reduce((sum, x) => {
                                            const val = React.isValidElement(x[1])
                                                ? x[1]?.props?.defaultValue
                                                : undefined;
                                            if (!sum)
                                                return val;
                                            return sum + val;
                                        }, 0)] })] }) })] })] }));
};
export default React.forwardRef(DynamicPrintTable);
