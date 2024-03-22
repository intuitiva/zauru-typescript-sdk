type Props = {
    id?: string;
    name: string;
    formName?: string;
    title?: string;
    defaultValue?: boolean;
    helpText?: string;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
};
export declare const YesNo: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
