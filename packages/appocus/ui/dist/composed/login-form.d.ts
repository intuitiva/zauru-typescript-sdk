import * as React from "react";
export interface LoginFormProps extends React.ComponentProps<"div"> {
    isLoading?: boolean;
    mode?: "login" | "logout";
    title?: string;
    loadingText?: string;
    buttonText?: string;
}
/**
 * Two-column card with a Zauru OAuth submit button. Pulls branding strings
 * (title, logo alt text, mailto link…) from `@appocus/config` so every app
 * gets its own copy without touching the component.
 */
export declare function LoginForm({ className, isLoading, mode, title: titleProp, loadingText: loadingTextProp, buttonText: buttonTextProp, ...props }: LoginFormProps): import("react/jsx-runtime").JSX.Element;
