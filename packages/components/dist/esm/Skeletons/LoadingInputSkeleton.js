import { jsx as _jsx } from "react/jsx-runtime";
export const LoadingInputSkeleton = () => {
    return (_jsx("div", { className: "w-full h-full bg-gray-300 animate-pulse rounded", style: {
            maxWidth: "100%",
            height: "40px",
            boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.1)",
        } }));
};
