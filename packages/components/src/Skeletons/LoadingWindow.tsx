import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingItem {
  name: string;
  loading: boolean;
}

interface LoadingWindowProps {
  loadingItems?: LoadingItem[];
  description?: string;
}

export const LoadingWindow: React.FC<LoadingWindowProps> = ({
  loadingItems = [],
  description = "Por favor, espere mientras se carga la página.",
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center"
      >
        <img src="/logo.png" alt="Zauru Logo" className="mb-8 h-20" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Cargando...</h1>
        <p className="text-gray-600 mb-4">{description}</p>
        {loadingItems && (
          <ul className="text-left mb-4">
            {loadingItems.map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                <svg
                  className={`${
                    item.loading ? "" : "hidden"
                  } w-5 h-5 text-blue-500 mr-2 animate-spin loading-spinner`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <svg
                  className={`${
                    item.loading ? "hidden" : ""
                  } w-5 h-5 text-green-500 mr-2 check-mark`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        )}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mt-8"
        >
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingWindow;
