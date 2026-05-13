import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./button.js";
import { Card, CardContent, CardHeader } from "./card.js";
export function NotFoundState({ title = "Recurso no encontrado", description = "El recurso que estás buscando no existe o ha sido eliminado.", backLink = "/", backLinkText = "Volver", }) {
    return (_jsx("div", { className: "flex flex-1 items-center justify-center p-4 md:p-6", children: _jsxs(Card, { className: "max-w-md w-full", children: [_jsx(CardHeader, { className: "text-center pb-4", children: _jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: _jsx(AlertCircle, { className: "h-8 w-8 text-destructive" }) }) }), _jsxs(CardContent, { className: "text-center space-y-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: title }), _jsx("p", { className: "text-muted-foreground text-sm", children: description })] }), _jsx("div", { className: "flex justify-center gap-2 pt-2", children: _jsx(Button, { variant: "outline", asChild: true, children: _jsxs(Link, { to: backLink, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), backLinkText] }) }) })] })] }) }));
}
