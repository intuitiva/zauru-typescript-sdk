import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useMemo, useRef, useState, } from "react";
import { DropDownArrowSvgIcon, ExitSvg, LogoutDropDownSvgIcon, MenuAlt4Svg, OpcionButtonSvgIcon, } from "@zauru-sdk/icons";
import { COLORS } from "./NavBar.utils.js";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useAppSelector } from "@zauru-sdk/redux";
const itemColor = (item, fallback) => item.selectedColor ? COLORS[item.selectedColor] : fallback;
const visibleChildrenOf = (item) => (item.childrens ?? []).filter((child) => child.hide !== true);
const pathMatches = (pathname, link) => {
    if (!link)
        return false;
    return pathname === link || pathname.startsWith(`${link}/`);
};
const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
const desktopTriggerClass = (color, isActive) => `inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-4 text-xs font-medium uppercase leading-none text-white transition-opacity duration-150 motion-reduce:transition-none ${isActive ? color.bg900 : color.bg700} hover:opacity-90 ${focusRing}`;
const mobileRowClass = (isActive) => `flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-white transition-colors duration-150 motion-reduce:transition-none hover:bg-white/10 ${focusRing} ${isActive ? "bg-white/15" : ""}`;
const dropdownItemClass = (danger) => `flex min-h-11 w-full cursor-pointer items-center gap-2 px-4 text-sm transition-colors duration-150 motion-reduce:transition-none ${danger
    ? "text-red-700 hover:bg-red-50"
    : "text-gray-700 hover:bg-gray-100"}`;
