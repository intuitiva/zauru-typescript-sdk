import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "./button.js";
import { Card } from "./card.js";
import { X } from "lucide-react";
export function ServiceWorkerUpdateBanner({ onUpdate, onDismiss, }) {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        if (!isVisible) {
            onDismiss();
        }
    }, [isVisible, onDismiss]);
    if (!isVisible)
        return null;
    return (_jsx("div", { className: "fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5", children: _jsx(Card, { className: "p-4 shadow-lg border-2 border-primary/20", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-sm mb-1", children: "Nueva versi\u00F3n disponible" }), _jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Hay una actualizaci\u00F3n de la aplicaci\u00F3n disponible. Actualiza para obtener las \u00FAltimas mejoras y correcciones." }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", onClick: onUpdate, children: "Actualizar ahora" }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => setIsVisible(false), children: "M\u00E1s tarde" })] })] }), _jsx(Button, { size: "icon", variant: "ghost", className: "h-6 w-6", onClick: () => setIsVisible(false), children: _jsx(X, { className: "h-4 w-4" }) })] }) }) }));
}
