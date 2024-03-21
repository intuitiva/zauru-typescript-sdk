import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
//Component to show all information in an array
export const LabelArray = ({ info }) => {
    return (_jsx("div", { className: "divide-y divide-gray-100", children: info?.map((x) => {
            return (_jsxs("div", { className: "my-1 pt-2", children: [_jsxs("p", { className: "inline font-bold text-lg", children: [x?.label, ": "] }), _jsx("p", { className: "inline text-lg", children: x?.value })] }, x?.label));
        }) }));
};
