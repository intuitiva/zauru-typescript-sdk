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
  } = props;

  const [checked, setChecked] = useState(defaultValue);

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
      className={`form-checkbox h-4 w-4 text-indigo-600 ${borderColor} focus:border-indigo-500 focus:ring-indigo-500`}
      disabled={disabled}
      {...(register ?? {})}
      name={name}
      onChange={handleInputChange}
    />
  );

  if (!error && !label) {
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
      </div>
      {error && (
        <p className={`mt-2 text-sm text-${color}-600 dark:text-${color}-500`}>
          <span className="font-medium">Oops!</span> {error.message?.toString()}
        </p>
      )}
    </div>
  );
};
