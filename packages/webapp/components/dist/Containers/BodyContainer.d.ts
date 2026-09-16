import React from "react";
type Props = {
    children: React.ReactNode;
    appVersion?: string;
    /** Default true. Captures window.onerror / unhandledrejection. */
    reportClientErrors?: boolean;
};
export declare const BodyContainer: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
