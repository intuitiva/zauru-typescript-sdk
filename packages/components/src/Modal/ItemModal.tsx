import React, { useState } from "react";
import { createRoot } from "react-dom/client";

// Tipos de datos
type Item = {
  name: string;
  code: string;
  unitPrice: number;
  stock: number;
  currencyPrefix: string;
  imageUrl: string;
};

type ItemCategory = { name: string; items: Item[] };

type ItemModalProps = {
  itemList: ItemCategory[];
  onClose: (selectedItem: Item | null) => void;
  config?: { itemSize: { width: string; height: string } }; // Tamaño configurable
};

const ItemSelectionModal: React.FC<ItemModalProps> = ({
  itemList,
  onClose,
  config,
}) => {
  const defaultConfig = {
    itemSize: {
      width: config?.itemSize?.width || "150px",
      height: config?.itemSize?.height || "200px",
    },
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleItemClick = (item: Item) => {
    onClose(item);
  };

  const filteredList = itemList
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.items.length > 0
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Seleccionar un Ítem</h2>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => onClose(null)}
            >
              &times;
            </button>
          </div>
          {/* Barra de búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        {/* Lista de categorías e ítems */}
        {filteredList.length === 0 ? (
          <p className="text-gray-500 text-center">
            No se encontraron resultados.
          </p>
        ) : (
          filteredList.map((category) => (
            <div key={category.name} className="mb-4">
              <h3
                className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center hover:text-blue-600"
                onClick={() => toggleCategory(category.name)}
              >
                <span>
                  {category.name}{" "}
                  <span className="text-gray-500">
                    ({category.items.length})
                  </span>
                </span>
                <span
                  className={`transform transition-transform duration-200 ${
                    expandedCategories[category.name] ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </h3>
              {expandedCategories[category.name] && (
                <div
                  className="grid gap-5"
                  style={{
                    gridTemplateColumns: `repeat(auto-fit, minmax(${defaultConfig.itemSize.width}, 1fr))`,
                  }}
                >
                  {category.items.map((item) => (
                    <div
                      key={item.code}
                      className="border rounded-lg shadow-lg hover:shadow-xl cursor-pointer relative"
                      onClick={() => handleItemClick(item)}
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: defaultConfig.itemSize.width,
                        height: defaultConfig.itemSize.height,
                      }}
                    >
                      <div className="bg-white bg-opacity-80 p-2 rounded absolute top-0 left-0 right-0">
                        <h4 className="font-bold text-sm text-center">
                          {item.name}
                        </h4>
                      </div>
                      <div className="absolute bottom-0 left-0 bg-white bg-opacity-80 p-2 rounded">
                        <span className="text-xs">Stock: {item.stock}</span>
                      </div>
                      <div className="absolute bottom-0 right-0 bg-white bg-opacity-80 p-2 rounded">
                        <span className="text-xs">
                          {item.currencyPrefix}
                          {item.unitPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Función para crear el modal
export const createItemModal = (
  itemList: ItemCategory[],
  config?: ItemModalProps["config"]
): Promise<Item | null> => {
  return new Promise((resolve) => {
    const handleClose = (selectedItem: Item | null) => {
      resolve(selectedItem);
      removeModal();
    };

    const removeModal = () => {
      document.body.removeChild(modalWrapper);
    };

    const modalWrapper = document.createElement("div");
    document.body.appendChild(modalWrapper);

    const root = createRoot(modalWrapper);
    root.render(
      <ItemSelectionModal
        itemList={itemList}
        onClose={handleClose}
        config={config}
      />
    );
  });
};
