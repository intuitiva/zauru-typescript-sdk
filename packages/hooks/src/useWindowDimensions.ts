import { useState, useEffect } from "react";

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width } = window;
    return width;
  }

  // Devolver un valor predeterminado si window no está definido
  return 1000;
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      // Use window load event to ensure accurate window size on initial load
      window.addEventListener("load", handleResize);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("load", handleResize);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return windowDimensions;
}
