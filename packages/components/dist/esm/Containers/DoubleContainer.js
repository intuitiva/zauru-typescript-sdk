import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const DoubleContainer = (props) => {
    const { title, description, className = "", children } = props;
    const getChildren = (index) => {
        if (children && Array.isArray(children) && children[index]) {
            return children[index];
        }
        if (children && index === 0) {
            return children;
        }
        return _jsx(_Fragment, {});
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { className: `mx-2 ${className}`, children: [title && (_jsx("h3", { className: "text-3xl font-bold leading-8 text-gray-900", children: title })), description && (_jsx("p", { className: "mt-1 text-md text-gray-600", children: description })), _jsxs("div", { className: "grid xl:grid-cols-3 md:grid-cols-1 gap-4", children: [_jsx("div", { className: "xl:col-span-2 md:col-span-1 mt-5", children: getChildren(0) }), _jsx("div", { className: "xl:col-span-1 md:col-span-1 mt-5", children: getChildren(1) })] })] }) }));
};
