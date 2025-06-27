import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export const Container = (props) => {
    const { title, description, children, className = "", rightContent } = props;
    const titleInfo = (_jsxs(_Fragment, { children: [title && (_jsx("h3", { className: "text-3xl font-bold leading-8 text-gray-900", children: title })), description && (_jsx("p", { className: "mt-1 text-md text-gray-600", children: description }))] }));
    return (_jsx(_Fragment, { children: _jsxs("div", { className: `mx-2 ${className}`, children: [rightContent && (_jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4", children: [_jsx("div", { className: "max-w-3xl", children: titleInfo }), _jsx("div", { className: "flex-shrink-0", children: rightContent })] })), !rightContent && titleInfo, _jsx("div", { className: "mt-5 space-y-5", children: children })] }) }));
};
