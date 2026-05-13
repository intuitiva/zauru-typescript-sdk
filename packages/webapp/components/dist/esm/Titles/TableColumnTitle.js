import { jsx as _jsx } from "react/jsx-runtime";
//column title for datatables
export const TableColumnTitle = ({ textContent }) => {
    return (_jsx("p", { className: "font-bold text-sm line-clamp-3 text-center", children: textContent }));
};
