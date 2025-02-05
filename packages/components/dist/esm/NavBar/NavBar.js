import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { DropDownArrowSvgIcon, LogoutDropDownSvgIcon, MenuAlt4Svg, OpcionButtonSvgIcon, } from "@zauru-sdk/icons";
import { COLORS } from "./NavBar.utils.js";
import { Link, useNavigate, useLocation } from "@remix-run/react";
import { useAppSelector } from "@zauru-sdk/redux";
const OptionsDropDownButton = ({ color, options, name }) => {
    const [showOptionsMenu, setShowOptionsMenu] = useState(true);
    return (_jsx("div", { className: "nav-item ml-auto", children: _jsx("div", { className: "flex justify-center", children: _jsxs("div", { className: "relative inline-block", children: [_jsxs("button", { onClick: () => setShowOptionsMenu(!showOptionsMenu), className: `relative flex items-center p-2 text-xs text-white ${color.bg700} active:${color.bg900} border border-transparent rounded-full uppercase focus:ring-opacity-40 focus:outline-none`, children: [name ?? _jsx(OpcionButtonSvgIcon, {}), _jsx(DropDownArrowSvgIcon, {})] }), _jsx("div", { className: "absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800", hidden: showOptionsMenu, onMouseLeave: () => setShowOptionsMenu(true), children: options.map((option, index) => (_jsx(React.Fragment, { children: option }, index))) })] }) }) }));
};
const NavItem = ({ name, link, icon, selectedColor, childrens = [], reduxNotificationBadge, }) => {
    const location = useLocation();
    const isActive = location.pathname === link;
    const specialColor = selectedColor
        ? COLORS[selectedColor]
        : COLORS["slate"];
    // Selecciona solo la parte del estado relevante
    const relevantState = useAppSelector((state) => reduxNotificationBadge ? reduxNotificationBadge(state) : undefined);
    const [notificationBadge, setNotificationBadge] = useState();
    useEffect(() => {
        setNotificationBadge(relevantState);
    }, [relevantState]);
    // Si este NavItem tiene elementos hijos, renderiza el botón desplegable:
    if (childrens.length > 0) {
        return (_jsx(OptionsDropDownButton, { name: name, color: specialColor, options: childrens.map((x, index) => (_jsx(Link, { to: x.link, className: `block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 dark:hover:text-white`, children: x.name }, index))) }));
    }
    // Si NO tiene elementos hijos, se renderiza como un ítem simple:
    return (_jsx("li", { className: "nav-item relative", children: _jsx("div", { 
            // Si está activo, usamos color de fondo más oscuro (bg900)
            // De lo contrario, usamos el color normal (bg700)
            className: `${isActive ? specialColor.bg900 : specialColor.bg700} container text-white w-full sm:w-auto h-10 text-sm py-1 uppercase shadow hover:shadow-lg outline-none rounded-full focus:outline-none my-auto sm:my-0 sm:mr-1 mb-1 ease-linear transition-all duration-150`, children: _jsxs(Link, { className: "px-3 flex items-center text-xs leading-snug text-white uppercase hover:opacity-75 relative", to: link, children: [_jsxs("div", { className: "mx-auto pt-2", children: [icon, _jsx("span", { children: name })] }), notificationBadge !== undefined && (_jsx("span", { className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center w-5 h-5", children: notificationBadge }))] }) }) }));
};
export const NavBar = ({ title, loggedIn, items, selectedColor, version, }) => {
    const color = COLORS[selectedColor];
    const [NavBarOpen, setNavBarOpen] = useState(false);
    const [currentVersion, setCurrentVersion] = useState(version);
    const navigate = useNavigate();
    useEffect(() => {
        if (version !== currentVersion) {
            setCurrentVersion(version);
        }
    }, [version, currentVersion]);
    const refreshPage = () => {
        navigate(0);
    };
    const renderNavItems = (items) => (_jsx("div", { className: "flex flex-col lg:flex-row w-full", children: items.map((item, index) => {
            return (_jsx(NavItem, { name: item.name, link: item.link, icon: item.icon, selectedColor: item.selectedColor, color: color, loggedIn: item.loggedIn, reduxNotificationBadge: item.reduxNotificationBadge, childrens: item.childrens?.map((x) => {
                    return { ...x };
                }) }, index));
        }) }));
    const options = (_jsxs(_Fragment, { children: [_jsx("ul", { className: "w-full lg:flex lg:items-center", children: renderNavItems(items.filter((item) => item.loggedIn === loggedIn)) }), _jsx("ul", { className: "sm:flex sm:flex-col lg:flex-row ml-auto", children: loggedIn && (_jsx(OptionsDropDownButton, { color: color, options: [
                        _jsx(Link, { className: `block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 dark:hover:text-white`, to: "/logout", children: _jsxs("div", { className: "mx-auto pt-2", children: [_jsx(LogoutDropDownSvgIcon, {}), _jsx("span", { children: "Cerrar sesi\u00F3n" })] }) }, "cerrar-sesion"),
                    ] })) })] }));
    return (_jsx("nav", { className: `py-3 ${color.bg600}`, children: _jsxs("div", { className: "flex items-center justify-between ml-5 mr-5", children: [_jsxs("div", { className: "flex justify-between items-center w-full lg:w-auto", children: [_jsxs(Link, { className: "text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white", to: "/home", children: [_jsx("div", { className: "inline-block mr-2 mb-2 align-middle", children: _jsx("img", { className: "w-auto h-7", src: "/logo.png", alt: "logo-zauru" }) }), title] }), version !== currentVersion && (_jsx("button", { className: `ml-2 px-2 py-1 text-xs text-white ${color.bg700} rounded-full hover:${color.bg900} transition-colors duration-200`, onClick: refreshPage, children: "\uD83D\uDD04 Actualizar versi\u00F3n" })), _jsx("button", { className: `rounded lg:hidden focus:outline-none focus:ring focus:${color.ring600} focus:ring-opacity-50`, "aria-label": "Toggle mobile menu", type: "button", onClick: () => setNavBarOpen(!NavBarOpen), children: _jsx(MenuAlt4Svg, { open: NavBarOpen }) })] }), _jsx("div", { className: `lg:hidden fixed top-0 left-0 z-50 w-64 h-full ${color.bg700} dark:bg-gray-900 shadow-lg transform ${NavBarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out overflow-y-auto`, children: _jsx("div", { className: "p-4", children: options }) }), _jsx("div", { className: "hidden lg:flex lg:items-center w-full lg:w-auto", children: options })] }) }));
};
