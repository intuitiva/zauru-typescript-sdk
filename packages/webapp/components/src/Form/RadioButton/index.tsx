import { SelectFieldOption } from "@zauru-sdk/types";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  id?: string;
  name: string;
  title?: string;
  options: SelectFieldOption[];
  defaultValue?: string | number;
  disabled?: boolean;
  required?: boolean;
  onChange?: (
    value: string | number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  helpText?: string;
  hint?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export const RadioButton = (props: Props) => {
  const {
    id,
    name,
    title,
    options,
    defaultValue,
    disabled = false,
    required = false,
    onChange,
    helpText,
    hint,
    className = "",
    orientation = "vertical",
  } = props;

  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const {
    register: tempRegister,
    formState: { errors },
    setValue: setOnFormValue,
  } = useFormContext() || { formState: {} };

  const error = errors ? errors[name] : undefined;
  const color = error ? "red" : "gray";

  const register = tempRegister ? tempRegister(name, { required }) : undefined; // Solo usar register si está disponible

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    if (register) {
      register.onChange(event);
    }

    if (setOnFormValue) {
      setOnFormValue(name, newValue);
    }

    onChange && onChange(newValue, event);
  };

  const containerClass =
    orientation === "horizontal"
      ? "flex items-center gap-4 flex-wrap" // Estilo para disposición horizontal
      : ""; // Vertical no necesita clase especial

  return (
    <div className={`col-span-6 sm:col-span-3 ${className}`}>
      {title && (
        <label
          htmlFor={id ?? name}
          className={`block mb-1 text-sm font-medium text-${color}-700 dark:text-${color}-500`}
        >
          {title}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={containerClass}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`flex items-center mb-2 ${
              disabled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <input
              type="radio"
              id={`${name}-${option.value}`}
              value={option.value}
              disabled={disabled}
              checked={selectedValue === option.value}
              className={`h-4 w-4 text-indigo-600 border-${color}-300 focus:ring-indigo-500`}
              {...(register ?? {})}
              onChange={handleChange}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`ml-2 block text-sm font-medium text-${color}-900 dark:text-${color}-500`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {helpText && (
        <p
          className={`mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`}
        >
          {helpText}
        </p>
      )}
      {error && (
        <p className={`mt-2 text-sm text-${color}-600 dark:text-${color}-500`}>
          <span className="font-medium">Oops!</span> {error.message?.toString()}
        </p>
      )}
      {!error && hint && (
        <p
          className={`mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};
