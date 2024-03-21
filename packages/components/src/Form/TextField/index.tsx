import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import React, { useEffect, useState } from "react";

type Props = {
  id?: string;
  name?: string;
  formName?: string;
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
  error?: string;
  min?: string | number;
  integer?: boolean;
  stopChangeEvents?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export const TextFieldWithoutValidation = (props: Props) => {
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
    error,
    title,
    helpText,
    className,
    hint,
  } = props;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [value, setValue] = useState(defaultValue);

  const color = error ? "red" : "gray";

  const isReadOnly = disabled || readOnly;
  const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
  const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
  const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  if (hidden) {
    return (
      <input
        type={type}
        id={id ?? name}
        name={name}
        value={defaultValue}
        readOnly={true}
        hidden={true}
      />
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const inputComponent = (
    <input
      type={type}
      name={name}
      readOnly={readOnly}
      disabled={disabled}
      id={id ?? name}
      autoComplete="given-name"
      value={value}
      onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
        e.currentTarget.blur();
      }}
      step={type === "number" ? 0.01 : undefined} //para aceptar decimales
      onChange={handleInputChange}
      onKeyDown={(event: React.KeyboardEvent) => {
        handleKeyDown(event);
        onKeyDown && onKeyDown(event);
      }}
      min={min}
      style={style}
      className={`block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
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
          <span className="font-medium">Oops!</span> {error}
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

export const TextField = (props: Props) => {
  const { formValidations } = useAppSelector((state) => state.formValidation);
  const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];

  props = { ...props, error };

  return <TextFieldWithoutValidation {...props} />;
};
