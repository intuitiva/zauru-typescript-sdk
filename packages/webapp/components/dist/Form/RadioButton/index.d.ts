import { SelectFieldOption } from "@zauru-sdk/types";
import React from "react";
type Props = {
    id?: string;
    name: string;
    title?: string;
    options: SelectFieldOption[];
    defaultValue?: string | number;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;
    helpText?: string;
    hint?: string;
    className?: string;
    orientation?: "horizontal" | "vertical";
};
export declare const RadioButton: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
