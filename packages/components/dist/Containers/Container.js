import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export const Container = (props) => {
    const { title, description, children, className = "", rightContent } = props;
    const titleInfo = (_jsxs(_Fragment, { children: [title && (_jsx("h3", { className: "text-3xl font-bold leading-8 text-gray-900", children: title })), description && (_jsx("p", { className: "mt-1 text-md text-gray-600", children: description }))] }));
    return (_jsx(_Fragment, { children: _jsxs("div", { className: `mx-2 ${className}`, children: [rightContent && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("div", { children: titleInfo }), _jsx("div", { children: rightContent })] })), !rightContent && titleInfo, _jsx("div", { className: "mt-5 space-y-5", children: children })] }) }));
};
