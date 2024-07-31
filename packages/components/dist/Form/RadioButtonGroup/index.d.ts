import React from "react";
type RadioButtonProps = {
    id?: string;
    name?: string;
    options: {
        label: string;
        value: string;
    }[];
    defaultValue?: string;
    orientation?: "vertical" | "horizontal";
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: string;
    title?: string;
    helpText?: string;
    className?: string;
};
export declare const RadioButtonGroupWithoutValidation: (props: RadioButtonProps) => import("react/jsx-runtime").JSX.Element;
export declare const RadioButtonGroup: (props: RadioButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
