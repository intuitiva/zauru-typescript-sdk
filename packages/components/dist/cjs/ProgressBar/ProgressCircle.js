"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressCircle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ProgressCircle = ({ total, completed, description, title, }) => {
    const [percentage, setPercentage] = (0, react_1.useState)(0);
    const strokeDasharray = 2 * Math.PI * 42; // radio del circulo
    const progressColor = `rgba(${255 - 2.55 * percentage}, ${2.55 * percentage}, 0)`;
    (0, react_1.useEffect)(() => {
        if (total > 0) {
            setPercentage((completed / total) * 100);
        }
        else {
            setPercentage(100);
        }
    }, [total, completed]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center", children: [title && ((0, jsx_runtime_1.jsx)("h2", { className: "mb-4 text-xl text-center text-gray-700", children: title })), (0, jsx_runtime_1.jsxs)("svg", { width: "100", height: "100", className: "relative", children: [(0, jsx_runtime_1.jsx)("circle", { r: "42", cx: "50", cy: "50", fill: "transparent", stroke: "#eee", strokeWidth: "8" }), (0, jsx_runtime_1.jsx)("circle", { r: "42", cx: "50", cy: "50", fill: "transparent", stroke: progressColor, strokeWidth: "8", strokeDasharray: strokeDasharray, strokeDashoffset: strokeDasharray - strokeDasharray * (percentage / 100), strokeLinecap: "round", style: {
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                        } }), (0, jsx_runtime_1.jsx)("text", { x: "50", y: "55", textAnchor: "middle", fill: progressColor, style: {
                            fontSize: "16px",
                            fontWeight: "bold",
                        }, children: `${Math.round(percentage)}%` })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-center text-gray-500", children: description })] }));
};
exports.ProgressCircle = ProgressCircle;
