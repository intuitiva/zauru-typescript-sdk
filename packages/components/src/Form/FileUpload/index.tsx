import { DownloadIconSVG, IdeaIconSVG } from "@zauru-sdk/icons";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  id?: string;
  name: string;
  formName?: string;
  title?: string;
  helpText?: string;
  hint?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  fileTypes?: string[];
  showAvailableTypes?: boolean;
  className?: string;
  defaultValue?: string | File;
  download?: boolean;
  required?: boolean;
};

export const FileUploadField = (props: Props) => {
  const {
    id,
    name,
    title,
    helpText,
    hint,
    onChange,
    disabled = false,
    readOnly = false,
    fileTypes = [],
    showAvailableTypes = false,
    className,
    defaultValue = undefined,
    download = false,
    required = false,
  } = props;

  const {
    register: tempRegister,
    formState: { errors },
  } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
  const error = errors ? errors[props.name ?? "-1"] : undefined;
  const register = tempRegister
    ? tempRegister(props.name ?? "-1", { required })
    : undefined; // Solo usar register si está disponible

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  if (typeof defaultValue == "string") {
    if (download) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            window.open(defaultValue, "_blank");
          }}
          onKeyDown={(event) => {
            // Permite que el evento se active con la tecla Enter
            if (event.key === "Enter") {
              window.open(defaultValue, "_blank");
            }
          }}
        >
          {title && (
            <label
              htmlFor={name}
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              {title}
            </label>
          )}{" "}
          <DownloadIconSVG />
        </div>
      );
    }
    return (
      <div className={`col-span-6 sm:col-span-3 ${className}`}>
        {title && (
          <label
            htmlFor={name}
            className={`block mb-1 text-sm font-medium text-gray-700`}
          >
            {title}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}{" "}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (register) {
              register.onChange({
                target: {
                  value: defaultValue,
                },
              });
            }
            window.open(defaultValue, "_blank");
          }}
          onKeyDown={(event) => {
            // Permite que el evento se active con la tecla Enter
            if (event.key === "Enter") {
              if (register) {
                register.onChange({
                  target: {
                    value: defaultValue,
                  },
                });
              }
              window.open(defaultValue, "_blank");
            }
          }}
        >
          <img
            src={defaultValue}
            alt={name}
            className={`h-48 w-48 inline mr-1 pb-1`}
            style={{
              stroke: "currentColor",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event);
  };

  let hintMessage = hint;
  if (showAvailableTypes && fileTypes.length > 0) {
    hintMessage = `${hint} Archivos permitidos: ${fileTypes.join(", ")}`;
  }

  const color = error ? "red" : "gray";
  const isReadOnly = disabled || readOnly;
  const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
  const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
  const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;

  return (
    <div className={`col-span-6 sm:col-span-3 ${className}`}>
      {title && (
        <label
          htmlFor={name}
          className={`block mb-1 text-sm font-medium text-${color}-700`}
        >
          {title}
        </label>
      )}
      <div className="flex relative items-center">
        <input
          type="file"
          name={name}
          id={id ?? name}
          disabled={disabled}
          readOnly={readOnly}
          accept={fileTypes.map((ft) => `.${ft}`).join(", ")}
          onChange={handleInputChange}
          className={`block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
        />
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
        <p className={`mt-2 text-sm text-${color}-600`}>
          <span className="font-medium">Oops!</span> {error.message?.toString()}
        </p>
      )}
      {!error && hintMessage && (
        <p className={`mt-2 italic text-sm text-${color}-500`}>{hintMessage}</p>
      )}
    </div>
  );
};
