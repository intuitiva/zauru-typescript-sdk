import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { LoadingInputSkeleton } from "src";
import ConnectionState from "src/ConnectionState/ConnectionState";
const COLORS = {
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    cyan: "bg-cyan-500",
    slate: "bg-slate-500",
    green: "bg-green-500",
    red: "bg-red-500",
    sky: "bg-sky-500",
};
export const Footer = ({ href, selectedColor, showConnection = false, }) => {
    const [client, setIsClient] = useState(false);
    const color = COLORS[selectedColor];
    useEffect(() => {
        setIsClient(true);
    }, []);
    if (!client) {
        return _jsx(LoadingInputSkeleton, {});
    }
    return (_jsx("footer", { className: `inset-x-0 bottom-0 px-2 py-[20px] ${color}`, children: _jsxs("div", { className: "px-4 mx-auto flex flex-wrap items-center justify-center", children: [_jsxs("p", { className: "text-white text-[1.2rem]", children: [`Creado en `, " ", _jsx("a", { href: href, children: "Zauru" }), " ", `con ❤️ ${new Date().getFullYear()} v.3.2`] }), showConnection && (_jsx("div", { className: "ml-5", children: _jsx(ConnectionState, {}) }))] }) }));
};
