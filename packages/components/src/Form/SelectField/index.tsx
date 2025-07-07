import { IdeaIconSVG } from "@zauru-sdk/icons";
import { SelectFieldOption } from "@zauru-sdk/types";
import React, {
  useEffect,
  useState,
  useRef,
  KeyboardEvent,
  useCallback,
} from "react";
import { LoadingInputSkeleton } from "../../Skeletons/index.js";
import { useFormContext } from "react-hook-form";
import isEqual from "lodash/isEqual";

type Props = {
  id?: string;
  name?: string;
  title?: string;
  defaultValue?: SelectFieldOption;
  defaultValueMulti?: SelectFieldOption[];
  helpText?: string;
  options: Array<SelectFieldOption>;
  onChange?: (value: SelectFieldOption | null) => void;
  onChangeMulti?: (value: SelectFieldOption[]) => void;
  onInputChange?: (newValue: string) => void;
  isClearable?: boolean;
  disabled?: boolean;
  menuIsOpen?: boolean;
  readOnly?: boolean;
  isMulti?: boolean;
  loading?: boolean;
  hint?: string;
  className?: string;
  required?: boolean;
};

export const SelectField = (props: Props) => {
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
    disabled = false,
    readOnly = false,
    isMulti = false,
    loading = false,
    className = "",
    onInputChange,
    required = false,
  } = props;

  const [value, setValue] = useState<SelectFieldOption | null>(
    defaultValue || null
  );
  const [valueMulti, setValueMulti] =
    useState<SelectFieldOption[]>(defaultValueMulti);
  const [inputValue, setInputValue] = useState(defaultValue?.label || "");
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const [isTabPressed, setIsTabPressed] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Use refs to store stable references to callbacks
  const onChangeRef = useRef(onChange);
  const onChangeMultiRef = useRef(onChangeMulti);
  const onInputChangeRef = useRef(onInputChange);

  // Update refs when callbacks change
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeMultiRef.current = onChangeMulti;
  }, [onChangeMulti]);

  useEffect(() => {
    onInputChangeRef.current = onInputChange;
  }, [onInputChange]);

  const {
    register: tempRegister,
    formState: { errors },
    setValue: setFormValue,
  } = useFormContext() || { formState: {} };
  const error = errors ? errors[props.name ?? "-1"] : undefined;
  const register = tempRegister
    ? tempRegister(props.name ?? "-1", {
        required,
      })
    : undefined; // Solo usar register si está disponible

  const color = error ? "red" : "gray";
  const isReadOnly = disabled || readOnly;
  const bgColor = isReadOnly ? "bg-gray-200" : `bg-${color}-50`;
  const textColor = isReadOnly ? "text-gray-500" : `text-${color}-900`;
  const borderColor = isReadOnly ? "border-gray-300" : `border-${color}-200`;

  // Sincronizar estado interno cuando cambien las props
  useEffect(() => {
    if (defaultValue && (!value || value.value !== defaultValue.value)) {
      setValue(defaultValue);
      setInputValue(defaultValue.label);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (!isEqual(defaultValueMulti, valueMulti)) {
      setValueMulti(defaultValueMulti);
    }
  }, [defaultValueMulti]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSetSingleValue = useCallback(
    (value?: SelectFieldOption) => {
      if (value) {
        setValue(value);
        setInputValue(value.label);
        if (setFormValue) {
          setFormValue(name || "", value.value);
        }
      } else {
        setValue(null);
        setInputValue("");
        if (setFormValue) {
          setFormValue(name || "", "");
        }
      }
      onChangeRef.current && onChangeRef.current(value ?? null);
    },
    [name, setFormValue]
  );

  const handleAddMultiValue = useCallback(
    (value?: SelectFieldOption) => {
      if (value) {
        const existValue = options.some((v) => v.value === value.value);
        const noEstaYaSeleccionado = !valueMulti.some(
          (v) => v.value === value.value
        );
        if (existValue && noEstaYaSeleccionado) {
          const newValue = [...valueMulti, value];
          setValueMulti(newValue);
          if (setFormValue) {
            setFormValue(
              name || "",
              newValue.map((v) => v.value)
            );
          }
          onChangeMultiRef.current && onChangeMultiRef.current(newValue);
        }
      } else {
        setValueMulti([]);
        if (setFormValue) {
          setFormValue(name || "", []);
        }
        setInputValue("");
        onChangeMultiRef.current && onChangeMultiRef.current([]);
      }
    },
    [options, valueMulti, name, setFormValue]
  );

  const handleRemoveMultiValue = useCallback(
    (value: SelectFieldOption) => {
      const newValue = valueMulti.filter((v) => v.value !== value.value);
      setValueMulti(newValue);
      if (setFormValue) {
        setFormValue(
          name || "",
          newValue.map((v) => v.value)
        );
      }
      onChangeMultiRef.current && onChangeMultiRef.current(newValue);
    },
    [valueMulti, name, setFormValue]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (register) {
        register.onChange(e);
      }
      setInputValue(newValue);
      onInputChangeRef.current && onInputChangeRef.current(newValue);
      setIsSearching(true);
      setFilteredOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(newValue.toLowerCase())
        )
      );
    },
    [register, options]
  );

  const handleOptionClick = useCallback(
    (option: SelectFieldOption) => {
      if (isMulti) {
        handleAddMultiValue(option);
      } else {
        handleSetSingleValue(option);
      }
      setHighlightedIndex(-1);
      setIsSearching(false);
      setFilteredOptions(options);
      setIsOpen(false);
    },
    [isMulti, handleAddMultiValue, handleSetSingleValue, options]
  );

  const handleClear = useCallback(() => {
    if (isMulti) {
      handleAddMultiValue();
    } else {
      handleSetSingleValue();
    }
  }, [isMulti, handleAddMultiValue, handleSetSingleValue]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (isTabPressed && highlightedIndex >= 0) {
        handleOptionClick(filteredOptions[highlightedIndex]);
      } else if (isTabPressed && filteredOptions.length > 0 && isSearching) {
        handleOptionClick(filteredOptions[0]);
      }

      setHighlightedIndex(-1);
      setIsTabPressed(false);
      setIsSearching(false);
      setIsOpen(false);
    }, 200);
  }, [
    isTabPressed,
    highlightedIndex,
    filteredOptions,
    isSearching,
    handleOptionClick,
  ]);

  const scrollToHighlightedOption = useCallback(() => {
    if (optionsRef.current && optionsRef.current.children[highlightedIndex]) {
      const highlightedOption = optionsRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      highlightedOption.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        setIsTabPressed(true);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        scrollToHighlightedOption();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        scrollToHighlightedOption();
      } else if (e.key === "Enter" && highlightedIndex !== -1) {
        e.preventDefault();
        handleOptionClick(filteredOptions[highlightedIndex]);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        (value || valueMulti.length > 0)
      ) {
        // Solo borrar selecciones cuando el input esté vacío
        e.preventDefault();
        if (isMulti && valueMulti.length > 0) {
          // En modo multi, borrar la última selección
          const lastIndex = valueMulti.length - 1;
          handleRemoveMultiValue(valueMulti[lastIndex]);
        } else {
          // En modo single, borrar la selección
          handleClear();
        }
        setFilteredOptions(options);
        setIsOpen(true);
      }
    },
    [
      filteredOptions,
      scrollToHighlightedOption,
      highlightedIndex,
      handleOptionClick,
      inputValue,
      value,
      valueMulti,
      handleClear,
      handleRemoveMultiValue,
      isMulti,
      options,
    ]
  );

  if (loading) {
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

  return (
    <div className={`col-span-6 sm:col-span-3 ${className}`} ref={selectRef}>
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
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="flex items-center">
          <input
            type="text"
            id={id}
            value={inputValue}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            readOnly={isReadOnly}
            disabled={disabled}
            className={`block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10`}
            placeholder={isMulti ? "Select options..." : "Select an option..."}
            autoComplete="off"
            onChange={handleInputChange}
            onBlur={handleBlur}
            required={required}
          />
          {isClearable && (value || valueMulti.length > 0) && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              ×
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
                  <div className="absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50">
                    {helpText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <input
          type="hidden"
          {...(register ?? {})}
          name={name}
          value={
            isMulti
              ? valueMulti.map((v) => v.value).join(",")
              : value?.value || ""
          }
        />
        {isOpen && !isReadOnly && (
          <ul
            ref={optionsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          >
            {filteredOptions.map((option, index) => (
              <li
                key={`${option.value}-${index}`}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                  (
                    isMulti
                      ? valueMulti.some((v) => v.value === option.value)
                      : value?.value === option.value
                  )
                    ? "text-white bg-indigo-600"
                    : index === highlightedIndex
                    ? "text-black bg-sky-200"
                    : "text-gray-900"
                }`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isMulti && valueMulti.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {valueMulti.map((option, index) => (
            <span
              key={`${option.value}-${index}`}
              className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {option.label}
              <button
                type="button"
                onClick={() => handleRemoveMultiValue(option)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {error && (
        <p className={`mt-2 text-sm text-${color}-600 dark:text-${color}-500`}>
          <span className="font-medium">Oops!</span>{" "}
          {error?.message?.toString() || "Error desconocido"}
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
