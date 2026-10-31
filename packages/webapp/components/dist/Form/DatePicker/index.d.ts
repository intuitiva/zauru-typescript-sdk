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
    isDateAllowed?: (value: string) => boolean;
    onDateRejected?: (value: string) => void;
};
export declare const FormDatePicker: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
