import React, { useEffect, useState } from "react";
import { CalendarIconSVG, CloseSvgIcon, IdeaIconSVG } from "@zauru-sdk/icons";
import { useFormContext } from "react-hook-form";

type Props = {
  id?: string;
  name: string;
  title?: string;
  hint?: string;
  helpText?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  isClearable?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  className?: string;
  required?: boolean;
};

export const FormDatePicker = (props: Props) => {
  const {
    id,
    name,
    title,
    defaultValue = "",
    hint,
    helpText,
    onChange,
    tabIndex,
    disabled = false,
    className = "",
    isClearable = false,
    required = false,
  } = props;

  const [value, setValue] = useState<string | null>(defaultValue);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const {
    register: tempRegister,
    formState: { errors },
  } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
  const error = errors ? errors[props.name ?? "-1"] : undefined;
  const register = tempRegister
    ? tempRegister(props.name ?? "-1", { required })
    : undefined; // Solo usar register si está disponible

  const color = error ? "red" : "gray";

  const isReadOnly = disabled;
  const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
  const textColor = isReadOnly ? "text-gray-500" : `text-${color}-500`;
  const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-200`;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const clearValue = () => {
    setValue("");
    onChange && onChange("");
  };

  return (
    <div>
      {title && (
        <label
          htmlFor={error ? `${name}-error` : `${name}-success`}
          className={`block text-sm font-medium ${textColor} ${className}`}
        >
          {title}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex relative items-center">
        <div className="absolute left-0 flex items-center pl-3 pointer-events-none">
          <CalendarIconSVG />
        </div>
        <input
          id={id}
          tabIndex={tabIndex}
          type="date"
          value={value ?? ""}
          pattern="\d{4}-\d{2}-\d{2}"
          className={`${bgColor} ${borderColor} ${textColor} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5`}
          {...(register ?? {})}
          name={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            onChange && onChange(e.target.value);
            if (register) {
              register.onChange(e);
            }
          }}
        ></input>
        {value && isClearable && (
          <button
            type="button"
            onClick={clearValue}
            className="absolute right-0 mr-10"
          >
            <CloseSvgIcon />
          </button>
        )}
        {helpText && (
          <div className="flex items-center relative ml-3">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <IdeaIconSVG />
              {showTooltip && (
                <div className="absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black">
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
