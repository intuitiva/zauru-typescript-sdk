import type { ColorInterface } from "../NavBar/NavBar.types.js";
import { useFormContext } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

type DropdownOption = {
  label: string;
  value: string;
  onClick: () => void;
};

type Props = {
  type?: "reset" | "button" | "submit" | undefined;
  title?: string;
  name?: string;
  onClickSave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  //Cargando...
  loading?: boolean;
  loadingText?: string;
  selectedColor?: "indigo" | "green" | "red" | "yellow" | "gray";
  children?: React.ReactNode;
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
            : `${isButtonDisabled ? "" : `hover:${color.bg700}`}`
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
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`${isButtonDisabled ? " bg-opacity-25 " : ""} ${
            loading
              ? " cursor-progress"
              : `${isButtonDisabled ? "" : `hover:${color.bg700}`}`
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
            className={`ml-2 -mr-1 h-4 w-4 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {dropdownOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  option.onClick();
                  setIsDropdownOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
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
