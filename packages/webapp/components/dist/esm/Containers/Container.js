import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export const Container = (props) => {
    const { title, description, children, className = "", rightContent, collapsible = false, defaultOpen = true, } = props;
    const titleInfo = (_jsxs(_Fragment, { children: [title && (_jsx("h3", { className: "text-3xl font-bold leading-8 text-gray-900", children: title })), description && (_jsx("p", { className: "mt-1 text-md text-gray-600", children: description }))] }));
    const header = rightContent ? (_jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4", children: [_jsx("div", { className: "max-w-3xl", children: titleInfo }), _jsx("div", { className: "flex-shrink-0", children: rightContent })] })) : (titleInfo);
    const body = _jsx("div", { className: "mt-5 space-y-5", children: children });
    if (collapsible) {
        return (_jsx("div", { className: `mx-2 ${className}`, children: _jsxs("details", { className: "group", ...(defaultOpen ? { open: true } : {}), children: [_jsxs("summary", { className: "flex cursor-pointer list-none items-start gap-3 rounded-md py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden", children: [_jsx("span", { "aria-hidden": "true", className: "mt-2 inline-block h-0 w-0 shrink-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-gray-700 transition-transform group-open:rotate-90" }), _jsx("div", { className: "min-w-0 flex-1", children: header })] }), body] }) }));
    }
    return (_jsxs("div", { className: `mx-2 ${className}`, children: [header, body] }));
};
