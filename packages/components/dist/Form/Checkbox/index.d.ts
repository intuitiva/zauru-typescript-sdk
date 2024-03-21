import React from "react";
type Props = {
    id?: string;
    name?: string;
    formName?: string;
    label?: string;
    defaultValue?: boolean;
    onChange?: (value: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
        stopUIChange: boolean;
    } | void;
    disabled?: boolean;
    error?: string | undefined;
    borderColor?: string;
};
export declare const CheckboxWithoutValidation: (props: Props) => import("react/jsx-runtime").JSX.Element;
export declare const CheckBox: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
