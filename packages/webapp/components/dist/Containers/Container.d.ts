import React from "react";
type Props = {
    title?: React.ReactNode;
    description?: string;
    children: React.ReactNode;
    className?: string;
    rightContent?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
};
export declare const Container: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
