import React from "react";
import {
  isAutomaticRejectionRuleHistoryType,
  toFixedIfNeeded,
} from "@zauru-sdk/common";

export type RejectionPercentageHistoryItem = {
  discount: number;
  description?: string;
  agency_id?: number;
  employee_id?: number;
  employee_name?: string;
  created_at?: string;
  type?: string;
  successive?: boolean;
  observations?: string;
};

type NamedRecord = {
  id?: number;
  name?: string;
};

export type RejectionPercentageHistoryListProps = {
  items: RejectionPercentageHistoryItem[];
  employees?: NamedRecord[];
  agencies?: NamedRecord[];
  actorLabel?: string;
  emptyText?: string;
  className?: string;
};

const formatHistoryDate = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", "");
};

const formatSignedPercentage = (
  value: number,
  forceSign: boolean,
): string => {
  const formatted = toFixedIfNeeded(Math.abs(value));
  if (value < 0) return `-${formatted}%`;
  if (forceSign && value > 0) return `+${formatted}%`;
  return `${formatted}%`;
};

const findName = (
  records: NamedRecord[] | undefined,
  id: number | undefined,
): string | undefined => {
  if (id == null) return undefined;
  return records?.find((record) => record.id === id)?.name;
};

export const RejectionPercentageHistoryList = ({
  items,
  employees,
  agencies,
  actorLabel = "Empleado",
  emptyText = "No hay historial de porcentajes registrado",
  className = "",
}: RejectionPercentageHistoryListProps) => {
  if (!items.length) {
    return <p className="text-gray-500 italic">{emptyText}</p>;
  }

  return (
    <div className={`space-y-3 max-h-60 overflow-y-auto ${className}`.trim()}>
      {items.map((item, index) => {
        const isAutomatic = isAutomaticRejectionRuleHistoryType(item.type);
        const isSuccessive = item.successive === true;
        const employeeName =
          item.employee_name?.trim() ||
          findName(employees, item.employee_id) ||
          (item.employee_id != null ? `ID: ${item.employee_id}` : "No especificado");
        const agencyName =
          findName(agencies, item.agency_id) ||
          (item.agency_id != null ? `ID: ${item.agency_id}` : "No especificada");
        const description = item.description || "Sin descripción";
        const observations = item.observations?.trim() ?? "";
        const noteClassName = isSuccessive
          ? "text-sm text-amber-900 mb-1"
          : isAutomatic
            ? "text-sm text-indigo-900 mb-1"
            : "text-sm text-gray-700 mb-1";

        return (
          <div
            key={`${item.created_at ?? "entry"}-${item.type ?? "manual"}-${index}`}
            className={
              isSuccessive
                ? "border border-amber-200 rounded-lg p-3 bg-amber-50"
                : isAutomatic
                ? "border border-indigo-200 rounded-lg p-3 bg-indigo-50"
                : "border border-gray-100 rounded-lg p-3 bg-gray-50"
            }
          >
            <div className="flex justify-between items-start gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={
                    isSuccessive
                      ? "font-semibold text-amber-800"
                      : isAutomatic
                      ? "font-semibold text-indigo-800"
                      : "font-semibold text-blue-600"
                  }
                >
                  {formatSignedPercentage(Number(item.discount) || 0, isAutomatic)}
                </span>
                {isSuccessive ? (
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Sucesivo
                  </span>
                ) : null}
                {isAutomatic ? (
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                    Automático
                  </span>
                ) : null}
              </div>
              {item.created_at ? (
                <span className="text-xs text-gray-500 shrink-0">
                  {formatHistoryDate(item.created_at)}
                </span>
              ) : null}
            </div>
            <p className={noteClassName} title={description}>
              {description}
            </p>
            {observations ? (
              <p className={`${noteClassName} break-words whitespace-pre-wrap`}>
                <span className="font-medium">Motivo: </span>
                {observations}
              </p>
            ) : null}
            <div className="flex justify-between gap-3 text-xs text-gray-500">
              <span className="min-w-0">
                {isAutomatic
                  ? "Aplicado por el sistema"
                  : `${actorLabel}: ${employeeName}`}
              </span>
              <span className="shrink-0">Agencia: {agencyName}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
