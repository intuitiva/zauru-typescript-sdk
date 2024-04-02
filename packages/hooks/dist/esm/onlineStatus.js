"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsOnline = void 0;
const react_1 = require("react");
// Hook personalizado para verificar el estado de conexión
const useIsOnline = () => {
    // Verificar si estamos en el entorno del servidor o del cliente
    const isServer = typeof window === "undefined";
    // Estado local para almacenar si la aplicación está en línea o no
    const [isOnline, setIsOnline] = (0, react_1.useState)(!isServer && navigator.onLine);
    // Función para manejar el cambio de estado de conexión
    const handleConnectionChange = () => {
        setIsOnline(navigator.onLine);
    };
    (0, react_1.useEffect)(() => {
        if (isServer) {
            // Si estamos en el servidor, no añadir los event listeners
            return;
        }
        // Añadir event listeners
        window.addEventListener("online", handleConnectionChange);
        window.addEventListener("offline", handleConnectionChange);
        // Limpiar event listeners al desmontar el componente
        return () => {
            window.removeEventListener("online", handleConnectionChange);
            window.removeEventListener("offline", handleConnectionChange);
        };
    }, [isServer]);
    return isOnline;
};
exports.useIsOnline = useIsOnline;
