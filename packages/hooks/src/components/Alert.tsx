import React, { useState, useRef, useEffect } from "react";
import { ExitSvg } from "@zauru-sdk/icons";
import { createRoot } from "react-dom/client";

export type AlertType = "success" | "error" | "info" | "warning";

export type AlertProps = {
  type: AlertType;
  title: string;
  description: string;
  onClose?: () => void;
};

const Alert: React.FC<AlertProps> = ({ type, title, description, onClose }) => {
  const [, setLifetime] = useState(4000);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);

  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const startTimer = () => {
      intervalRef.current = setInterval(() => {
        setLifetime((lifetime) => {
          if (lifetime <= 0) {
            onClose && onClose();
            clearInterval(intervalRef.current);
            return 0;
          } else {
            setProgress((4000 - lifetime) / 4000);
            return lifetime - 50;
          }
        });
      }, 50);
    };

    const pauseTimer = () => {
      clearInterval(intervalRef.current);
    };

    startTimer();
    return () => {
      pauseTimer();
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-0 right-0 w-80 mt-10 mr-10 rounded-md shadow-lg ${getColor()} p-4 transition-transform duration-300`}
      style={{
        zIndex: 1000,
        transform: `translateY(calc(var(--alert-offset, 0)))`,
      }}
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => {
        intervalRef.current = setInterval(() => {
          setLifetime((lifetime) => {
            if (lifetime <= 0) {
              onClose && onClose();
              clearInterval(intervalRef.current);
              return 0;
            } else {
              setProgress((4000 - lifetime) / 4000);
              return lifetime - 50;
            }
          });
        }, 50);
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button
          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
          onClick={() => {
            setLifetime(0);
            onClose && onClose();
          }}
        >
          <ExitSvg />
        </button>
      </div>
      <div className="mt-2">
        <p className="text-sm overflow-wrap break-words">{description}</p>
      </div>
      <div className="relative h-1 mt-4 bg-gray-200 rounded">
        <div
          className={`absolute left-0 top-0 h-full ${getColor()} rounded`}
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

let activeAlerts: HTMLElement[] = [];

export const showAlert = (alertProps: AlertProps) => {
  if (typeof document === "undefined") {
    return;
  }
  const container = document.createElement("div");
  document.body.appendChild(container);

  const onClose = () => {
    root.unmount();
    container.remove();
    activeAlerts = activeAlerts.filter((alert) => alert !== container);
    updateAlertOffsets();
  };

  const asyncOnClose = () => {
    setTimeout(() => {
      onClose();
    }, 0);
  };

  activeAlerts.push(container);
  updateAlertOffsets();

  const root = createRoot(container);
  root.render(<Alert {...alertProps} onClose={asyncOnClose} />);
};

const updateAlertOffsets = () => {
  activeAlerts.forEach((alertContainer, index) => {
    alertContainer.style.setProperty("--alert-offset", `${index * 100}px`);
  });
};
