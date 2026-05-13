import { useIsOnline } from "@zauru-sdk/webapp-hooks";

export const ConnectionState = () => {
  const isOnline = useIsOnline();

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
  return (
    <div style={styles.container}>
      <p style={styles.text}>{isOnline ? "ONLINE ✅🌐" : "OFFLINE ❌🌐"}</p>
    </div>
  );
};
