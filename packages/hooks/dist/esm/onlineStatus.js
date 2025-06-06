"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsOnline = void 0;
const react_1 = require("react");
// Hook personalizado para verificar el estado de conexión
const useIsOnline = () => {
    try {
        // Estado local para almacenar si la aplicación está en línea o no
        const [isOnline, setIsOnline] = (0, react_1.useState)(navigator.onLine);
        // Función para manejar el cambio de estado de conexión
        const handleConnectionChange = () => {
            setIsOnline(navigator.onLine);
        };
        (0, react_1.useEffect)(() => {
            // Añadir event listeners
            window.addEventListener("online", handleConnectionChange);
            window.addEventListener("offline", handleConnectionChange);
            // Limpiar event listeners al desmontar el componente
            return () => {
                window.removeEventListener("online", handleConnectionChange);
                window.removeEventListener("offline", handleConnectionChange);
            };
        }, []);
        return isOnline;
    }
    catch (ex) {
        return false;
    }
};
exports.useIsOnline = useIsOnline;
