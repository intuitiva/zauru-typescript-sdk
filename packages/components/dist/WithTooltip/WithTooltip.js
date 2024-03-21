import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const WithTooltip = (props) => {
    const { children, text } = props;
    return (_jsx(_Fragment, { children: _jsxs("span", { className: "group relative", children: [children, _jsx("span", { className: "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-white opacity-0 transition z-50 before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-[''] group-hover:opacity-100 before:z-50", children: text })] }) }));
};
