import { type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
export type DropdownOption = {
    label: string;
    value: string;
    onClick?: () => void;
    children?: DropdownOption[];
};
type Props = {
    type?: "reset" | "button" | "submit" | undefined;
    title?: string;
    name?: string;
    onClickSave?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
    loading?: boolean;
    loadingText?: string;
    selectedColor?: "indigo" | "green" | "red" | "yellow" | "gray";
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    enableFormErrorsValidation?: boolean;
    enableFormErrorsDescriptions?: boolean;
    dropdownOptions?: DropdownOption[];
    dropdownTitle?: string;
};
export declare const Button: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
