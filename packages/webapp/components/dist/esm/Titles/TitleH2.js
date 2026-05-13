import { jsx as _jsx } from "react/jsx-runtime";
//H2 Title Component
export const TitleH2 = ({ texto }) => {
    return (_jsx("div", { className: "py-1 ", children: _jsx("h2", { className: "text-2xl font-bold leading-normal mt-0 mb-2 text-zinc-800", children: texto }) }));
};
