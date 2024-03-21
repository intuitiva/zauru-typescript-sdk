import { useAppSelector } from "@zauru-sdk/redux";
import React, { useEffect, useState } from "react";

type Props = {
  id?: string;
  name: string;
  formName?: string;
  title?: string;
  defaultValue?: string | number;
  hidden?: boolean;
  hint?: string;
  helpText?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string | undefined;
  rows?: number;
  cols?: number;
  stopChangeEvents?: boolean;
  className?: string;
};

export const TextAreaWithoutValidation = (props: Props) => {
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
    error = false,
    readOnly = false,
    rows,
    cols,
    stopChangeEvents,
    className = "",
  } = props;

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
      <textarea
        id={id ?? name}
        name={name}
        value={defaultValue}
        readOnly={true}
        hidden={true}
      />
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        </label>
      )}
      <textarea
        name={name}
        readOnly={readOnly}
        disabled={disabled}
        id={id ?? name}
        autoComplete="given-name"
        value={value}
        rows={rows}
        cols={cols}
        onChange={handleInputChange}
        onKeyDown={(event: React.KeyboardEvent) => {
          onKeyDown && onKeyDown(event);
        }}
        className={`mt-1 block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
      />
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

//<reference> https://tailwindui.com/components/application-ui/forms/form-layouts
export const TextArea = (props: Props) => {
  const { formValidations } = useAppSelector((state) => state.formValidation);
  const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];

  props = { ...props, error };

  return <TextAreaWithoutValidation {...props} />;
};
