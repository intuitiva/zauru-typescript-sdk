import React, {
  useState,
  ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

export interface SidePanelProps {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  widthPercentage?: number;
  buttonIcon?: "chevron" | "filter" | ReactNode;
  ariaLabel?: string;
  openButtonLabel?: string;
  closeButtonLabel?: string;
}

// SVG icon for the left-pointing chevron
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
  ariaLabel = "Panel lateral",
  openButtonLabel = "Abrir panel",
  closeButtonLabel = "Cerrar panel",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();

  const togglePanel = () => {
    setIsOpen((open) => !open);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
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
  }, [closeOnClickOutside, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
      const previousOverflow = document.body.style.overflow;
      if (window.matchMedia("(max-width: 767px)").matches) {
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerButtonRef.current?.focus();
    }
  }, [isOpen]);

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
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }
        className="fixed right-0 top-0 z-[9999] h-full w-[calc(100%-1rem)] overflow-y-auto bg-white shadow-lg sm:w-[min(28rem,calc(100%-2rem))] md:w-[var(--side-panel-width)]"
        style={
          {
            "--side-panel-width": `${widthPercentage}%`,
          } as React.CSSProperties
        }
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={togglePanel}
          aria-label={closeButtonLabel}
          className="absolute left-4 top-4 min-h-11 min-w-11 cursor-pointer rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 md:min-h-0 md:min-w-0"
        >
          <ChevronRightIcon />
        </button>
        <div className="mt-16 p-4 sm:p-6">{children}</div>
      </motion.div>
      <AnimatePresence>
        {isOpen && closeOnClickOutside ? (
          <motion.button
            type="button"
            aria-label={closeButtonLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[9998] cursor-default bg-black/30 md:hidden"
          />
        ) : null}
        {!isOpen && (
          <motion.button
            ref={triggerButtonRef}
            type="button"
            aria-label={openButtonLabel}
            aria-expanded={isOpen}
            aria-controls={panelId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={togglePanel}
            className="fixed right-0 top-1/2 z-[10000] min-h-11 min-w-11 -translate-y-1/2 cursor-pointer rounded-l-lg bg-indigo-600 p-3 text-white shadow-md transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {renderIcon()}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
