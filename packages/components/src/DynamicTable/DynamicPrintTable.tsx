import React, { useEffect, useCallback, useState, type ReactNode } from "react";
import { TextFieldWithoutValidation } from "./../index";
import { SelectFieldWithoutValidation } from "./../index";
import type { SingleValue } from "react-select";
import { useAppSelector } from "@zauru-sdk/redux";
import { SelectFieldOption } from "@zauru-sdk/types";

export type TableStateItem = {
  item_id: string | undefined;
  quantity: number | undefined;
};

export type FormatedItem = {
  label: string;
  value: number;
  template: string;
};

type Props = {
  name: string;
  formName?: string;
  className?: string;
  items: FormatedItem[];
  onChange?: (tableState?: TableStateItem[]) => void;
  forwardedRef?: React.RefObject<{
    insertItems: (items: FormatedItem[]) => void;
    getTableState: (
      updatedData?: ReactNode[][]
    ) => TableStateItem[] | undefined;
  }>;
};

const errorAnimation = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export const DynamicPrintTable = ({ forwardedRef, ...props }: Props) => {
  const { items, onChange, className } = props;
  const { formValidations } = useAppSelector((state) => state.formValidation);

  const createItemSelect = (
    rowIndex: number,
    defaultValue?: SelectFieldOption
  ) => (
    <SelectFieldWithoutValidation
      key={rowIndex}
      name="item_select"
      isClearable
      onChange={(value: SingleValue<SelectFieldOption>) => {
        const selectedItem = items?.find((x) => x.value === value?.value);
        updateRow(rowIndex, selectedItem);
      }}
      options={items}
      defaultValue={defaultValue}
    />
  );

  const createItemQuantity = (rowIndex: number, defaultValue?: number) => (
    <TextFieldWithoutValidation
      key={rowIndex}
      name="item_quantity"
      type="number"
      integer
      defaultValue={defaultValue ?? 1}
      min={1}
      onChange={(value: string) => {
        updateRow(rowIndex, undefined, Number(value));
      }}
    />
  );

  const createTemplateName = (rowIndex: number, defaultValue?: string) => (
    <div key={rowIndex}>
      {defaultValue != "" ? defaultValue : "No hay etiqueta"}
    </div>
  );

  const createRow = (
    rowIndex: number,
    item?: FormatedItem,
    quantity?: number
  ) => {
    const itemCreated = createItemSelect(rowIndex, item ?? undefined);
    const quantityCreated = createItemQuantity(rowIndex, quantity ?? 1);
    const templateCreated = createTemplateName(
      rowIndex,
      item ? item.template : "Seleccione un item para visualizar su etiqueta."
    );
    return [itemCreated, quantityCreated, templateCreated];
  };

  const [tableData, setTableData] = useState<ReactNode[][] | undefined>([]);
  const [isInitialItemAdded, setIsInitialItemAdded] = useState<boolean>(false);

  const insertItems = useCallback(
    (newItems: FormatedItem[]) => {
      setTableData((prevData) => [
        ...(prevData ?? []),
        ...newItems.map((item, index) => {
          const rowIndex = (prevData?.length ?? 0) + index;
          const [itemCreated, quantityCreated, templateCreated] = createRow(
            rowIndex,
            item
          );
          updateRow(rowIndex, item, 1);
          return [itemCreated, quantityCreated, templateCreated];
        }),
      ]);
    },
    [items]
  );

  const getTableState = (temp?: ReactNode[][]) => {
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
      } as TableStateItem;
    });
    return tableState;
  };

  const updateRow = (
    rowIndex: number,
    item?: FormatedItem,
    quantity?: number
  ) => {
    setTableData((prevData) => {
      const updatedData = prevData?.map((_, index) => {
        if (index === rowIndex) {
          const firstElement = prevData[index][0];
          const selectedItem =
            item ??
            (React.isValidElement(firstElement)
              ? items?.find(
                  (x) => x.value === firstElement.props.defaultValue?.value
                )
              : undefined);

          const secondElement = prevData[index][1];
          const newQuantity = quantity
            ? quantity
            : React.isValidElement(secondElement)
            ? secondElement.props.defaultValue
            : undefined;

          return createRow(rowIndex, selectedItem, newQuantity);
        } else {
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

  const removeRow = (rowIndex: number) => {
    setTableData((prevData) =>
      prevData?.filter((_, index) => index !== rowIndex)
    );
  };

  React.useImperativeHandle(forwardedRef, () => ({
    insertItems,
    getTableState,
  }));

  const pastelGrayBackground = {
    backgroundColor: "#B69E99",
  } as React.CSSProperties;

  const renderHeader = () => (
    <tr style={{ ...pastelGrayBackground }}>
      <th className="text-left align-middle p-2">Item</th>
      <th className="text-left align-middle p-2">Cantidad</th>
      <th className="text-left align-middle p-2">Etiqueta</th>
      <th className="w-16"></th>
    </tr>
  );

  const renderRow = (rowData: ReactNode[], rowIndex: number) => (
    <tr key={rowIndex}>
      {rowData.map((cellData, cellIndex) => (
        <td key={cellIndex} className="align-middle p-2">
          {cellData}
        </td>
      ))}
      {rowIndex !== 0 && (
        <td className="align-middle w-16">
          <button
            className="bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              event.stopPropagation();
              removeRow(rowIndex);
            }}
            type="button"
          >
            x
          </button>
        </td>
      )}
    </tr>
  );

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

  return (
    <div
      className={`${className} ${borderColor} border-2`}
      style={{ overflowX: "auto" }}
    >
      {!!error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <table className="w-full">
        <thead>{renderHeader()}</thead>
        <tbody>{renderRows()}</tbody>
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
            <td colSpan={2}>
              Total de etiquetas a imprimir:{" "}
              {tableData?.reduce((sum, x) => {
                const val = React.isValidElement(x[1])
                  ? x[1]?.props?.defaultValue
                  : undefined;
                if (!sum) return val;
                return sum + val;
              }, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
