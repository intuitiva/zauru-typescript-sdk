type Props = {
    id?: string;
    name: string;
    formName?: string;
    title?: string;
    hint?: string;
    helpText?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    isClearable?: boolean;
    tabIndex?: number;
    error?: string;
    disabled?: boolean;
    className?: string;
};
export declare const FormDatePickerWithoutValidation: (props: Props) => import("react/jsx-runtime").JSX.Element;
export declare const FormDatePicker: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
