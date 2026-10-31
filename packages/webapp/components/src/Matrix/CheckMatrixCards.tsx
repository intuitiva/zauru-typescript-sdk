import React, { ReactNode, useEffect, useState } from "react";

export type CheckMatrixColumn = {
  key: string;
  label: ReactNode;
};

export type CheckMatrixRow = {
  key: string;
  label: ReactNode;
  description?: ReactNode;
};

export interface CheckMatrixCardsProps {
  rows: CheckMatrixRow[];
  columns: CheckMatrixColumn[];
  isChecked: (rowKey: string, columnKey: string) => boolean;
  isPending?: (rowKey: string, columnKey: string) => boolean;
  onToggle: (rowKey: string, columnKey: string, checked: boolean) => void;
  disabled?: boolean;
  renderRowAction?: (row: CheckMatrixRow) => ReactNode;
  checkedLabel?: string;
  uncheckedLabel?: string;
  pendingLabel?: string;
  emptyText?: string;
  pageSize?: number;
  showMoreLabel?: string;
  className?: string;
}

export const CheckMatrixCards = ({
  rows,
  columns,
  isChecked,
  isPending = () => false,
  onToggle,
  disabled = false,
  renderRowAction,
  checkedLabel = "Marcado",
  uncheckedLabel = "Sin marcar",
  pendingLabel = "Guardando…",
  emptyText = "No hay filas para mostrar.",
  pageSize = 20,
  showMoreLabel = "Mostrar más",
  className = "",
}: CheckMatrixCardsProps) => {
  const safePageSize = Math.max(1, pageSize);
  const [visibleCount, setVisibleCount] = useState(safePageSize);

  useEffect(() => {
    setVisibleCount(safePageSize);
  }, [rows, safePageSize]);

  if (rows.length === 0) {
    return <p className={`p-4 text-sm text-gray-600 ${className}`}>{emptyText}</p>;
  }

  const visibleRows = rows.slice(0, visibleCount);

  return (
    <div className={`space-y-3 ${className}`}>
      {visibleRows.map((row) => (
        <fieldset
          key={row.key}
          className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
        >
          <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
            <legend className="min-w-0 flex-1 px-0 text-sm font-semibold text-gray-900">
              <span className="block break-words">{row.label}</span>
              {row.description ? (
                <span className="mt-0.5 block break-words text-xs font-normal text-gray-600">
                  {row.description}
                </span>
              ) : null}
            </legend>
            {renderRowAction ? (
              <div className="shrink-0">{renderRowAction(row)}</div>
            ) : null}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {columns.map((column) => {
              const checked = isChecked(row.key, column.key);
              const pending = isPending(row.key, column.key);
              const inputId = `check-matrix-${encodeURIComponent(row.key)}-${encodeURIComponent(column.key)}`;
              return (
                <label
                  key={column.key}
                  htmlFor={inputId}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1 ${
                    checked
                      ? "border-indigo-200 bg-indigo-50 text-indigo-950"
                      : "border-gray-200 bg-gray-50 text-gray-800"
                  } ${pending || disabled ? "cursor-not-allowed opacity-70" : "hover:border-indigo-300"}`}
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled || pending}
                    onChange={(event) =>
                      onToggle(row.key, column.key, event.target.checked)
                    }
                    className="h-5 w-5 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="min-w-0 flex-1 break-words font-medium">
                    {column.label}
                  </span>
                  <span
                    className={`shrink-0 text-xs font-medium ${
                      checked ? "text-indigo-700" : "text-gray-600"
                    }`}
                    aria-live={pending ? "polite" : undefined}
                  >
                    {pending
                      ? pendingLabel
                      : checked
                        ? checkedLabel
                        : uncheckedLabel}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      {visibleCount < rows.length ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + safePageSize)}
          className="min-h-11 w-full cursor-pointer rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {showMoreLabel} ({rows.length - visibleCount})
        </button>
      ) : null}
    </div>
  );
};
