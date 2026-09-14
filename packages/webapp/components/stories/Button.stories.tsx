import { ActionList } from "../src/Buttons/ActionList.js";
import { Button } from "../src/Buttons/Button.js";

export const Default = () => <Button title="Guardar" />;

export const Loading = () => (
  <Button title="Guardar" loading loadingText="Guardando..." />
);

export const Disabled = () => <Button title="Guardar" disabled />;

export const Colors = () => (
  <div className="flex flex-wrap gap-2">
    <Button title="Indigo" selectedColor="indigo" />
    <Button title="Green" selectedColor="green" />
    <Button title="Red" selectedColor="red" />
    <Button title="Yellow" selectedColor="yellow" />
    <Button title="Gray" selectedColor="gray" />
  </div>
);

export const Dropdown = () => (
  <Button
    title="Acciones"
    dropdownTitle="Acciones"
    dropdownOptions={[
      { label: "Exportar", value: "export", onClick: () => undefined },
      { label: "Imprimir", value: "print", onClick: () => undefined },
    ]}
  />
);

export const Actions = () => (
  <ActionList
    items={[
      {
        key: "pdf",
        badge: "PDF",
        badgeClassName: "bg-red-50 text-red-700",
        label: "Imprimir reporte",
        onClick: () => undefined,
      },
      {
        key: "xls",
        badge: "XLS",
        badgeClassName: "bg-green-50 text-green-700",
        label: "Exportar Excel",
        onClick: () => undefined,
      },
    ]}
  />
);
