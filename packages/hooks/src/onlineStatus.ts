import { useState, useEffect } from "react";

// Hook personalizado para verificar el estado de conexión
export const useIsOnline = () => {
  // Verificar si estamos en el entorno del servidor o del cliente
  const isServer = typeof window === "undefined";

  // Estado local para almacenar si la aplicación está en línea o no
  const [isOnline, setIsOnline] = useState(!isServer && navigator.onLine);

  // Función para manejar el cambio de estado de conexión
  const handleConnectionChange = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
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
