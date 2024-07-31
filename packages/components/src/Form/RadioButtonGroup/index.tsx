import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import React, { useState } from "react";

type RadioButtonProps = {
  id?: string;
  name?: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  orientation?: "vertical" | "horizontal";
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  disabled?: boolean;
  error?: string;
  title?: string;
  helpText?: string;
  className?: string;
};

export const RadioButtonGroupWithoutValidation = (props: RadioButtonProps) => {
  const {
    id,
    name,
    options,
    defaultValue,
    orientation = "vertical",
    onChange,
    disabled = false,
    error,
    title,
    helpText,
    className,
  } = props;

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue
  );

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    onChange && onChange(event.target.value, event);
  };

  const containerClass =
    orientation === "vertical" ? "flex flex-col" : "flex flex-row space-x-5";

  return (
    <div className={`radio-button-group ${className}`}>
      {title && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {title}
        </label>
      )}
      <div className={containerClass}>
        {options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              id={id ? `${id}-${option.value}` : undefined}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleChange}
              disabled={disabled}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {helpText && (
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <IdeaIconSVG />
          {showTooltip && (
            <div className="absolute mt-2 p-2 bg-white border rounded shadow text-black z-50">
              {helpText}
            </div>
          )}
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          <span className="font-medium">Oops!</span> {error}
        </p>
      )}
    </div>
  );
};

export const RadioButtonGroup = (props: RadioButtonProps) => {
  const { formValidations } = useAppSelector((state) => state.formValidation);
  const error = formValidations[props.name ?? "-1"];

  props = { ...props, error };

  return <RadioButtonGroupWithoutValidation {...props} />;
};
