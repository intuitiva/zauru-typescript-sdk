"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormButtons = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const FormButtons = (props) => {
    const { saveTitle = "Guardar", saveName = "save", cancelTitle = "Cancelar", cancelName = "cancel", showCancel = true, showClear = false, clearName = "clear", clearTitle = "Limpiar", loading = false, onClickSave, loadingSaveText = "Guardando...", } = props;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showClear && ((0, jsx_runtime_1.jsx)("button", { type: "reset", name: "action", disabled: loading, value: clearName, className: `ml-5 ${loading ? " bg-opacity-25 cursor-progress" : ""} rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`, children: clearTitle })), showCancel && ((0, jsx_runtime_1.jsx)("button", { type: "button", name: "action", disabled: loading, value: cancelName, className: `${showClear ? "ml-2" : "ml-5"} ${loading ? " bg-opacity-25 cursor-progress" : ""} rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`, children: cancelTitle })), (0, jsx_runtime_1.jsx)("button", { type: "submit", name: "action", disabled: loading, value: saveName, onClick: onClickSave, className: `ml-2 ${loading ? " bg-opacity-25 cursor-progress" : "hover:bg-indigo-700"} inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`, children: loading ? loadingSaveText : saveTitle })] }));
};
exports.FormButtons = FormButtons;
