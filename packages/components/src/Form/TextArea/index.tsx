import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  id?: string;
  name: string;
  title?: string;
  defaultValue?: string | number;
  hidden?: boolean;
  hint?: string;
  helpText?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  cols?: number;
  stopChangeEvents?: boolean;
  className?: string;
  required?: boolean;
};

export const TextArea = (props: Props) => {
  const {
    id,
    name,
    title,
    defaultValue = "",
    hidden,
    hint,
    onChange,
    onKeyDown,
    disabled = false,
    readOnly = false,
    rows,
    cols,
    stopChangeEvents,
    className = "",
    required,
  } = props;

  const [value, setValue] = useState(defaultValue);
  const {
    register: tempRegister,
    formState: { errors },
  } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
  const error = errors ? errors[props.name ?? "-1"] : undefined;
  const register = tempRegister
    ? tempRegister(props.name ?? "-1", { required })
    : undefined; // Solo usar register si está disponible

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
      <textarea
        id={id ?? name}
        value={defaultValue}
        readOnly={true}
        hidden={true}
        {...(register ?? {})}
        name={name}
      />
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (register) {
      register.onChange(event);
    }
    if (stopChangeEvents) {
      event.stopPropagation();
      event.preventDefault();
    }
    setValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  return (
    <div className={`col-span-6 sm:col-span-3 ${className}`}>
      {title && (
        <label
          htmlFor={error ? `${name}-error` : `${name}-success`}
          className={`block text-sm font-medium text-${color}-700 dark:text-${color}-500`}
        >
          {title}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        readOnly={readOnly}
        disabled={disabled}
        id={id ?? name}
        autoComplete="given-name"
        value={value}
        rows={rows}
        cols={cols}
        onKeyDown={(event: React.KeyboardEvent) => {
          onKeyDown && onKeyDown(event);
        }}
        className={`mt-1 block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
        {...(register ?? {})}
        name={name}
        onChange={handleInputChange}
      />
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
