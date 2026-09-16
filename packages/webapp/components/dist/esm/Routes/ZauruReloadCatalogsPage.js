import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { LoadingWindow } from "../Skeletons/LoadingWindow.js";
export function ZauruReloadCatalogsPage({ items, }) {
    try {
        const [isClient, setIsClient] = useState(false);
        useEffect(() => {
            setIsClient(true);
        }, []);
        if (!isClient) {
            return _jsx(LoadingWindow, {});
        }
        const loading = items.some((item) => item.loading);
        return (_jsx(LoadingWindow, { description: loading
                ? "Cargando catálogos..."
                : "Catálogos cargados correctamente ✅", loadingItems: items }));
    }
    catch (error) {
        return (_jsx(ErrorLayout, { from: "/reload-catalogs", error: error, isRootLevel: false }));
    }
}
