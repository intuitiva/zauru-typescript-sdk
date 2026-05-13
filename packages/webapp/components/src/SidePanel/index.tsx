import React, { useState, ReactNode, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SidePanel Component
 *
 * This component creates a collapsible side panel that can be toggled open and closed.
 *
 * @param {ReactNode} children - The content to be displayed inside the side panel.
 * @param {boolean} [closeOnClickOutside=true] - If true, the panel will close when clicking outside of it.
 * @param {number} [widthPercentage=25] - The width of the panel as a percentage of the viewport width.
 * @param {string} [buttonIcon="chevron"] - The icon to use for the toggle button. Can be "chevron", "filter", or a custom ReactNode.
 *
 * @returns A toggleable side panel component.
 */

interface SidePanelProps {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  widthPercentage?: number;
  buttonIcon?: "chevron" | "filter" | ReactNode;
}

// SVG icon for the left-pointing chevron
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

// SVG icon for the right-pointing chevron
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
      clipRule="evenodd"
    />
  </svg>
);

// SVG icon for the filter (bars filter icon)
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M3 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const SidePanel: React.FC<SidePanelProps> = ({
  children,
  closeOnClickOutside = true,
  widthPercentage = 25,
  buttonIcon = "chevron",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnClickOutside]);

  const renderIcon = () => {
    if (typeof buttonIcon === "string") {
      switch (buttonIcon) {
        case "chevron":
          return isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />;
        case "filter":
          return <FilterIcon />;
        default:
          return <ChevronLeftIcon />;
      }
    } else {
      return buttonIcon;
    }
  };

  return (
    <>
      <motion.div
        ref={panelRef}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-[9999] overflow-y-auto`}
        style={{ width: `${widthPercentage}%` }}
      >
        <button
          onClick={togglePanel}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <ChevronRightIcon />
        </button>
        <div className="p-6 mt-16">{children}</div>
      </motion.div>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            onClick={togglePanel}
            className={`fixed top-1/2 right-0 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-l-lg shadow-md hover:bg-indigo-700 transition-colors z-[10000]`}
          >
            {renderIcon()}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
