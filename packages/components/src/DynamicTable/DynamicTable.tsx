import React, { useEffect, useState } from "react";
import { TextAreaWithoutValidation } from "../Form/TextArea";
import { TextFieldWithoutValidation } from "../Form/TextField";
import { CheckboxWithoutValidation } from "../Form/Checkbox";

type Props = {
  cellInputs?: boolean;
  intersectionTitle?: string;
  className?: string;
  onChange?: (data: string) => void;
  defaultValue?: string;
  onValidate?: (headerValue: string, rowValue: string) => boolean;
  onRemove?: () => void;
  margins?: {
    marginLeft?: number;
    marginTop?: number;
    verticalGap?: number;
    horizontalGap?: number;
  };
  forwardedRef?: React.RefObject<{
    getTotalForRows: () => number;
    getTotalForColumns: () => number;
    getColumnsCount: () => number;
    getRowsCount: () => number;
  }>;
};

export const DynamicTable = (
  { forwardedRef, ...props }: Props,
  ref: React.ForwardedRef<any>
) => {
  const [tableData, setTableData] = useState<Record<string, any>>({});

  const {
    cellInputs,
    intersectionTitle,
    className,
    onChange,
    defaultValue,
    margins,
  } = props;

  useEffect(() => {
    if (onChange) {
      onChange(JSON.stringify(tableData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  useEffect(() => {
    if (defaultValue) {
      initializeTable(defaultValue);
    } else {
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

  const addRow = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    const rows = getRows();
    const lastId = rows[rows.length - 1].id;
    handleInputChange(`row${lastId + 1}`, 1);
  };

  const addCol = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    const cols = getCols();
    const lastId = cols[cols.length - 1].id;
    handleInputChange(`column${lastId + 1}`, 1);
  };

  const removeRow = (rowId: number) => {
    const newRowData = { ...tableData };
    for (const key in newRowData) {
      if (key.startsWith(`row${rowId}`) || key.startsWith(`cell-${rowId}-`)) {
        delete newRowData[key];
      }
    }
    setTableData(newRowData);
  };

  const removeCol = (colId: number) => {
    const newRowData = { ...tableData };
    for (const key in newRowData) {
      if (key.startsWith(`column${colId}`) || key.endsWith(`-${colId}`)) {
        delete newRowData[key];
      }
    }
    setTableData(newRowData);
  };

  const getTotalForRow = (rowId: number) => {
    return Number(tableData[`row${rowId}`] ?? 0) ?? 0;
  };

  const getTotalForColumn = (colId: number) => {
    return Number(tableData[`column${colId}`] ?? 0) ?? 0;
  };

  const getTotalForRows = (): number => {
    return getRows()
      .map((row) => getTotalForRow(row.id))
      .reduce((a, b) => a + b, 0);
  };

  const getTotalForColumns = (): number => {
    return getCols()
      .map((col) => getTotalForColumn(col.id))
      .reduce((a, b) => a + b, 0);
  };

  const getRowsCount = (): number => {
    return getRows().length;
  };

  const getColumnsCount = (): number => {
    return getCols().length;
  };

  const handleInputChange = (name: string, value: any) => {
    setTableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleValidation = (
    cellId: string,
    colId: number,
    rowId: number
  ): { stopUIChange: boolean } | void => {
    const headerValue = tableData[`column${colId}`];
    const rowValue = tableData[`row${rowId}`];

    if (props.onValidate && props.onValidate(headerValue, rowValue)) {
      return handleInputChange(cellId, true);
    }
    return { stopUIChange: true };
  };

  const handleRemoveValidation = (cellId: string) => {
    handleInputChange(cellId, false);
  };

  const initializeTableWithDefaults = () => {
    const initialData = { row0: 1, column0: 1 };
    setTableData(initialData);
  };

  const initializeTable = (tableJson: string) => {
    try {
      const initialData = JSON.parse(tableJson);
      setTableData(initialData);
    } catch (error) {
      console.error("Error al inicializar la tabla:", error);
    }
  };

  const cellBordered = {
    border: "1px solid #ccc",
  } as React.CSSProperties;

  const pastelGrayBackground = {
    backgroundColor: "#B69E99",
  } as React.CSSProperties;

  const cellCenteredContent = {
    textAlign: "center",
    verticalAlign: "middle",
  } as React.CSSProperties;

  const renderTotalHeight = () => {
    const sumaFilas = getRows()
      .map((row) => getTotalForRow(row.id))
      .reduce((a, b) => a + b, 0);

    const sumTotalFilas =
      sumaFilas +
      (margins?.marginTop ?? 0) +
      (getRows().length - 1) * (margins?.verticalGap ?? 0);

    return (
      <div className="ml-4 inline-block">
        <strong>Total alto: {sumTotalFilas} </strong>
        {margins && (
          <>
            (Celdas: {sumaFilas} + Márgen superior: {margins?.marginTop ?? 0} +{" "}
            {getRows().length - 1} Brechas verticales:{" "}
            {Math.round((getRows().length - 1) * (margins?.verticalGap ?? 0))})
          </>
        )}
      </div>
    );
  };

  const renderTotalWidth = () => {
    const cols = getCols();
    const sumaColumnas = cols
      .map((col) => getTotalForColumn(col.id))
      .reduce((a, b) => a + b, 0);
    const sumaTotal =
      sumaColumnas +
      (margins?.marginLeft ?? 0) +
      (getCols().length - 1) * (margins?.horizontalGap ?? 0);
    return (
      <div className="ml-4 inline-block">
        <strong>Total ancho: {sumaTotal} </strong>
        {margins && (
          <>
            (Celdas: {sumaColumnas} + Márgen izquierdo:{" "}
            {margins?.marginLeft ?? 0} + {getCols().length - 1} Brechas
            horizontales:{" "}
            {Math.round((getCols().length - 1) * (margins?.horizontalGap ?? 0))}
            )
          </>
        )}
      </div>
    );
  };

  const renderHeader = () => {
    const cols = getCols();
    return (
      <tr>
        <th
          className="align-middle py-2 text-center"
          style={{
            ...cellBordered,
            ...pastelGrayBackground,
          }}
        >
          {intersectionTitle ?? ""}
        </th>
        {cols.map((col) => (
          <th
            key={col.id}
            className="align-middle py-2 text-center"
            style={{ ...cellBordered, ...pastelGrayBackground }}
          >
            <div className="inline-flex">
              <TextFieldWithoutValidation
                style={{ maxWidth: "45%", minWidth: "45%" }}
                name={`column${col.id}`}
                defaultValue={tableData[`column${col.id}`] || 1}
                type="number"
                onChange={(value) =>
                  handleInputChange(`column${col.id}`, value)
                }
              />
              {col.id > 0 && (
                <button
                  className="bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2"
                  onClick={() => removeCol(col.id)}
                >
                  x
                </button>
              )}
            </div>
          </th>
        ))}
        <th>
          <button
            className="bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded"
            onClick={addCol}
          >
            +
          </button>
        </th>
      </tr>
    );
  };

  const renderRow = (rowId: number) => {
    const cols = getCols();
    return (
      <tr key={rowId}>
        <td
          className="align-middle"
          style={{
            ...cellBordered,
            ...pastelGrayBackground,
            textOverflow: "ellipsis",
            msTextOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          <div className="inline-flex">
            <TextFieldWithoutValidation
              style={{ maxWidth: "45%", minWidth: "45%" }}
              name={`row${rowId}`}
              defaultValue={tableData[`row${rowId}`] || 1}
              type="number"
              onChange={(value) => handleInputChange(`row${rowId}`, value)}
            />
            {rowId > 0 && (
              <button
                className="bg-red-500 hover:bg-red-600 font-bold py-1 px-2 rounded ml-2"
                onClick={() => {
                  removeRow(rowId);
                }}
              >
                x
              </button>
            )}
          </div>
        </td>
        {cols.map((col) => {
          const cellId = `cell-${rowId}-${col.id}`;
          const cellValidation = tableData[cellId] === true;
          if (!cellInputs) tableData[cellId] = cellValidation;

          return (
            <td
              key={col.id}
              id={cellId}
              style={{ ...cellBordered, ...cellCenteredContent }}
            >
              {cellInputs ? (
                <TextAreaWithoutValidation
                  name={cellId}
                  defaultValue={tableData[cellId] || ""}
                  onChange={(value) => handleInputChange(cellId, value)}
                />
              ) : (
                <CheckboxWithoutValidation
                  name={cellId}
                  defaultValue={cellValidation}
                  onChange={(value) => {
                    if (value) {
                      return handleValidation(cellId, col.id, rowId);
                    } else {
                      handleRemoveValidation(cellId);
                    }
                  }}
                />
              )}
            </td>
          );
        })}
        {rowId === 0 && (
          <td rowSpan={getRows().length} style={{ maxWidth: "100px" }}>
            {renderTotalHeight()}
          </td>
        )}
      </tr>
    );
  };

  const renderRows = () => {
    const rows = getRows();
    return rows.map((row) => renderRow(row.id));
  };

  // Use el "useImperativeHandle" para que el componente padre pueda acceder a los métodos deseados
  React.useImperativeHandle(forwardedRef, () => ({
    getTotalForRows,
    getTotalForColumns,
    getColumnsCount,
    getRowsCount,
  }));

  return (
    <div className={`${className}`}>
      <table className="border-collapse">
        <thead>{renderHeader()}</thead>
        <tbody>{renderRows()}</tbody>
        <tfoot>
          <tr>
            <td>
              <button
                className="bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded"
                onClick={addRow}
              >
                +
              </button>
            </td>
            <td
              colSpan={getCols().length + 1}
              className="text-left align-middle"
              style={{
                textOverflow: "ellipsis",
                msTextOverflow: "ellipsis",
              }}
            >
              {renderTotalWidth()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
