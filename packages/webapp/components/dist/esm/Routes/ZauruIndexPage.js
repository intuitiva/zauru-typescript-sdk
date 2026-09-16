import { jsx as _jsx } from "react/jsx-runtime";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { HomeLayout } from "../Layouts/homeLayout/index.js";
export function ZauruIndexPage({ title, description = "Inicie sesión para poder continuar.", color, }) {
    try {
        return _jsx(HomeLayout, { title: title, description: description, color: color });
    }
    catch (error) {
        return _jsx(ErrorLayout, { from: "/index.tsx", error: error, isRootLevel: false });
    }
}
