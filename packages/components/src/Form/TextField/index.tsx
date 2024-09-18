import { IdeaIconSVG } from "@zauru-sdk/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  id?: string;
  name?: string;
  title?: string;
  defaultValue?: string | number;
  hidden?: boolean;
  type?: React.HTMLInputTypeAttribute;
  helpText?: string;
  hint?: string;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  disabled?: boolean;
  readOnly?: boolean;
  min?: string | number;
  integer?: boolean;
  stopChangeEvents?: boolean;
  style?: React.CSSProperties;
  className?: string;
  required?: boolean;
};

export const TextField = (props: Props) => {
  const {
    id,
    name,
    defaultValue = "",
    hidden,
    type = "text",
    onChange,
    onKeyDown,
    disabled = false,
    readOnly = false,
    min,
    integer = false,
    stopChangeEvents,
    style,
    title,
    helpText,
    className,
    hint,
    required,
  } = props;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [value, setValue] = useState(defaultValue);
  const {
    register: tempRegister,
    formState: { errors },
  } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
  const error = errors ? errors[props.name ?? "-1"] : undefined;
  const register = tempRegister
    ? tempRegister(props.name ?? "-1", {
        valueAsNumber: props.type === "number",
        required,
      })
    : undefined; // Solo usar register si está disponible

  const color = error ? "red" : "gray";

  const isReadOnly = disabled || readOnly;
  const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
  const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
  const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (register) {
      register.onChange(event);
    }
    if (stopChangeEvents) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (integer && type === "number") {
      const value = event.target.value;
      const isInteger = /^[0-9]*$/.test(value);
      if (isInteger || value === "") {
        setValue(value);
        onChange && onChange(value, event);
      }
    } else {
      setValue(event.target.value);
      onChange && onChange(event.target.value, event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (integer && type === "number") {
      // Permitir solo números y teclas de control
      const allowedKeys = [
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Enter",
        "Tab",
      ];
      if (!allowedKeys.includes(event.key) && !/^[0-9]$/.test(event.key)) {
        event.preventDefault();
      }
    }
  };

  if (hidden) {
    return (
      <input
        type={"hidden"}
        id={id ?? name}
        value={value}
        readOnly={true}
        hidden={true}
        {...(register ?? {})}
        name={name}
        onChange={handleInputChange}
      />
    );
  }

  const inputComponent = (
    <input
      type={type}
      readOnly={readOnly}
      disabled={disabled}
      id={id ?? name}
      autoComplete="given-name"
      value={value}
      onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
        e.currentTarget.blur();
      }}
      step={type === "number" ? 0.01 : undefined} //para aceptar decimales
      onKeyDown={(event: React.KeyboardEvent) => {
        handleKeyDown(event);
        onKeyDown && onKeyDown(event);
      }}
      min={min}
      style={style}
      className={`block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
      {...(register ?? {})}
      name={name}
      onChange={handleInputChange}
    />
  );

  if (!error && !title) {
    return <div className={`${className}`}>{inputComponent}</div>;
  }

  return (
    <div className={`col-span-6 sm:col-span-3 ${className}`}>
      {title && (
        <label
          htmlFor={error ? `${name}-error` : `${name}-success`}
          className={`block mb-1 text-sm font-medium text-${color}-700 dark:text-${color}-500`}
        >
          {title}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex relative items-center">
        {inputComponent}
        {helpText && (
          <div className="flex items-center relative ml-3">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <IdeaIconSVG />
              {showTooltip && (
                <div className="absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50">
                  {helpText}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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
