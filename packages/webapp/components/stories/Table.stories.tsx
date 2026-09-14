import { GenericDynamicTable } from "../src/DynamicTable/GenericDynamicTable.js";
import { ZauruTable } from "../src/Table/ZauruTable.js";

export const Dynamic = () => (
  <GenericDynamicTable
    name="lineas"
    withoutBg
    paginated={false}
    defaultValue={[{ id: "1", producto: "Tomate", cantidad: 2 }]}
    rowSummary={(row) => `Cantidad: ${row.cantidad ?? 0}`}
    columns={[
      { label: "Producto", name: "producto", type: "textField" },
      {
        label: "Cantidad",
        name: "cantidad",
        type: "textField",
        textFieldType: "number",
      },
    ]}
  />
);

export const DataTable = () => (
  <ZauruTable
    columns={[
      { name: "Nombre", selector: (row: { name: string }) => row.name },
      { name: "Estado", selector: (row: { status: string }) => row.status },
    ]}
    data={[
      { name: "Factura 1", status: "Abierta" },
      { name: "Factura 2", status: "Cerrada" },
    ]}
    whitOutPagination
    search={{ placeholderSearch: "Filtrar" }}
    offlineSearch={["name", "status"]}
  />
);
