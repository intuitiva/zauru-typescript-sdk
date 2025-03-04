import React from "react";
type Props = {
    id?: string;
    name: string;
    formName?: string;
    title?: string;
    helpText?: string;
    hint?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    fileTypes?: string[];
    showAvailableTypes?: boolean;
    className?: string;
    defaultValue?: string | File;
    download?: boolean;
    required?: boolean;
};
export declare const FileUploadField: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
