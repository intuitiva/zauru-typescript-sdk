type Props = {
    type?: "reset" | "button" | "submit" | undefined;
    title?: string;
    name?: string;
    onClickSave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loading?: boolean;
    loadingText?: string;
    selectedColor?: "indigo" | "green" | "red" | "yellow" | "gray";
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    enableFormErrorsValidation?: boolean;
    enableFormErrorsDescriptions?: boolean;
};
export declare const Button: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
