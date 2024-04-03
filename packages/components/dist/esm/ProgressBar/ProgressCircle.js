import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export const ProgressCircle = ({ total, completed, description, title, }) => {
    const [percentage, setPercentage] = useState(0);
    const strokeDasharray = 2 * Math.PI * 42; // radio del circulo
    const progressColor = `rgba(${255 - 2.55 * percentage}, ${2.55 * percentage}, 0)`;
    useEffect(() => {
        if (total > 0) {
            setPercentage((completed / total) * 100);
        }
        else {
            setPercentage(100);
        }
    }, [total, completed]);
    return (_jsxs("div", { className: "flex flex-col items-center justify-center", children: [title && (_jsx("h2", { className: "mb-4 text-xl text-center text-gray-700", children: title })), _jsxs("svg", { width: "100", height: "100", className: "relative", children: [_jsx("circle", { r: "42", cx: "50", cy: "50", fill: "transparent", stroke: "#eee", strokeWidth: "8" }), _jsx("circle", { r: "42", cx: "50", cy: "50", fill: "transparent", stroke: progressColor, strokeWidth: "8", strokeDasharray: strokeDasharray, strokeDashoffset: strokeDasharray - strokeDasharray * (percentage / 100), strokeLinecap: "round", style: {
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                        } }), _jsx("text", { x: "50", y: "55", textAnchor: "middle", fill: progressColor, style: {
                            fontSize: "16px",
                            fontWeight: "bold",
                        }, children: `${Math.round(percentage)}%` })] }), _jsx("p", { className: "mt-2 text-center text-gray-500", children: description })] }));
};
