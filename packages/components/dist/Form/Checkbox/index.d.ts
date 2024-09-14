import React from "react";
type Props = {
    id?: string;
    name?: string;
    label?: string;
    defaultValue?: boolean;
    onChange?: (value: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
        stopUIChange: boolean;
    } | void;
    disabled?: boolean;
    borderColor?: string;
    required?: boolean;
};
export declare const CheckBox: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
