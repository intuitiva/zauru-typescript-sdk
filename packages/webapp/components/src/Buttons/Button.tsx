import type { ColorInterface } from "../NavBar/NavBar.types.js";
import { useFormContext } from "react-hook-form";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

export type DropdownOption = {
  label: string;
  value: string;
  onClick?: () => void;
  children?: DropdownOption[];
};

const SUBMENU_OPEN_DELAY_MS = 150;
const SUBMENU_CLOSE_DELAY_MS = 200;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type DropdownMenuItemProps = {
  option: DropdownOption;
  onLeafClick: () => void;
};

const DropdownMenuItem = ({ option, onLeafClick }: DropdownMenuItemProps) => {
  const hasChildren = Boolean(option.children?.length);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimerRef.current != null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const openSubmenu = (immediate = false) => {
    if (!hasChildren) return;
    clearTimers();
    if (immediate || prefersReducedMotion()) {
      setIsSubmenuOpen(true);
      return;
    }
    openTimerRef.current = window.setTimeout(() => {
      setIsSubmenuOpen(true);
    }, SUBMENU_OPEN_DELAY_MS);
  };

  const closeSubmenu = (immediate = false) => {
    clearTimers();
    if (immediate || prefersReducedMotion()) {
      setIsSubmenuOpen(false);
      return;
    }
    closeTimerRef.current = window.setTimeout(() => {
      setIsSubmenuOpen(false);
    }, SUBMENU_CLOSE_DELAY_MS);
  };

  const handleClick = () => {
    if (hasChildren) {
      setIsSubmenuOpen((open) => !open);
      return;
    }
    option.onClick?.();
    onLeafClick();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!hasChildren) return;
    if (event.key === "ArrowRight" || event.key === "Enter") {
      event.preventDefault();
      openSubmenu(true);
    }
    if (event.key === "ArrowLeft" || event.key === "Escape") {
      event.preventDefault();
      closeSubmenu(true);
    }
  };

  const itemClassName =
    "flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-inset motion-reduce:transition-none";

  return (
    <div
      className="relative"
      onMouseEnter={() => openSubmenu()}
      onMouseLeave={() => closeSubmenu()}
    >
      <button
        type="button"
        role="menuitem"
        aria-haspopup={hasChildren ? "menu" : undefined}
        aria-expanded={hasChildren ? isSubmenuOpen : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={itemClassName}
      >
        <span>{option.label}</span>
        {hasChildren ? (
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : null}
      </button>
      {hasChildren && isSubmenuOpen ? (
        <div
          role="menu"
          className="absolute right-full top-0 z-20 mr-1 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {option.children?.map((child) => (
            <DropdownMenuItem
              key={child.value}
              option={child}
              onLeafClick={onLeafClick}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

type Props = {
  type?: "reset" | "button" | "submit" | undefined;
  title?: string;
  name?: string;
  onClickSave?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  //Cargando...
  loading?: boolean;
  loadingText?: string;
  selectedColor?: "indigo" | "green" | "red" | "yellow" | "gray";
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  enableFormErrorsValidation?: boolean;
  enableFormErrorsDescriptions?: boolean;
  // Nuevas props para dropdown
  dropdownOptions?: DropdownOption[];
  dropdownTitle?: string;
};

export const Button = (props: Props) => {
  const {
    type = "submit",
    loading = false,
    loadingText = "Guardando...",
    title = "Guardar",
    name = "save",
    onClickSave,
    selectedColor = "indigo",
    children,
    className = "",
    disabled = false,
    enableFormErrorsValidation = false,
    enableFormErrorsDescriptions = false,
    dropdownOptions = [],
    dropdownTitle,
  } = props;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formContext = useFormContext();
  const formHasErrors = formContext ? !formContext.formState.isValid : false;
  const formErrors = formContext ? formContext.formState.errors : {};

  const COLORS = {
    green: {
      bg900: "bg-green-900",
      bg700: "bg-green-700",
      bg600: "bg-green-600",
      bg500: "bg-green-500",
      bg200: "bg-green-200",
      ring600: "ring-green-600",
      ring500: "ring-green-500",
    },
    indigo: {
      bg900: "bg-indigo-900",
      bg700: "bg-indigo-700",
      bg600: "bg-indigo-600",
      bg500: "bg-indigo-500",
      bg200: "bg-indigo-200",
      ring600: "ring-indigo-600",
      ring500: "ring-indigo-500",
    },
    red: {
      bg900: "bg-red-900",
      bg700: "bg-red-700",
      bg600: "bg-red-600",
      bg500: "bg-red-500",
      bg200: "bg-red-200",
      ring600: "ring-red-600",
      ring500: "ring-red-500",
    },
    yellow: {
      bg900: "bg-yellow-900",
      bg700: "bg-yellow-700",
      bg600: "bg-yellow-600",
      bg500: "bg-yellow-500",
      bg200: "bg-yellow-200",
      ring600: "ring-yellow-600",
      ring500: "ring-yellow-500",
    },
    gray: {
      bg900: "bg-gray-900",
      bg700: "bg-gray-700",
      bg600: "bg-gray-600",
      bg500: "bg-gray-500",
      bg200: "bg-gray-200",
      ring600: "ring-gray-600",
      ring500: "ring-gray-500",
    },
  };

  const color: ColorInterface = COLORS[selectedColor];

  const errorMessage = formHasErrors
    ? Object.values(formErrors)
        .map((error) => error?.message?.toString())
        .join(", ")
    : "";

  // Manejar click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isButtonDisabled =
    loading || disabled || (enableFormErrorsValidation && formHasErrors);
  const hasDropdown = dropdownOptions.length > 0;

  // Si no hay opciones de dropdown, comportamiento normal
  if (!hasDropdown) {
    const buttonContent = (
      <button
        type={type}
        name={"action"}
        value={name}
        disabled={isButtonDisabled}
        onClick={onClickSave}
        className={`${isButtonDisabled ? " bg-opacity-25 " : ""} ${
          loading
            ? " cursor-progress"
            : `${isButtonDisabled ? " cursor-not-allowed" : `cursor-pointer hover:${color.bg700}`}`
        } inline-flex justify-center rounded-md border border-transparent ${
          color.bg600
        } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:${
          color.ring500
        } focus:ring-offset-2 ${className}`}
      >
        {loading ? children ?? loadingText : children ?? title}
      </button>
    );

    return (
      <>
        {(enableFormErrorsValidation && formHasErrors && errorMessage) ||
        (enableFormErrorsDescriptions && errorMessage) ? (
          <div className="flex flex-col items-end mb-2">
            <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm">
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        ) : null}
        {buttonContent}
      </>
    );
  }

  // Comportamiento con dropdown
  const dropdownContent = (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          disabled={isButtonDisabled}
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`${isButtonDisabled ? " bg-opacity-25 " : ""} ${
            loading
              ? " cursor-progress"
              : `${isButtonDisabled ? " cursor-not-allowed" : `cursor-pointer hover:${color.bg700}`}`
          } inline-flex justify-center items-center rounded-md border border-transparent ${
            color.bg600
          } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:${
            color.ring500
          } focus:ring-offset-2 ${className}`}
        >
          {loading
            ? children ?? loadingText
            : children ?? dropdownTitle ?? title}
          <svg
            className={`ml-2 -mr-1 h-4 w-4 transition-transform motion-reduce:transition-none ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isDropdownOpen && !isButtonDisabled ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            {dropdownOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                option={option}
                onLeafClick={() => setIsDropdownOpen(false)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {(enableFormErrorsValidation && formHasErrors && errorMessage) ||
      (enableFormErrorsDescriptions && errorMessage) ? (
        <div className="flex flex-col items-end mb-2">
          <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm">
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      ) : null}
      {dropdownContent}
    </>
  );
};
