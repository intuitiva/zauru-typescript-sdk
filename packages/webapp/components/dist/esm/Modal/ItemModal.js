import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
const ExpandableText = ({ text, threshold = 30, }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };
    if (text.length <= threshold) {
        return _jsx("span", { children: text });
    }
    return (_jsx("span", { onClick: toggleExpanded, style: { cursor: "pointer" }, children: expanded ? (_jsxs("span", { className: "text-base font-semibold", children: [text, " ", _jsx("span", { className: "ml-1", children: "\u25B2" })] })) : (_jsxs("span", { className: "text-sm font-semibold", children: [text.substring(0, threshold), "...", " ", _jsx("span", { className: "ml-1", children: "\u25BC" })] })) }));
};
const ItemSelectionModal = ({ itemList, onClose, config, categoryViewMode = "text", }) => {
    const defaultConfig = {
        itemSize: {
            width: config?.itemSize?.width || "150px",
            height: config?.itemSize?.height || "200px",
        },
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [customPrice, setCustomPrice] = useState(null);
    // Ref para forzar el scroll al tope cuando seleccionamos un ítem
    const modalContentRef = useRef(null);
    const filteredList = itemList
        .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
        .filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.items.length > 0);
    const toggleCategory = (categoryName) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };
    const handleItemClick = (item) => {
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
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", onClick: handleCloseModal, children: _jsxs("div", { 
            //Le ponemos ref para poder scrollear al tope
            ref: modalContentRef, className: "bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: selectedItem ? "Confirmar selección" : "Seleccionar un Ítem" }), _jsx("button", { className: "text-gray-500 hover:text-gray-800 text-3xl", onClick: handleCloseModal, children: "\u00D7" })] }), !selectedItem ? (
                /* ==============================
                   PASO 1: SELECCIONAR ÍTEM
                   ============================== */
                _jsxs(_Fragment, { children: [_jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: "text", placeholder: "Buscar por nombre o categor\u00EDa...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "p-2 border rounded-lg w-full" }), searchTerm && (_jsx("button", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800", onClick: () => setSearchTerm(""), children: "\u00D7" }))] }), filteredList.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center", children: "No se encontraron resultados." })) : (filteredList.map((category, index) => {
                            const isExpanded = expandedCategories[category.name];
                            // Estilos condicionales para "text" vs. "card"
                            const categoryContainerClasses = categoryViewMode === "card"
                                ? "w-full mb-2 px-4 py-3 bg-blue-50 rounded-md flex justify-between items-center cursor-pointer hover:bg-blue-100"
                                : "text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center hover:text-blue-600";
                            return (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: categoryContainerClasses, onClick: () => toggleCategory(category.name), children: [_jsxs("span", { children: [category.name, " ", _jsxs("span", { className: "text-gray-500", children: ["(", category.items.length, ")"] })] }), _jsx("span", { className: `transform transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`, children: "\u25B6" })] }), isExpanded && (_jsx("div", { className: "grid gap-5", style: {
                                            gridTemplateColumns: `repeat(auto-fit, minmax(${defaultConfig.itemSize.width}, 1fr))`,
                                        }, children: category.items.map((item) => {
                                            // Verificamos si es un "paquete" usando item_id
                                            const isPackage = item.item_id.startsWith("b");
                                            return (_jsxs("div", { onClick: () => handleItemClick(item), className: `border rounded-lg shadow-lg hover:shadow-xl cursor-pointer relative ${isPackage ? "bg-yellow-50" : ""}`, style: {
                                                    backgroundImage: `url(${item.imageUrl})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    width: defaultConfig.itemSize.width,
                                                    height: defaultConfig.itemSize.height,
                                                }, children: [_jsx("div", { className: `p-2 rounded absolute top-0 left-0 right-0 ${isPackage
                                                            ? "bg-yellow-300 text-black"
                                                            : "bg-white bg-opacity-80"}`, children: _jsx(ExpandableText, { text: item.name, threshold: 30 }) }), _jsx("div", { className: `absolute bottom-0 left-0 p-2 rounded ${isPackage
                                                            ? "bg-yellow-300"
                                                            : "bg-white bg-opacity-80"}`, children: _jsxs("span", { className: "text-xs font-normal", children: ["Stock: ", item.stock] }) }), _jsx("div", { className: `absolute bottom-0 right-0 p-2 rounded ${isPackage
                                                            ? "bg-yellow-300"
                                                            : "bg-white bg-opacity-80"}`, children: _jsxs("span", { className: "text-xs font-normal", children: [item.currencyPrefix, item.priceText] }) })] }, item.item_id));
                                        }) }))] }, index));
                        }))] })) : (
                /* ==============================
                   PASO 2: CONFIRMAR SELECCIÓN
                   ============================== */
                _jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("img", { src: selectedItem.imageUrl, alt: selectedItem.name, className: "w-40 h-40 object-cover rounded mb-4 shadow-md" }), _jsx("p", { className: "mb-2 text-xl font-bold", children: selectedItem.name }), _jsxs("p", { className: "mb-2 text-base font-semibold text-gray-700", children: ["Stock disponible:", _jsx("span", { className: "ml-1 font-normal text-gray-800", children: selectedItem.stock })] }), !selectedItem.flexiblePrice && (_jsxs("p", { className: "mb-4 text-base font-semibold text-gray-700", children: ["Precio unitario:", _jsxs("span", { className: "ml-1 font-normal text-gray-800", children: [selectedItem.currencyPrefix, selectedItem.priceText] })] })), _jsxs("div", { className: "mb-4 w-full max-w-sm flex flex-col items-center", children: [_jsx("p", { className: "text-base font-semibold text-gray-700 mb-2", children: "Seleccionar cantidad" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { className: "bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400", onClick: () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)), children: "-" }), _jsx("input", { className: "w-20 text-center border rounded text-lg", type: "number", min: 1, value: quantity, onChange: (e) => {
                                                const val = parseInt(e.target.value, 10);
                                                setQuantity(isNaN(val) || val < 1 ? 1 : val);
                                            } }), _jsx("button", { className: "bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400", onClick: () => setQuantity((prev) => prev + 1), children: "+" })] })] }), selectedItem.flexiblePrice && (_jsxs("div", { className: "mb-4 w-full max-w-sm flex flex-col items-center", children: [_jsx("p", { className: "text-base font-semibold text-gray-700 mb-2", children: "Seleccionar precio" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { className: "bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400", onClick: () => setCustomPrice((prev) => {
                                                const newVal = (prev ?? 0) - 1;
                                                return newVal < 0 ? 0 : newVal;
                                            }), children: "-" }), _jsx("input", { className: "w-24 text-center border rounded text-lg", type: "number", min: 0, value: customPrice ?? 0, onChange: (e) => {
                                                const val = parseInt(e.target.value, 10);
                                                setCustomPrice(isNaN(val) || val < 0 ? 0 : val);
                                            } }), _jsx("button", { className: "bg-gray-300 rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold hover:bg-gray-400", onClick: () => setCustomPrice((prev) => (prev == null ? 1 : prev + 1)), children: "+" })] })] })), _jsxs("div", { className: "flex space-x-4 mt-6", children: [_jsx("button", { className: "bg-gray-300 px-4 py-2 rounded hover:bg-gray-400", onClick: handleCancelQuantity, children: "Volver" }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700", onClick: handleConfirmQuantity, children: "Confirmar" })] })] }))] }) }));
};
// Función para crear el modal
export const createItemModal = (itemList, config, categoryViewMode) => {
    return new Promise((resolve) => {
        const handleClose = (selectedItem) => {
            resolve(selectedItem);
            removeModal();
        };
        const removeModal = () => {
            document.body.removeChild(modalWrapper);
        };
        const modalWrapper = document.createElement("div");
        document.body.appendChild(modalWrapper);
        const root = createRoot(modalWrapper);
        root.render(_jsx(ItemSelectionModal, { itemList: itemList, onClose: handleClose, config: config, categoryViewMode: categoryViewMode }));
    });
};
