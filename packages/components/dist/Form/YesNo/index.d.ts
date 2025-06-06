type Props = {
    id?: string;
    name: string;
    title?: string;
    defaultValue?: boolean;
    helpText?: string;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    required?: boolean;
};
export declare const YesNo: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
