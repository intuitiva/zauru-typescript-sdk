import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export const ProgressBar = (props) => {
    const { title, percent } = props;
    return (_jsx(_Fragment, { children: percent && (_jsxs(_Fragment, { children: [title && _jsx("div", { className: "mb-1 text-lg font-medium", children: title }), _jsx("div", { className: "w-full h-6 bg-gray-200 rounded-full", children: _jsx("div", { className: "h-6 bg-blue-600 rounded-full", style: { width: `${percent}%` } }) })] })) }));
};
