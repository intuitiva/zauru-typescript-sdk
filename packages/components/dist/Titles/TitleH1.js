import { jsx as _jsx } from "react/jsx-runtime";
//H1 Title Component
export const TitleH1 = ({ texto }) => {
    return (_jsx("div", { className: "mb-1", children: _jsx("h1", { className: "text-4xl font-bold leading-normal mt-0 mb-2 text-zinc-800", children: texto }) }));
};
