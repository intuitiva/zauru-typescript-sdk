type Props = {
    id?: string;
    name: string;
    title?: string;
    hint?: string;
    helpText?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    tabIndex?: number;
    disabled?: boolean;
    required?: boolean;
};
export declare const FormTimePicker: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
