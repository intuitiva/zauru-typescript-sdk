import { useAppSelector } from "@zauru-sdk/redux";
import React, { useEffect, useState } from "react";

type Props = {
  id?: string;
  name?: string;
  formName?: string;
  label?: string;
  defaultValue?: boolean;
  onChange?: (
    value: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => { stopUIChange: boolean } | void;
  disabled?: boolean;
  error?: string | undefined;
  borderColor?: string;
};

export const CheckboxWithoutValidation = (props: Props) => {
  const {
    id,
    name,
    defaultValue = false,
    onChange,
    disabled = false,
    error,
    label,
  } = props;

  const [checked, setChecked] = useState(defaultValue);

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (onChange) {
      const result = onChange(isChecked, event);
      if (result?.stopUIChange) {
        return;
      }
    }
    setChecked(isChecked);
  };

  const color = error ? "red" : "gray";
  const borderColor = disabled ? "border-gray-300" : `border-${color}-500`;

  const inputComponent = (
    <input
      type="checkbox"
      id={id ?? name}
      name={name}
      checked={checked}
      onChange={handleInputChange}
      className={`form-checkbox h-4 w-4 text-indigo-600 ${borderColor} focus:border-indigo-500 focus:ring-indigo-500`}
      disabled={disabled}
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
          </label>
        )}
      </div>
      {error && (
        <p className={`mt-2 text-sm text-${color}-600 dark:text-${color}-500`}>
          <span className="font-medium">Oops!</span> {error}
        </p>
      )}
    </div>
  );
};

//<reference> https://tailwindui.com/components/application-ui/forms/form-layouts
export const CheckBox = (props: Props) => {
  const { formValidations } = useAppSelector((state) => state.formValidation);
  const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];

  props = { ...props, error };

  return <CheckboxWithoutValidation {...props} />;
};
