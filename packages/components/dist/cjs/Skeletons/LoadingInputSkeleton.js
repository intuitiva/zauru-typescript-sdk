"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingInputSkeleton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const LoadingInputSkeleton = () => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full bg-gray-300 animate-pulse rounded", style: {
            maxWidth: "100%",
            height: "40px",
            boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.1)",
        } }));
};
exports.LoadingInputSkeleton = LoadingInputSkeleton;
