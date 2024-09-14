"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("react-dom/client");
const createModal = ({ title, description, okButtonText, showOptions = true, }) => {
    return new Promise((resolve) => {
        const handleClose = () => {
            resolve(null);
            removeModal();
        };
        const handleOk = () => {
            resolve("OK");
            removeModal();
        };
        const handleCancel = () => {
            resolve("CANCEL");
            removeModal();
        };
        const removeModal = () => {
            document.body.removeChild(modalWrapper);
            document.body.removeChild(modalOverlay);
        };
        const modalWrapper = document.createElement("div");
        modalWrapper.classList.add("justify-center", "items-center", "flex", "overflow-x-hidden", "overflow-y-auto", "fixed", "inset-0", "z-50", "outline-none", "focus:outline-none");
        // Crear capa de fondo detrás del modal
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add("fixed", "inset-0", "bg-black", "opacity-50", "z-40");
        document.body.appendChild(modalOverlay);
        document.body.appendChild(modalWrapper);
        const ModalContent = () => ((0, jsx_runtime_1.jsx)("div", { className: "relative w-auto my-6 mx-auto max-w-3xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-3xl font-semibold", children: title }), (0, jsx_runtime_1.jsx)("button", { className: "p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none", children: (0, jsx_runtime_1.jsx)("span", { className: "close-button", onClick: handleClose, children: "\u00D7" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative p-6 flex-auto", children: description }), showOptions && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b", children: [(0, jsx_runtime_1.jsx)("button", { className: "cancel-button text-red-700 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150", type: "button", onClick: handleCancel, children: "Cancelar" }), (0, jsx_runtime_1.jsx)("button", { className: "ok-button bg-emerald-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150", type: "button", onClick: handleOk, children: okButtonText ?? "Aceptar" })] }))] }) }));
        const root = (0, client_1.createRoot)(modalWrapper);
        root.render((0, jsx_runtime_1.jsx)(ModalContent, {}));
    });
};
exports.createModal = createModal;
