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
export declare const FormTimePickerWithoutValidation: (props: Props) => import("react/jsx-runtime").JSX.Element;
export declare const FormTimePicker: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
