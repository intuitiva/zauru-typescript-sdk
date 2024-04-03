"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const hooks_1 = require("@zauru-sdk/hooks");
const ConnectionState = () => {
    const isOnline = (0, hooks_1.useIsOnline)();
    // Definir estilos
    const styles = {
        container: {
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: isOnline ? "#d4edda" : "#f8d7da",
            color: isOnline ? "#155724" : "#721c24",
            fontWeight: "bold",
        },
        text: {
            fontSize: "16px",
            margin: 0,
        },
    };
    // Renderizar el estado de conexión
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.container, children: (0, jsx_runtime_1.jsx)("p", { style: styles.text, children: isOnline ? "ONLINE ✅🌐" : "OFFLINE ❌🌐" }) }));
};
exports.ConnectionState = ConnectionState;
