import { jsx as _jsx } from "react/jsx-runtime";
//H3 Title Component
export const TitleH3 = ({ texto }) => {
    return (_jsx("div", { className: "py-1 ", children: _jsx("h3", { className: "text-xl leading-normal mt-0 mb-2 text-zinc-800", children: texto }) }));
};
