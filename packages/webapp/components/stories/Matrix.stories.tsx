import { useState } from "react";
import { ResponsiveCheckMatrix } from "../src/Matrix/ResponsiveCheckMatrix.js";

const rows = [
  { key: "129", label: "129 · Cooperativa El Progreso", description: "San Juan" },
  { key: "302", label: "302 · Productor con un nombre largo para validar el ajuste de texto" },
];
const columns = [
  { key: "brocoli", label: "Brócoli certificado" },
  { key: "radicchio", label: "Radicchio" },
  { key: "elotin", label: "Elotín" },
];

export const Responsive = () => {
  const [blocked, setBlocked] = useState(new Set(["129:radicchio"]));
  const isChecked = (rowKey: string, columnKey: string) =>
    !blocked.has(`${rowKey}:${columnKey}`);
  const onToggle = (rowKey: string, columnKey: string, checked: boolean) => {
    setBlocked((current) => {
      const next = new Set(current);
      const key = `${rowKey}:${columnKey}`;
      if (checked) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const desktop = (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">Proveedor</th>
            {columns.map((column) => (
              <th key={column.key} className="px-3 py-2 text-center">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-gray-200">
              <th className="px-3 py-2 text-left">{row.label}</th>
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    aria-label={`${String(row.label)}, ${String(column.label)}`}
                    checked={isChecked(row.key, column.key)}
                    onChange={(event) =>
                      onToggle(row.key, column.key, event.target.checked)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ResponsiveCheckMatrix
      rows={rows}
      columns={columns}
      desktop={desktop}
      isChecked={isChecked}
      onToggle={onToggle}
      checkedLabel="Permitida"
      uncheckedLabel="Bloqueada"
    />
  );
};
