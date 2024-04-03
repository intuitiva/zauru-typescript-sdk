"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskList = exports.Task = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Task = ({ task }) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = (0, react_1.useState)(false);
    let statusIcon;
    let taskStyle = {};
    let bgColor;
    switch (task.status) {
        case "waiting":
            statusIcon = "🕗"; // Icono de reloj (como un ejemplo, puedes reemplazarlo con un ícono o SVG real)
            taskStyle = { opacity: 0.5 }; // estilo disabled
            bgColor = "bg-gray-200"; // Color de fondo gris
            break;
        case "processing":
            statusIcon = "⏳"; // Icono de reloj de arena
            taskStyle = { fontWeight: "bold" }; // estilo negrita
            bgColor = "bg-blue-200"; // Color de fondo azul
            break;
        case "done":
            statusIcon = "✅"; // Icono de check
            bgColor = "bg-green-200"; // Color de fondo verde
            break;
        case "error":
            statusIcon = "❌"; // Icono de cruz
            taskStyle = { color: "red" }; // estilo color rojo
            bgColor = "bg-red-200"; // Color de fondo rojo
            break;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { style: taskStyle, className: `${bgColor} rounded-lg p-3 mb-3 ${task.description ? "cursor-pointer" : ""}`, onClick: () => task.description && setIsDescriptionOpen(!isDescriptionOpen), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [statusIcon, " ", task.title, " ", `${task.status === "processing" ? "..." : ""}`] }), task.description && (0, jsx_runtime_1.jsx)("div", { children: "\u25BC" })] }), task.description && isDescriptionOpen && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: task.description }))] }));
};
exports.Task = Task;
const TaskList = ({ tasks }) => {
    const completedTasks = tasks.filter((task) => task.status === "done" || task.status === "error").length;
    const progressPercentage = (completedTasks / tasks.length) * 100;
    return ((0, jsx_runtime_1.jsxs)("div", { children: [tasks.map((task, index) => ((0, jsx_runtime_1.jsx)(exports.Task, { task: task }, index))), (0, jsx_runtime_1.jsx)("div", { className: "h-2 bg-gray-200 rounded-lg mt-3", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-green-500 h-full rounded-lg", style: { width: `${progressPercentage}%`, transition: "width 0.5s" } }) })] }));
};
exports.TaskList = TaskList;
