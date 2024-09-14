import type { ColorInterface } from "../NavBar/NavBar.types.js";
import { useFormContext } from "react-hook-form";
import { WithTooltip } from "../index.js";

type Props = {
  type?: "reset" | "button" | "submit" | undefined;
  title?: string;
  name?: string;
  onClickSave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  //Cargando...
  loading?: boolean;
  loadingText?: string;
  selectedColor?: "indigo" | "green" | "red" | "yellow";
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
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
  } = props;

  const formContext = useFormContext();
  const formHasErrors = formContext ? !formContext.formState.isValid : false;
  const formErrors = formContext ? formContext.formState.errors : {};

  const COLORS = {
    green: {
      bg900: "bg-green-900",
      bg700: "bg-green-700",
      bg600: "bg-green-600",
      bg500: "bg-green-500",
      ring600: "ring-green-600",
      ring500: "ring-green-500",
    },
    indigo: {
      bg900: "bg-indigo-900",
      bg700: "bg-indigo-700",
      bg600: "bg-indigo-600",
      bg500: "bg-indigo-500",
      ring600: "ring-indigo-600",
      ring500: "ring-indigo-500",
    },
    red: {
      bg900: "bg-red-900",
      bg700: "bg-red-700",
      bg600: "bg-red-600",
      bg500: "bg-red-500",
      ring600: "ring-red-600",
      ring500: "ring-red-500",
    },
    yellow: {
      bg900: "bg-yellow-900",
      bg700: "bg-yellow-700",
      bg600: "bg-yellow-600",
      bg500: "bg-yellow-500",
      ring600: "ring-yellow-600",
      ring500: "ring-yellow-500",
    },
  };

  const color: ColorInterface = COLORS[selectedColor];

  const inside = children ?? title;

  const errorMessage = formHasErrors
    ? Object.values(formErrors)
        .map((error) => error?.message?.toString())
        .join(", ")
    : "";

  const buttonContent = (
    <button
      type={type}
      name="action"
      disabled={loading || disabled || formHasErrors}
      value={name}
      onClick={onClickSave}
      className={`ml-2 ${
        loading || disabled || formHasErrors ? " bg-opacity-25 " : ""
      } ${
        loading
          ? " cursor-progress"
          : `${disabled || formHasErrors ? "" : `hover:${color.bg700}`}`
      } inline-flex justify-center rounded-md border border-transparent ${
        color.bg600
      } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:${
        color.ring500
      } focus:ring-offset-2 ${className}`}
    >
      {loading ? loadingText : inside}
    </button>
  );

  return formHasErrors ? (
    <WithTooltip text={errorMessage}>{buttonContent}</WithTooltip>
  ) : (
    buttonContent
  );
};
