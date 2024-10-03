import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { DropDownArrowSvgIcon, LogoutDropDownSvgIcon, MenuAlt4Svg, OpcionButtonSvgIcon, } from "@zauru-sdk/icons";
import { COLORS } from "./NavBar.utils.js";
import { Link, useNavigate } from "@remix-run/react";
const OptionsDropDownButton = ({ color, options, name, specialColor, }) => {
    const [showOptionsMenu, setShowOptionsMenu] = useState(true);
    return (_jsxs("div", { className: `${specialColor ? specialColor.bg700 : color.bg700} container text-white w-full sm:w-auto h-10 text-sm py-1 uppercase shadow hover:shadow-lg outline-none rounded-full focus:outline-none my-auto sm:my-0 sm:mr-1 mb-1 ease-linear transition-all duration-150`, children: [_jsxs("button", { onClick: () => setShowOptionsMenu(!showOptionsMenu), className: `relative flex items-center p-2 text-xs text-white ${color.bg700} active:${color.bg900} border border-transparent rounded-full uppercase focus:ring-opacity-40 focus:outline-none`, children: [name ?? _jsx(OpcionButtonSvgIcon, {}), _jsx(DropDownArrowSvgIcon, {})] }), _jsx("div", { className: "absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800", hidden: showOptionsMenu, onMouseLeave: () => setShowOptionsMenu(true), children: options.map((option, index) => (_jsx(React.Fragment, { children: option }, index))) })] }));
};
const NavItem = ({ name, link, icon, color, specialColor, childrens = [], }) => (_jsx("li", { className: "nav-item", children: childrens.length > 0 ? (_jsx(OptionsDropDownButton, { name: name, color: color, specialColor: specialColor, options: childrens.map((x, index) => (_jsx(Link, { to: x.link, className: `block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 dark:hover:text-white`, children: x.name }, index))) })) : (_jsx("div", { className: `${specialColor ? specialColor.bg700 : color.bg700} container text-white w-full sm:w-auto h-10 text-sm py-1 uppercase shadow hover:shadow-lg outline-none rounded-full focus:outline-none my-auto sm:my-0 sm:mr-1 mb-1 ease-linear transition-all duration-150`, children: _jsx(Link, { className: "px-3 flex items-center text-xs leading-snug text-white uppercase hover:opacity-75", to: link, prefetch: "none", children: _jsxs("div", { className: "mx-auto pt-2", children: [icon, _jsx("span", { children: name })] }) }) })) }));
export const NavBar = ({ title, loggedIn, items, selectedColor, version, }) => {
    const color = COLORS[selectedColor];
    const [NavBarOpen, setNavBarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentVersion, setCurrentVersion] = useState(version);
    const navigate = useNavigate();
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);
    useEffect(() => {
        if (version !== currentVersion) {
            setCurrentVersion(version);
        }
    }, [version, currentVersion]);
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    const refreshPage = () => {
        navigate(0);
    };
    const renderNavItems = (items) => (_jsx("div", { className: "flex flex-col lg:flex-row w-full", children: items.map((item, index) => {
            const specialColor = item.color
                ? COLORS[item.color]
                : undefined;
            return (_jsx(NavItem, { name: item.name, link: item.link, icon: item.icon, specialColor: specialColor, color: color, childrens: item.childrens?.map((x) => {
                    return { ...x };
                }) }, index));
        }) }));
    const options = (_jsxs(_Fragment, { children: [_jsx("ul", { className: "w-full lg:flex lg:items-center", children: renderNavItems(items.filter((item) => item.loggedIn === loggedIn)) }), _jsx("ul", { className: "sm:flex sm:flex-col lg:flex-row ml-auto", children: loggedIn && (_jsx(OptionsDropDownButton, { color: color, options: [
                        _jsx(Link, { className: `block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 dark:hover:text-white`, to: "/logout", prefetch: "none", children: _jsxs("div", { className: "mx-auto pt-2", children: [_jsx(LogoutDropDownSvgIcon, {}), _jsx("span", { children: "Cerrar sesi\u00F3n" })] }) }),
                        _jsx("button", { className: `block w-full text-left px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white`, onClick: toggleDarkMode, children: _jsxs("div", { className: "mx-auto pt-2", children: [isDarkMode ? "🌞" : "🌙", _jsx("span", { children: isDarkMode ? "Modo Claro" : "Modo Oscuro" })] }) }),
                    ] })) })] }));
    return (_jsx("nav", { className: `py-3 ${color.bg600} dark:bg-gray-800`, children: _jsxs("div", { className: "flex items-center justify-between ml-5 mr-5", children: [_jsxs("div", { className: "flex justify-between items-center w-full lg:w-auto", children: [_jsx(Link, { className: "text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white", to: "/home", prefetch: "none", children: _jsxs(_Fragment, { children: [_jsx("div", { className: "inline-block mr-2 mb-2 align-middle", children: _jsx("img", { className: "w-auto h-7", src: "/logo.png", alt: "logo-zauru" }) }), title] }) }), version !== currentVersion && (_jsx("button", { className: `ml-2 px-2 py-1 text-xs text-white ${color.bg700} rounded-full hover:${color.bg900} transition-colors duration-200`, onClick: refreshPage, children: "\uD83D\uDD04 Actualizar versi\u00F3n" })), _jsx("button", { className: `rounded lg:hidden focus:outline-none focus:ring focus:${color.ring600} focus:ring-opacity-50`, "aria-label": "Toggle mobile menu", type: "button", onClick: () => setNavBarOpen(!NavBarOpen), children: _jsx(MenuAlt4Svg, { open: NavBarOpen }) })] }), _jsx("div", { className: `lg:hidden fixed top-0 left-0 z-50 w-64 h-full ${color.bg700} dark:bg-gray-900 shadow-lg transform ${NavBarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out overflow-y-auto`, children: _jsx("div", { className: "p-4", children: options }) }), _jsx("div", { className: "hidden lg:flex lg:items-center w-full lg:w-auto", children: options })] }) }));
};
