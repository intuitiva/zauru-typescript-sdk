import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const DoubleFieldContainer = (props) => {
    const { children, className, alignCenter = true } = props;
    const getChildren = (index) => {
        if (children && Array.isArray(children) && children[index]) {
            return children[index];
        }
        if (children && index === 0) {
            return children;
        }
        return _jsx(_Fragment, {});
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { className: `grid md:grid-cols-2 sm:grid-cols-1 gap-4 ${className}`, style: alignCenter ? { alignItems: "center" } : {}, children: [_jsx("div", { className: "col-span-1", children: getChildren(0) }), _jsx("div", { className: "col-span-1", children: getChildren(1) })] }) }));
};
