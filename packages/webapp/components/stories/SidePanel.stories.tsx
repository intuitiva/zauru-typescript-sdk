import { SidePanel } from "../src/SidePanel/index.js";

export const Filters = () => (
  <div className="min-h-[36rem] bg-gray-50 p-6">
    <p className="text-sm text-gray-700">
      Use el botón fijo para abrir los filtros.
    </p>
    <SidePanel buttonIcon="filter" ariaLabel="Filtros de búsqueda">
      <h2 className="text-lg font-semibold text-gray-900">
        Filtros de búsqueda
      </h2>
      <label className="mt-4 block text-sm font-medium text-gray-700">
        Proveedor
        <input
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="Nombre o código"
        />
      </label>
    </SidePanel>
  </div>
);