const NotificationBadge = ({ value }) => (_jsx("span", { className: "absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white", children: value }));
const useNotificationBadge = (item) => {
    const relevantState = useAppSelector((state) => item.reduxNotificationBadge
        ? item.reduxNotificationBadge(state)
        : undefined);
    const [notificationBadge, setNotificationBadge] = useState();
    useEffect(() => {
        setNotificationBadge(relevantState);
    }, [relevantState]);
    return notificationBadge;
};
const Chevron = ({ open }) => (_jsx("span", { className: `inline-flex shrink-0 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`, "aria-hidden": "true", children: _jsx(DropDownArrowSvgIcon, {}) }));
const NavLinkItem = ({ item, color, layout, onNavigate, }) => {
    const location = useLocation();
    const isActive = pathMatches(location.pathname, item.link);
    const notificationBadge = useNotificationBadge(item);
    const palette = itemColor(item, color);
    if (layout === "mobile") {
        return (_jsx("li", { children: _jsxs(Link, { to: item.link, "aria-current": isActive ? "page" : undefined, onClick: onNavigate, className: `${mobileRowClass(isActive)} relative`, children: [item.icon, _jsx("span", { className: "flex-1", children: item.name }), notificationBadge !== undefined && (_jsx(NotificationBadge, { value: notificationBadge }))] }) }));
    }
    return (_jsx("li", { className: "relative", children: _jsxs(Link, { to: item.link, "aria-current": isActive ? "page" : undefined, className: `${desktopTriggerClass(palette, isActive)} relative`, children: [item.icon, _jsx("span", { children: item.name }), notificationBadge !== undefined && (_jsx(NotificationBadge, { value: notificationBadge }))] }) }));
};
const NavItemGroup = ({ item, color, layout, open, onToggle, onNavigate, }) => {
    const location = useLocation();
    const children = visibleChildrenOf(item);
    const childActive = children.some((child) => pathMatches(location.pathname, child.link));
    const palette = itemColor(item, color);
    const menuId = useId();
    if (children.length === 0) {
        return null;
    }
    if (layout === "mobile") {
        return (_jsxs("li", { children: [_jsxs("button", { type: "button", "aria-expanded": open, "aria-controls": menuId, onClick: onToggle, className: mobileRowClass(childActive), children: [item.icon, _jsx("span", { className: "flex-1", children: item.name }), _jsx(Chevron, { open: open })] }), _jsx("ul", { id: menuId, hidden: !open, className: "mt-1 ml-3 space-y-1 border-l border-white/20 pl-2", children: children.map((child) => {
                        const isActive = pathMatches(location.pathname, child.link);
                        return (_jsx("li", { children: _jsxs(Link, { to: child.link, "aria-current": isActive ? "page" : undefined, onClick: onNavigate, className: mobileRowClass(isActive), children: [child.icon, _jsx("span", { children: child.name })] }) }, child.link));
                    }) })] }));
    }
    return (_jsxs("li", { className: "relative", children: [_jsxs("button", { type: "button", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": menuId, onClick: onToggle, className: desktopTriggerClass(palette, childActive), children: [item.icon, _jsx("span", { children: item.name }), _jsx(Chevron, { open: open })] }), _jsx("div", { id: menuId, role: "menu", hidden: !open, className: "absolute left-0 z-30 mt-2 min-w-[14rem] overflow-hidden rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5", children: children.map((child) => (_jsxs(Link, { role: "menuitem", to: child.link, onClick: onNavigate, className: dropdownItemClass(), children: [child.icon, _jsx("span", { children: child.name })] }, child.link))) })] }));
};
const UserMenu = ({ color, layout, open, onToggle, onNavigate, entries, }) => {
    const menuId = useId();
    if (entries.length === 0) {
        return null;
    }
    if (layout === "mobile") {
        return (_jsxs("div", { className: "mt-4 border-t border-white/20 pt-4", children: [_jsx("p", { className: "px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-white/70", children: "Cuenta" }), _jsx("ul", { className: "space-y-1", children: entries.map((entry) => (_jsx("li", { children: entry.to ? (_jsxs(Link, { to: entry.to, onClick: onNavigate, className: `${mobileRowClass(false)} [&_svg]:!text-current ${entry.danger ? "text-red-100 hover:bg-red-500/20" : ""}`, children: [entry.icon, _jsx("span", { children: entry.label })] })) : (_jsxs("button", { type: "button", onClick: () => {
                                entry.onClick?.();
                                onNavigate?.();
                            }, className: `${mobileRowClass(false)} [&_svg]:!text-current`, children: [entry.icon, _jsx("span", { children: entry.label })] })) }, entry.key))) })] }));
    }
    return (_jsxs("div", { className: "relative ml-auto", children: [_jsxs("button", { type: "button", "aria-label": "Men\u00FA de usuario", "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": menuId, onClick: onToggle, className: `${desktopTriggerClass(color, open)} p-0 px-3`, children: [_jsx(OpcionButtonSvgIcon, {}), _jsx(Chevron, { open: open })] }), _jsx("div", { id: menuId, role: "menu", hidden: !open, className: "absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5", children: entries.map((entry) => entry.to ? (_jsxs(Link, { role: "menuitem", to: entry.to, onClick: onNavigate, className: dropdownItemClass(entry.danger), children: [entry.icon, _jsx("span", { children: entry.label })] }, entry.key)) : (_jsxs("button", { type: "button", role: "menuitem", onClick: () => {
                        entry.onClick?.();
                        onNavigate?.();
                    }, className: dropdownItemClass(entry.danger), children: [entry.icon, _jsx("span", { children: entry.label })] }, entry.key))) })] }));
};
const NavItems = ({ items, color, layout, openMenuId, setOpenMenuId, onNavigate, }) => (_jsx("ul", { className: layout === "mobile"
        ? "flex flex-col gap-1"
        : "flex flex-wrap items-center gap-1", children: items.map((item, index) => {
        const children = visibleChildrenOf(item);
        const menuKey = `${item.name}-${index}`;
        if (children.length > 0) {
            return (_jsx(NavItemGroup, { item: item, color: color, layout: layout, open: openMenuId === menuKey, onToggle: () => setOpenMenuId(openMenuId === menuKey ? null : menuKey), onNavigate: onNavigate }, menuKey));
        }
        return (_jsx(NavLinkItem, { item: item, color: color, layout: layout, onNavigate: onNavigate }, menuKey));
    }) }));
export const NavBar = ({ title, loggedIn, items, selectedColor, version, reloadCatalogsOption, settingsOption, showDarkModeToggle = false, }) => {
    const color = COLORS[selectedColor];
    const [navOpen, setNavOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(version);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const desktopMenuRef = useRef(null);
    const mobileDrawerRef = useRef(null);
    const wasNavOpen = useRef(false);
    const mobileNavId = useId();
    const visibleItems = useMemo(() => items.filter((item) => item.loggedIn === loggedIn && item.hide !== true), [items, loggedIn]);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);
    useEffect(() => {
        if (version !== currentVersion) {
            setCurrentVersion(version);
        }
    }, [version, currentVersion]);
    useEffect(() => {
        setNavOpen(false);
        setOpenMenuId(null);
    }, [location.pathname]);
    useEffect(() => {
        if (!navOpen)
            return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [navOpen]);
    useEffect(() => {
        const drawer = mobileDrawerRef.current;
        if (!drawer)
            return;
        if (navOpen) {
            drawer.removeAttribute("inert");
        }
        else {
            drawer.setAttribute("inert", "");
        }
    }, [navOpen]);
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key !== "Escape")
                return;
            setNavOpen(false);
            setOpenMenuId(null);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);
    useEffect(() => {
        const onPointerDown = (event) => {
            if (desktopMenuRef.current &&
                !desktopMenuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);
    const closeMenus = () => {
        setNavOpen(false);
        setOpenMenuId(null);
    };
    const userEntries = useMemo(() => {
        if (!loggedIn)
            return [];
        const entries = [];
        if (settingsOption) {
            entries.push({
                key: "configuracion",
                label: "Configuración",
                to: "/configuracion",
                icon: (_jsxs("svg", { className: "h-5 w-5 shrink-0", width: "24", height: "24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", viewBox: "0 0 24 24", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: [_jsx("path", { d: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" }), _jsx("path", { d: "M19.4 13a7.7 7.7 0 0 0 .06-2l2.1-1.64-2-3.46-2.55 1a7.7 7.7 0 0 0-1.73-1L14.7 2H9.3l-.58 2.9a7.7 7.7 0 0 0-1.73 1l-2.55-1-2 3.46L4.54 11a7.7 7.7 0 0 0 0 2l-2.1 1.64 2 3.46 2.55-1a7.7 7.7 0 0 0 1.73 1L9.3 22h5.4l.58-2.9a7.7 7.7 0 0 0 1.73-1l2.55 1 2-3.46Z" })] })),
            });
        }
        if (reloadCatalogsOption) {
            entries.push({
                key: "recargar-catalogos",
                label: "Recargar catálogos",
                to: "/reload-catalogs",
                icon: (_jsxs("svg", { className: "h-5 w-5 shrink-0", width: "24", height: "24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", viewBox: "0 0 24 24", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: [_jsx("path", { d: "M20.5 8c-1.392-3.179-4.823-5-8.522-5C7.299 3 3.453 6.552 3 11.1" }), _jsx("path", { d: "M16.489 8.4h3.97A.54.54 0 0 0 21 7.86V3.9M3.5 16c1.392 3.179 4.823 5 8.522 5 4.679 0 8.525-3.552 8.978-8.1" }), _jsx("path", { d: "M7.511 15.6h-3.97a.54.54 0 0 0-.541.54v3.96" })] })),
            });
        }
        if (showDarkModeToggle) {
            entries.push({
                key: "dark-mode-toggle",
                label: isDarkMode ? "Modo claro" : "Modo oscuro",
                onClick: () => setIsDarkMode((value) => !value),
            });
        }
        entries.push({
            key: "cerrar-sesion",
            label: "Cerrar sesión",
            to: "/logout",
            icon: _jsx(LogoutDropDownSvgIcon, {}),
            danger: true,
        });
        return entries;
    }, [
        loggedIn,
        settingsOption,
        reloadCatalogsOption,
        showDarkModeToggle,
        isDarkMode,
    ]);
    useEffect(() => {
        const justOpened = navOpen && !wasNavOpen.current;
        wasNavOpen.current = navOpen;
        if (!justOpened)
            return;
        const activeGroup = visibleItems.find((item) => visibleChildrenOf(item).some((child) => pathMatches(location.pathname, child.link)));
        if (!activeGroup)
            return;
        const index = visibleItems.indexOf(activeGroup);
        setOpenMenuId(`${activeGroup.name}-${index}`);
    }, [navOpen, visibleItems, location.pathname]);
    const renderCluster = (layout) => (_jsxs(_Fragment, { children: [_jsx(NavItems, { items: visibleItems, color: color, layout: layout, openMenuId: openMenuId, setOpenMenuId: setOpenMenuId, onNavigate: closeMenus }), _jsx(UserMenu, { color: color, layout: layout, open: openMenuId === "user", onToggle: () => setOpenMenuId(openMenuId === "user" ? null : "user"), onNavigate: closeMenus, entries: userEntries })] }));
    return (_jsx("nav", { className: `py-2 ${color.bg600}`, "aria-label": "Principal", children: _jsxs("div", { className: "flex items-center justify-between gap-3 px-4 sm:px-5", children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-center justify-between gap-2 lg:w-auto lg:flex-none", children: [_jsxs(Link, { className: `inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-2 truncate text-sm font-bold uppercase text-white ${focusRing}`, to: "/home", children: [_jsx("img", { className: "h-7 w-auto shrink-0", src: "/logo.png", alt: "" }), _jsx("span", { className: "truncate", children: title })] }), version !== currentVersion && (_jsx("button", { type: "button", className: `shrink-0 cursor-pointer rounded-full px-3 py-2 text-xs text-white ${color.bg700} hover:opacity-90 ${focusRing}`, onClick: () => navigate(0), children: "Actualizar versi\u00F3n" })), _jsx("button", { type: "button", className: `inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-white lg:hidden ${focusRing} ${navOpen ? "pointer-events-none invisible" : ""}`, "aria-label": "Abrir men\u00FA", "aria-expanded": navOpen, "aria-controls": mobileNavId, "aria-hidden": navOpen, tabIndex: navOpen ? -1 : undefined, onClick: () => setNavOpen(true), children: _jsx(MenuAlt4Svg, { open: false }) })] }), navOpen && (_jsx("button", { type: "button", "aria-label": "Cerrar men\u00FA", className: "fixed inset-0 z-40 cursor-pointer bg-black/40 lg:hidden", onClick: closeMenus })), _jsxs("div", { ref: mobileDrawerRef, id: mobileNavId, "aria-hidden": !navOpen, className: `fixed inset-y-0 left-0 z-50 flex w-[min(20rem,86vw)] flex-col ${color.bg700} shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none lg:hidden ${navOpen ? "translate-x-0" : "pointer-events-none -translate-x-full"}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-white/15 px-4 py-3", children: [_jsx("p", { className: "truncate text-sm font-bold uppercase text-white", children: title }), _jsx("button", { type: "button", className: `inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-white ${focusRing}`, "aria-label": "Cerrar men\u00FA", onClick: closeMenus, children: _jsx(ExitSvg, {}) })] }), _jsx("div", { className: "flex-1 overflow-y-auto overscroll-contain p-3", children: renderCluster("mobile") })] }), _jsx("div", { ref: desktopMenuRef, className: "hidden min-w-0 flex-1 items-center gap-2 lg:flex", children: renderCluster("desktop") })] }) }));
};
