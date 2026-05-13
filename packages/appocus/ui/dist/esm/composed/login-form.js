"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form } from "react-router";
import { useAppocusConfig } from "@appocus/config";
import { cn } from "../lib/utils.js";
import { Button } from "../primitives/button.js";
import { Card, CardContent } from "../primitives/card.js";
import { Field, FieldDescription, FieldGroup, FieldSeparator, } from "../primitives/field.js";
/**
 * Two-column card with a Zauru OAuth submit button. Pulls branding strings
 * (title, logo alt text, mailto link…) from `@appocus/config` so every app
 * gets its own copy without touching the component.
 */
export function LoginForm({ className, isLoading = false, mode = "login", title: titleProp, loadingText: loadingTextProp, buttonText: buttonTextProp, ...props }) {
    const { login, assets, support } = useAppocusConfig();
    const title = titleProp ?? login.defaultTitle;
    const loadingText = loadingTextProp ?? login.loadingText;
    const buttonText = buttonTextProp ?? login.buttonText;
    return (_jsx("div", { className: cn("flex flex-col gap-6", className), ...props, children: _jsx(Card, { className: "overflow-hidden p-0", children: _jsxs(CardContent, { className: "grid p-0 md:grid-cols-2", children: [_jsx(Form, { method: "POST", action: mode === "login" ? "/login" : "/logout", className: "p-6 md:p-8", children: _jsxs(FieldGroup, { children: [_jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [_jsx("h1", { className: "text-2xl mb-4 font-bold", children: title }), _jsx("img", { src: assets.logo, alt: login.logoAlt, className: "h-20 w-auto object-contain" })] }), _jsx(FieldSeparator, { className: "*:data-[slot=field-separator-content]:bg-card" }), _jsx(Field, { children: _jsx(Button, { className: "w-full cursor-pointer", type: "submit", disabled: isLoading, children: isLoading ? loadingText : buttonText }) }), mode === "login" && (_jsxs(FieldDescription, { className: "text-center", children: [login.accountPrompt, _jsx("a", { href: support.accountRequestMailtoHref, className: "text-primary hover:underline", children: login.accountLinkLabel })] }))] }) }), _jsx("div", { className: "bg-muted relative hidden md:block", children: _jsx("img", { src: assets.loginHero, alt: login.heroAlt, className: "absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" }) })] }) }) }));
}
