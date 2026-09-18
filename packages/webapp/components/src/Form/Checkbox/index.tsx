import { QuestionMarkIconSVG } from "@zauru-sdk/icons";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  id?: string;
  name?: string;
  label?: string;
  defaultValue?: boolean;
  onChange?: (
    value: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => { stopUIChange: boolean } | void;
  disabled?: boolean;
  borderColor?: string;
  required?: boolean;
  helpText?: string;
  helpAriaLabel?: string;
};

export const CheckBox = (props: Props) => {
  const {
    id,
    name,
    defaultValue = false,
    onChange,
    disabled = false,
    label,
    required = false,
    helpText,
    helpAriaLabel = "Más información",
  } = props;

  const [checked, setChecked] = useState(defaultValue);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (register) {
      register.onChange(event);
    }
    if (onChange) {
      const result = onChange(isChecked, event);
      if (result?.stopUIChange) {
        return;
      }
    }
    setChecked(isChecked);
  };

  const {
    register: tempRegister,
    formState: { errors },
  } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
  const error = errors ? errors[props.name ?? "-1"] : undefined;
  const register = tempRegister
    ? tempRegister(props.name ?? "-1", { required })
    : undefined; // Solo usar register si está disponible

  const color = error ? "red" : "gray";
  const borderColor = disabled ? "border-gray-300" : `border-${color}-500`;

  const inputComponent = (
    <input
      type="checkbox"
      id={id ?? name}
      checked={checked}
      className={`form-checkbox h-4 w-4 text-indigo-600 ${borderColor} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } focus:border-indigo-500 focus:ring-indigo-500`}
      disabled={disabled}
      {...(register ?? {})}
      name={name}
      onChange={handleInputChange}
    />
  );

  const helpButton = helpText ? (
    <div className="relative ml-2 shrink-0">
      <button
        type="button"
        className="cursor-pointer inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 rounded-full"
        aria-label={helpAriaLabel}
        aria-expanded={showHelp}
        onMouseEnter={() => setShowHelp(true)}
        onMouseLeave={() => setShowHelp(false)}
        onFocus={() => setShowHelp(true)}
        onBlur={() => setShowHelp(false)}
      >
        <QuestionMarkIconSVG />
      </button>
      {showHelp ? (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 max-w-[min(18rem,calc(100vw-2rem))] rounded border border-gray-200 bg-white p-2 text-left text-sm text-black shadow motion-reduce:transition-none">
          {helpText}
        </div>
      ) : null}
    </div>
  ) : null;

  if (!error && !label && !helpText) {
    return inputComponent;
  }

  return (
    <div className="col-span-6 sm:col-span-3">
      <div className={`flex items-center ${borderColor}`}>
        {inputComponent}
        {label && (
          <label
            htmlFor={id ?? name}
            className={`ml-2 block text-sm font-medium text-${color}-700 dark:text-${color}-500`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {helpButton}
      </div>
      {error && (
        <p className={`mt-2 text-sm text-${color}-600 dark:text-${color}-500`}>
          <span className="font-medium">Oops!</span> {error.message?.toString()}
        </p>
      )}
    </div>
  );
};
