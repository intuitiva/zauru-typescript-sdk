"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const icons_1 = require("@zauru-sdk/icons");
const NavBar_utils_js_1 = require("./NavBar.utils.js");
const react_2 = require("@remix-run/react");
const DropDownLinkButton = ({ text, path, icon, buttonHover, }) => ((0, jsx_runtime_1.jsx)(react_2.Link, { className: `block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 ${buttonHover ?? ""} dark:hover:bg-gray-700 dark:hover:text-white`, to: path, prefetch: "none", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto pt-2", children: [icon, (0, jsx_runtime_1.jsx)("span", { children: text })] }) }));
const OptionsDropDownButton = ({ color, options, name }) => {
    const [showOptionsMenu, setShowOptionsMenu] = (0, react_1.useState)(true);
    return ((0, jsx_runtime_1.jsx)("div", { className: "nav-item ml-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowOptionsMenu(!showOptionsMenu), className: `relative flex items-center p-2 text-xs text-white ${color.bg700} active:${color.bg900} border border-transparent rounded-full uppercase focus:ring-opacity-40 focus:outline-none`, children: [name ?? (0, jsx_runtime_1.jsx)(icons_1.OpcionButtonSvgIcon, {}), (0, jsx_runtime_1.jsx)(icons_1.DropDownArrowSvgIcon, {})] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800", hidden: showOptionsMenu, onMouseLeave: () => setShowOptionsMenu(true), children: options.map((option) => option) })] }) }) }));
};
const NavItem = ({ name, link, icon, color, specialColor, childrens = [], }) => ((0, jsx_runtime_1.jsx)("li", { className: "nav-item", children: childrens.length > 0 ? ((0, jsx_runtime_1.jsx)(OptionsDropDownButton, { name: name, color: color, options: childrens.map((x, index) => ((0, jsx_runtime_1.jsx)(DropDownLinkButton, { text: x.name, path: x.link, buttonHover: "hover:bg-red-100" }, index))) })) : ((0, jsx_runtime_1.jsx)("div", { className: `${specialColor ? specialColor.bg700 : color.bg700} container text-white w-full sm:w-auto h-10 text-sm py-1 uppercase shadow hover:shadow-lg outline-none rounded-full focus:outline-none my-auto sm:my-0 sm:mr-1 mb-1 ease-linear transition-all duration-150 `, children: (0, jsx_runtime_1.jsx)(react_2.Link, { className: "px-3 flex items-center text-xs leading-snug text-white uppercase hover:opacity-75", to: link, prefetch: "none", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto pt-2", children: [icon, (0, jsx_runtime_1.jsx)("span", { children: name })] }) }) })) }));
const NavBar = ({ title, loggedIn, items, selectedColor, }) => {
    const color = NavBar_utils_js_1.COLORS[selectedColor];
    const [NavBarOpen, setNavBarOpen] = (0, react_1.useState)(false);
    const renderNavItems = (items) => ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col lg:flex-row w-full", children: items.map((item, index) => {
            const specialColor = item.color
                ? NavBar_utils_js_1.COLORS[item.color]
                : undefined;
            return ((0, jsx_runtime_1.jsx)(NavItem, { name: item.name, link: item.link, icon: item.icon, specialColor: specialColor, color: color, childrens: item.childrens?.map((x) => {
                    return { ...x };
                }) }, index));
        }) }));
    const options = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("ul", { className: "w-full lg:flex lg:items-center", children: renderNavItems(items.filter((item) => item.loggedIn === loggedIn)) }), (0, jsx_runtime_1.jsx)("ul", { className: "sm:flex sm:flex-col lg:flex-row ml-auto", children: loggedIn && ((0, jsx_runtime_1.jsx)(OptionsDropDownButton, { color: color, options: [
                        (0, jsx_runtime_1.jsx)(DropDownLinkButton, { text: "Cerrar Sesi\u00F3n", path: "/logout", icon: (0, jsx_runtime_1.jsx)(icons_1.LogoutDropDownSvgIcon, {}), buttonHover: "hover:bg-red-100" }, 0),
                    ] })) })] }));
    return ((0, jsx_runtime_1.jsx)("nav", { className: `py-3 ${color.bg600}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between ml-5 mr-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between w-full lg:w-auto", children: [(0, jsx_runtime_1.jsx)(react_2.Link, { className: "text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white", to: "/home", prefetch: "none", children: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-block mr-2 mb-2 align-middle", children: (0, jsx_runtime_1.jsx)("img", { className: "w-auto h-7", src: "/logo.png", alt: "logo-zauru" }) }), title] }) }), (0, jsx_runtime_1.jsx)("button", { className: `rounded lg:hidden focus:outline-none focus:ring focus:${color.ring600} focus:ring-opacity-50`, "aria-label": "Toggle mobile menu", type: "button", onClick: () => setNavBarOpen(!NavBarOpen), children: (0, jsx_runtime_1.jsx)(icons_1.MenuAlt4Svg, { open: NavBarOpen }) })] }), (0, jsx_runtime_1.jsx)("div", { className: `lg:hidden fixed top-0 left-0 z-50 w-64 h-full ${color.bg700} shadow-lg transform ${NavBarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out overflow-y-auto`, children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: options }) }), (0, jsx_runtime_1.jsx)("div", { className: "hidden lg:flex lg:items-center w-full lg:w-auto", children: options })] }) }));
};
exports.NavBar = NavBar;
