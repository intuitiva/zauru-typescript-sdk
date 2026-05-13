import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
export const Task = ({ task }) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
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
    return (_jsxs("div", { style: taskStyle, className: `${bgColor} rounded-lg p-3 mb-3 ${task.description ? "cursor-pointer" : ""}`, onClick: () => task.description && setIsDescriptionOpen(!isDescriptionOpen), children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { children: [statusIcon, " ", task.title, " ", `${task.status === "processing" ? "..." : ""}`] }), task.description && _jsx("div", { children: "\u25BC" })] }), task.description && isDescriptionOpen && (_jsx("div", { className: "mt-2", children: task.description }))] }));
};
export const TaskList = ({ tasks }) => {
    const completedTasks = tasks.filter((task) => task.status === "done" || task.status === "error").length;
    const progressPercentage = (completedTasks / tasks.length) * 100;
    return (_jsxs("div", { children: [tasks.map((task, index) => (_jsx(Task, { task: task }, index))), _jsx("div", { className: "h-2 bg-gray-200 rounded-lg mt-3", children: _jsx("div", { className: "bg-green-500 h-full rounded-lg", style: { width: `${progressPercentage}%`, transition: "width 0.5s" } }) })] }));
};
