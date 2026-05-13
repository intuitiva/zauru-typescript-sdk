import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";

// Tipos de datos
type Item = {
  item_id: string;
  name: string;
  code: string;
  unit_price: number;
  stock: number;
  currencyPrefix: string;
  imageUrl: string;
  quantity: number;
  flexiblePrice: boolean;
  priceText: string;
};

export type ItemModalCategory = { name: string; items: Item[] };

type OnCloseType = (selectedItem: Item | null) => void;

type ItemModalProps = {
  itemList: ItemModalCategory[];
  onClose: OnCloseType;
  config?: {
    itemSize?: {
      width: string;
      height: string;
    };
  };
  /**
   * Controla cómo se muestran las categorías.
   * - "text": Estilo por defecto (un simple título con flecha).
   * - "card": Tarjeta más grande y ancha, útil para pantallas táctiles (tablet).
   */
  categoryViewMode?: "text" | "card";
};

const ExpandableText: React.FC<{ text: string; threshold?: number }> = ({
  text,
  threshold = 30,
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  if (text.length <= threshold) {
    return <span>{text}</span>;
  }

  return (
    <span onClick={toggleExpanded} style={{ cursor: "pointer" }}>
      {expanded ? (
        <span className="text-base font-semibold">
          {text} <span className="ml-1">&#9650;</span>
        </span>
      ) : (
        <span className="text-sm font-semibold">
          {text.substring(0, threshold)}...{" "}
          <span className="ml-1">&#9660;</span>
        </span>
      )}
    </span>
  );
};

const ItemSelectionModal: React.FC<ItemModalProps> = ({
  itemList,
  onClose,
  config,
  categoryViewMode = "text",
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
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  // Ref para forzar el scroll al tope cuando seleccionamos un ítem
  const modalContentRef = useRef<HTMLDivElement>(null);

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

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setQuantity(1);
    // Si el ítem tiene precio flexible, inicializamos el customPrice con su precio actual
    setCustomPrice(item.flexiblePrice ? item.unit_price : null);

    // Forzar scroll a la parte superior del contenido, ya que antes se iniciaba el scroll desde donde se había quedado.
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirmQuantity = () => {
    if (selectedItem) {
      // (5) Devolver el precio correcto
      const finalPrice = selectedItem.flexiblePrice
        ? // si el precio es flexible, tomar lo que el usuario haya ingresado (o fallback al precio original)
          customPrice ?? selectedItem.unit_price
        : // si NO es flexible, solo usamos el precio que ya tenía
          selectedItem.unit_price;

      onClose({
        ...selectedItem,
        quantity,
        unit_price: finalPrice,
      });
    }
  };

  const handleCancelQuantity = () => {
    setSelectedItem(null);
    setQuantity(1);
    setCustomPrice(null);
  };

  const handleCloseModal = () => {
    onClose(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleCloseModal}
    >
      <div
        //Le ponemos ref para poder scrollear al tope
        ref={modalContentRef}
        className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {selectedItem ? "Confirmar selección" : "Seleccionar un Ítem"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-3xl"
            onClick={handleCloseModal}
          >
            &times;
          </button>
        </div>

        {/* 
          Render condicional: 
          - Si NO hay item seleccionado => mostramos la búsqueda + listado de ítems.
          - Si YA hay un item seleccionado => mostramos selector de cantidad y (si aplica) selector de precio.
        */}
        {!selectedItem ? (
          /* ==============================
             PASO 1: SELECCIONAR ÍTEM
             ============================== */
          <>
            {/* Barra de búsqueda */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded-lg w-full"
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  onClick={() => setSearchTerm("")}
                >
                  &times;
                </button>
              )}
            </div>

            {/* Lista de categorías e ítems */}
            {filteredList.length === 0 ? (
              <p className="text-gray-500 text-center">
                No se encontraron resultados.
              </p>
            ) : (
              filteredList.map((category, index) => {
                const isExpanded = expandedCategories[category.name];

                // Estilos condicionales para "text" vs. "card"
                const categoryContainerClasses =
                  categoryViewMode === "card"
                    ? "w-full mb-2 px-4 py-3 bg-blue-50 rounded-md flex justify-between items-center cursor-pointer hover:bg-blue-100"
                    : "text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center hover:text-blue-600";

                return (
                  <div key={index} className="mb-4">
                    {/* Cabecera de la categoría (texto o card) */}
                    <div
                      className={categoryContainerClasses}
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
                          isExpanded ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                    </div>

                    {/* Ítems dentro de la categoría */}
                    {isExpanded && (
                      <div
                        className="grid gap-5"
                        style={{
                          gridTemplateColumns: `repeat(auto-fit, minmax(${defaultConfig.itemSize.width}, 1fr))`,
                        }}
                      >
                        {category.items.map((item) => {
                          // Verificamos si es un "paquete" usando item_id
                          const isPackage = item.item_id.startsWith("b");

                          return (
                            <div
                              key={item.item_id}
                              onClick={() => handleItemClick(item)}
                              className={`border rounded-lg shadow-lg hover:shadow-xl cursor-pointer relative ${
                                isPackage ? "bg-yellow-50" : ""
                              }`}
                              style={{
                                backgroundImage: `url(${item.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                width: defaultConfig.itemSize.width,
                                height: defaultConfig.itemSize.height,
                              }}
                            >
                              {/* Franja superior (nombre) */}
                              <div
                                className={`p-2 rounded absolute top-0 left-0 right-0 ${
                                  isPackage
                                    ? "bg-yellow-300 text-black"
                                    : "bg-white bg-opacity-80"
                                }`}
                              >
                                <ExpandableText
                                  text={item.name}
                                  threshold={30}
                                />
                              </div>
                              <div
                                className={`absolute bottom-0 left-0 p-2 rounded ${
                                  isPackage
                                    ? "bg-yellow-300"
                                    : "bg-white bg-opacity-80"
                                }`}
                              >
                                <span className="text-xs font-normal">
                                  Stock: {item.stock}
                                </span>
                              </div>
                              <div
                                className={`absolute bottom-0 right-0 p-2 rounded ${
                                  isPackage
                                    ? "bg-yellow-300"
                                    : "bg-white bg-opacity-80"
                                }`}
                              >
                                <span className="text-xs font-normal">
                                  {item.currencyPrefix}
                                  {item.priceText}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        ) : (
          /* ==============================
             PASO 2: CONFIRMAR SELECCIÓN
             ============================== */
          <div className="flex flex-col items-center justify-center">
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              className="w-40 h-40 object-cover rounded mb-4 shadow-md"
            />
            <p className="mb-2 text-xl font-bold">{selectedItem.name}</p>
            <p className="mb-2 text-base font-semibold text-gray-700">
              Stock disponible:
              <span className="ml-1 font-normal text-gray-800">
                {selectedItem.stock}
              </span>
            </p>

            {/* Si el ítem NO es flexible, mostramos el precio fijo */}
            {!selectedItem.flexiblePrice && (
              <p className="mb-4 text-base font-semibold text-gray-700">
                Precio unitario:
                <span className="ml-1 font-normal text-gray-800">
                  {selectedItem.currencyPrefix}
                  {selectedItem.priceText}
                </span>
              </p>
            )}

            {/* 
              Selector de cantidad 
            */}
            <div className="mb-4 w-full max-w-sm flex flex-col items-center">
              <p className="text-base font-semibold text-gray-700 mb-2">
                Seleccionar cantidad
              </p>
              <div className="flex items-center space-x-4">
                <button
                  className="bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400"
                  onClick={() =>
                    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                >
                  -
                </button>
                <input
                  className="w-20 text-center border rounded text-lg"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setQuantity(isNaN(val) || val < 1 ? 1 : val);
                  }}
                />
                <button
                  className="bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* 
              Si el ítem SÍ es flexible, ponemos un selector de precio 
            */}
            {selectedItem.flexiblePrice && (
              <div className="mb-4 w-full max-w-sm flex flex-col items-center">
                <p className="text-base font-semibold text-gray-700 mb-2">
                  Seleccionar precio
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    className="bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400"
                    onClick={() =>
                      setCustomPrice((prev) => {
                        const newVal = (prev ?? 0) - 1;
                        return newVal < 0 ? 0 : newVal;
                      })
                    }
                  >
                    -
                  </button>
                  <input
                    className="w-24 text-center border rounded text-lg"
                    type="number"
                    min={0}
                    value={customPrice ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setCustomPrice(isNaN(val) || val < 0 ? 0 : val);
                    }}
                  />
                  <button
                    className="bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400"
                    onClick={() =>
                      setCustomPrice((prev) => (prev == null ? 1 : prev + 1))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Botones de Confirmar y Volver */}
            <div className="flex space-x-4 mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCancelQuantity}
              >
                Volver
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleConfirmQuantity}
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Función para crear el modal
export const createItemModal = (
  itemList: ItemModalCategory[],
  config?: ItemModalProps["config"],
  categoryViewMode?: ItemModalProps["categoryViewMode"]
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
        categoryViewMode={categoryViewMode}
      />
    );
  });
};
