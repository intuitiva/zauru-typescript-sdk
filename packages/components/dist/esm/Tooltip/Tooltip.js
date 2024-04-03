"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export const Tooltip = ({ children, text }) => {
    const [show, setShow] = useState(false);
    return (_jsxs("div", { className: "relative inline-block", children: [_jsx("div", { onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false), children: children }), show && (_jsxs("div", { className: "absolute z-10 bg-gray-700 text-white px-2 py-1 rounded-md bottom-full left-1/2 transform -translate-x-1/2", style: { whiteSpace: "nowrap", height: "2rem" }, children: [text, _jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2", style: {
                            width: "0",
                            height: "0",
                            borderTop: "6px solid transparent",
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderBottom: "6px solid gray",
                        } })] }))] }));
};
