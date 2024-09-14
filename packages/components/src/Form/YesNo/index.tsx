import { useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  id?: string;
  name: string;
  formName?: string;
  title?: string;
  defaultValue?: boolean;
  helpText?: string;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  required?: boolean;
};

export const YesNo = (props: Props) => {
  const {
    id,
    name,
    title,
    defaultValue = false,
    helpText,
    onChange,
    disabled,
    required,
  } = props;

  const {
    register: tempRegister,
    formState: { errors },
  } = useFormContext() || { formState: {} }; // Obtener el contexto solo si existe
  const error = errors ? errors[props.name ?? "-1"] : undefined;
  const register = tempRegister
    ? tempRegister(props.name ?? "-1", { required })
    : undefined; // Solo usar register si está disponible

  const [value, setValue] = useState(defaultValue);

  const color = error ? "red" : "gray";

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // No hacer nada si está deshabilitado
    if (register) {
      register.onChange(e);
    }
    const newValue = !value;
    setValue(newValue);
    onChange && onChange(newValue);
  };

  return (
    <>
      <label
        className={`relative inline-flex items-center cursor-pointer ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <input
          type="checkbox"
          id={id ?? name}
          checked={value}
          value={value.toString()}
          className="sr-only peer"
          disabled={disabled}
          {...(register ?? {})}
          name={name}
          onChange={handleOnChange}
        />
        {value.toString() === "false" && (
          <input type="hidden" name={name} value="false" />
        )}
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">{title}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      {error && (
        <p className={`mt-2 text-sm text-${color}-600 dark:text-${color}-500`}>
          <span className="font-medium">Oops!</span> {error.message?.toString()}
        </p>
      )}
      {!error && helpText && (
        <p
          className={`mt-2 italic text-sm text-${color}-500 dark:text-${color}-400`}
        >
          {helpText}
        </p>
      )}
    </>
  );
};
