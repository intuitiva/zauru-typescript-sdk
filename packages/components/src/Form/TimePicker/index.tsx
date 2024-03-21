import { ClockIconSVG, CloseSvgIcon, IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import React, { useEffect, useState } from "react";

type Props = {
  id?: string;
  name: string;
  formName?: string;
  title?: string;
  hint?: string;
  helpText?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  tabIndex?: number;
  error?: string;
  disabled?: boolean;
};

export const FormTimePickerWithoutValidation = (props: Props) => {
  const {
    id,
    name,
    title,
    defaultValue = "",
    hint,
    helpText,
    onChange,
    tabIndex,
    error,
    disabled = false,
  } = props;

  const [value, setValue] = useState<string>(defaultValue);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

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
    <>
      {title && (
        <label
          htmlFor={error ? `${name}-error` : `${name}-success`}
          className={`block text-sm font-medium ${textColor}`}
        >
          {title}
        </label>
      )}
      <div className="flex relative items-center">
        <div className="absolute left-0 flex items-center pl-3 pointer-events-none">
          <ClockIconSVG />
        </div>
        <input
          id={id}
          name={name}
          tabIndex={tabIndex}
          type="time"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            onChange && onChange(e.target.value);
          }}
          value={value}
          pattern="\d{2}:\d{2}"
          className={`${bgColor} ${borderColor} ${textColor} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5`}
        />
        {value && (
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
    </>
  );
};

export const FormTimePicker = (props: Props) => {
  const { formValidations } = useAppSelector((state) => state.formValidation);
  const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];
  props = { ...props, error };

  return <FormTimePickerWithoutValidation {...props} />;
};
