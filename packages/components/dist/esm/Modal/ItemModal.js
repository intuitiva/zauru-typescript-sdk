import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { createRoot } from "react-dom/client";
const ItemSelectionModal = ({ itemList, onClose, config, }) => {
    const defaultConfig = {
        itemSize: {
            width: config?.itemSize?.width || "150px",
            height: config?.itemSize?.height || "200px",
        },
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const toggleCategory = (categoryName) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };
    const handleItemClick = (item) => {
        onClose(item);
    };
    const filteredList = itemList
        .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
        .filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.items.length > 0);
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 overflow-y-auto", children: [_jsxs("div", { className: "flex flex-col mb-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Seleccionar un \u00CDtem" }), _jsx("button", { className: "text-gray-500 hover:text-gray-800", onClick: () => onClose(null), children: "\u00D7" })] }), _jsx("input", { type: "text", placeholder: "Buscar por nombre o categor\u00EDa...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "p-2 border rounded-lg w-full" })] }), filteredList.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center", children: "No se encontraron resultados." })) : (filteredList.map((category) => (_jsxs("div", { className: "mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center hover:text-blue-600", onClick: () => toggleCategory(category.name), children: [_jsxs("span", { children: [category.name, " ", _jsxs("span", { className: "text-gray-500", children: ["(", category.items.length, ")"] })] }), _jsx("span", { className: `transform transition-transform duration-200 ${expandedCategories[category.name] ? "rotate-90" : ""}`, children: "\u25B6" })] }), expandedCategories[category.name] && (_jsx("div", { className: "grid gap-5", style: {
                                gridTemplateColumns: `repeat(auto-fit, minmax(${defaultConfig.itemSize.width}, 1fr))`,
                            }, children: category.items.map((item) => (_jsxs("div", { className: "border rounded-lg shadow-lg hover:shadow-xl cursor-pointer relative", onClick: () => handleItemClick(item), style: {
                                    backgroundImage: `url(${item.imageUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: defaultConfig.itemSize.width,
                                    height: defaultConfig.itemSize.height,
                                }, children: [_jsx("div", { className: "bg-white bg-opacity-80 p-2 rounded absolute top-0 left-0 right-0", children: _jsx("h4", { className: "font-bold text-sm text-center", children: item.name }) }), _jsx("div", { className: "absolute bottom-0 left-0 bg-white bg-opacity-80 p-2 rounded", children: _jsxs("span", { className: "text-xs", children: ["Stock: ", item.stock] }) }), _jsx("div", { className: "absolute bottom-0 right-0 bg-white bg-opacity-80 p-2 rounded", children: _jsxs("span", { className: "text-xs", children: [item.currencyPrefix, item.unitPrice] }) })] }, item.code))) }))] }, category.name))))] }) }));
};
// Función para crear el modal
export const createItemModal = (itemList, config) => {
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
        root.render(_jsx(ItemSelectionModal, { itemList: itemList, onClose: handleClose, config: config }));
    });
};
