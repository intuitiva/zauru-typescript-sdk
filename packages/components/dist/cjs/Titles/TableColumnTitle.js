"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableColumnTitle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
//column title for datatables
const TableColumnTitle = ({ textContent }) => {
    return ((0, jsx_runtime_1.jsx)("p", { className: "font-bold text-sm line-clamp-3 text-center", children: textContent }));
};
exports.TableColumnTitle = TableColumnTitle;
