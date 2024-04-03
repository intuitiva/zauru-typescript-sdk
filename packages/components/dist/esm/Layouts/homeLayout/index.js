import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const HomeLayout = ({ title, description }) => {
    return (_jsx("div", { className: "bg-cover bg-center h-screen", style: { backgroundImage: 'url("/wallpaper.webp")' }, children: _jsxs("div", { className: "flex flex-col h-screen justify-center items-center", children: [_jsx("h1", { className: "text-6xl md:text-7xl lg:text-8xl text-white font-bold mb-6 text-center", style: {
                        textShadow: "0.5px 0.5px 1px #000000",
                        WebkitTextStroke: "2px #000000",
                    }, children: title ?? _jsx(_Fragment, { children: "Bienvenido, inicie sesi\u00F3n para continuar." }) }), _jsx("p", { className: "text-xl md:text-2xl lg:text-3xl text-white text-center max-w-md mb-12", style: {
                        textShadow: "0.5px 0.5px 1px #000000",
                        WebkitTextStroke: "1px #000000",
                    }, children: description ?? _jsx(_Fragment, { children: "Web app, realizada en Zauru." }) })] }) }));
};
