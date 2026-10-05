import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MainContainer } from "../Containers/MainContainer.js";
import { SubContainer } from "../Containers/SubContainer.js";
import { RouteTabNav } from "./RouteTabNav.js";
export const WebappSettingsChrome = ({ children, showEmployees = true, showRoles = true, showPermissions = true, basePath = "/configuracion", title = "Configuración", description = "Roles, empleados y permisos de esta aplicación.", }) => {
    const base = basePath.replace(/\/$/, "");
    return (_jsx(MainContainer, { children: _jsxs(SubContainer, { title: title, description: description, children: [_jsx(RouteTabNav, { ariaLabel: "Secciones de configuraci\u00F3n de accesos", selectedColor: "indigo", items: [
                        {
                            to: `${base}/empleados`,
                            label: "Empleados",
                            hide: !showEmployees,
                        },
                        {
                            to: `${base}/roles`,
                            label: "Roles",
                            hide: !showRoles,
                        },
                        {
                            to: `${base}/permisos`,
                            label: "Permisos",
                            hide: !showPermissions,
                        },
                    ] }), children] }) }));
};
