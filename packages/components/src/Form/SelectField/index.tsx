import { IdeaIconSVG } from "@zauru-sdk/icons";
import { useAppSelector } from "@zauru-sdk/redux";
import { SelectFieldOption } from "@zauru-sdk/types";
import { useEffect, useState } from "react";
import type { SingleValue, InputActionMeta } from "react-select";
import Select, { components } from "react-select";
import { LoadingInputSkeleton } from "../../Skeletons/index.js";

type Props = {
  id?: string;
  formName?: string;
  name?: string;
  title?: string;
  defaultValue?: SingleValue<SelectFieldOption>;
  defaultValueMulti?: SingleValue<SelectFieldOption>[];
  helpText?: string;
  options: Array<SelectFieldOption>;
  onChange?: (value: SingleValue<SelectFieldOption>) => void;
  onChangeMulti?: (value: Array<SingleValue<SelectFieldOption>>) => void;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  isClearable?: boolean;
  error?: string | undefined;
  disabled?: boolean;
  menuIsOpen?: boolean;
  readOnly?: boolean;
  isMulti?: boolean;
  loading?: boolean;
  hint?: string;
  className?: string;
};

const Input = (props: any) => (
  <components.Input {...props} readOnly={props.selectProps.isReadOnly} />
);

export const SelectFieldWithoutValidation = (props: Props) => {
  const {
    id,
    name,
    title,
    defaultValue,
    defaultValueMulti = [],
    helpText,
    hint,
    options,
    onChange,
    onChangeMulti,
    isClearable = false,
    error = false,
    disabled = false,
    readOnly = false,
    isMulti = false,
    loading = false,
    className = "",
    onInputChange,
  } = props;

  const [value, setValue] = useState<SingleValue<SelectFieldOption>>(
    defaultValue || null
  );
  const [valueMulti, setValueMulti] =
    useState<SingleValue<SelectFieldOption>[]>(defaultValueMulti);
  const [inputValue, setInputValue] = useState("");
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(typeof window !== "undefined");

  const menuIsOpen = readOnly ? false : props?.menuIsOpen;
  const color = error ? "red" : "gray";
  let documentRef = null;

  const isReadOnly = disabled || readOnly;
  const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
  const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
  const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-500`;

  if (typeof window !== "undefined") {
    documentRef = document;
  }

  useEffect(() => {
    setValue(defaultValue || null);
  }, [defaultValue]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loading || !documentRef) {
    return (
      <>
        {title && (
          <label
            htmlFor={error ? `${name}-error` : `${name}-success`}
            className={`block text-sm font-medium text-${color}-700 dark:text-${color}-500`}
          >
            {title}
          </label>
        )}
        <LoadingInputSkeleton />
        {helpText && (
          <p
            className={`mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`}
          >
            {helpText}
          </p>
        )}
      </>
    );
  }

  const handleOnChange = (
    selection: SingleValue<SelectFieldOption> | unknown
  ) => {
    // Verificar si el valor de selección es un objeto con propiedades 'value' y 'label'
    if (
      typeof selection === "object" &&
      selection !== null &&
      "value" in selection &&
      "label" in selection
    ) {
      setValue(selection as SingleValue<SelectFieldOption>);
      onChange && onChange(selection as SingleValue<SelectFieldOption>);
    } else {
      setValue(null);
      onChange && onChange(null);
    }
  };

  const handleOnChangeMulti = (
    selection: SingleValue<SelectFieldOption>[] | unknown
  ) => {
    if (Array.isArray(selection)) {
      setValueMulti(selection as SingleValue<SelectFieldOption>[]);
      onChangeMulti &&
        onChangeMulti(selection as SingleValue<SelectFieldOption>[]);
    } else {
      setValueMulti([]);
      onChangeMulti && onChangeMulti([]);
    }
  };

  const selectComponent = (
    <>
      <Select
        className={`block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
        id={isMulti ? undefined : id}
        instanceId={isMulti ? undefined : id}
        isDisabled={disabled}
        name={isMulti ? undefined : name}
        options={options}
        onChange={isMulti ? handleOnChangeMulti : handleOnChange}
        defaultValue={isMulti ? valueMulti : value}
        onInputChange={(newValue: string, actionMeta: InputActionMeta) => {
          setInputValue(newValue);
          onInputChange && onInputChange(newValue, actionMeta);
        }}
        inputValue={inputValue}
        onMenuOpen={() => {}}
        onMenuClose={() => {}}
        menuPortalTarget={documentRef?.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        isClearable={isClearable}
        isSearchable={true}
        components={{ Input }}
        menuIsOpen={menuIsOpen}
        //windowThreshold={50}
        isMulti={isMulti}
      />
      {isMulti && (
        <input
          hidden
          readOnly
          name={name}
          value={valueMulti.map((x) => x?.value).join(",")}
          id={id}
        />
      )}
    </>
  );

  return (
    <div className={`col-span-6 sm:col-span-3 ${className}`}>
      {title && (
        <label
          htmlFor={error ? `${name}-error` : `${name}-success`}
          className={`block text-sm font-medium ${
            color === "red"
              ? "text-red-700 dark:text-red-500"
              : "text-gray-700 dark:text-gray-500"
          }`}
        >
          {title}
        </label>
      )}
      <div className="flex relative items-center">
        {selectComponent}
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

export const SelectField = (props: Props) => {
  const { formValidations } = useAppSelector((state) => state.formValidation);
  const error = formValidations[props.formName ?? "-1"]?.[props.name ?? "-1"];

  props = { ...props, error };

  return <SelectFieldWithoutValidation {...props} />;
};
