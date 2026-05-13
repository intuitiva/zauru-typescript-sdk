import { useState, useEffect } from "react";

// Hook personalizado para verificar el estado de conexión
export const useIsOnline = () => {
  try {
    // Estado local para almacenar si la aplicación está en línea o no
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Función para manejar el cambio de estado de conexión
    const handleConnectionChange = () => {
      setIsOnline(navigator.onLine);
    };

    useEffect(() => {
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
  } catch (ex) {
    return false;
  }
};
