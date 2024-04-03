"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const HomeLayout = ({ title, description }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-cover bg-center h-screen", style: { backgroundImage: 'url("/wallpaper.webp")' }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-screen justify-center items-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-6xl md:text-7xl lg:text-8xl text-white font-bold mb-6 text-center", style: {
                        textShadow: "0.5px 0.5px 1px #000000",
                        WebkitTextStroke: "2px #000000",
                    }, children: title ?? (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Bienvenido, inicie sesi\u00F3n para continuar." }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl md:text-2xl lg:text-3xl text-white text-center max-w-md mb-12", style: {
                        textShadow: "0.5px 0.5px 1px #000000",
                        WebkitTextStroke: "1px #000000",
                    }, children: description ?? (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Web app, realizada en Zauru." }) })] }) }));
};
exports.HomeLayout = HomeLayout;
