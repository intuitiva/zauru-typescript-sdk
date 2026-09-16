import { jsx as _jsx } from "react/jsx-runtime";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { showAlert, useIsOnline } from "@zauru-sdk/hooks";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { HomeLayout } from "../Layouts/homeLayout/index.js";
export function ZauruLogoutPage({ requireOnline = true, beforeLogout, color, }) {
    try {
        const fetcher = useFetcher();
        const navigate = useNavigate();
        const isOnline = useIsOnline();
        useEffect(() => {
            if (beforeLogout?.() === false) {
                return;
            }
            if (requireOnline && !isOnline) {
                showAlert({
                    title: "No es posible cerrar sesión",
                    description: "No hay conexión a internet",
                    type: "error",
                });
                navigate("/home");
                return;
            }
            fetcher.submit({ action: "logout" }, { method: "post" });
        }, []);
        return (_jsx(HomeLayout, { color: color, title: "Cerrando sesi\u00F3n", description: "Espere mientras se cierra su sesi\u00F3n..." }));
    }
    catch (error) {
        return (_jsx(ErrorLayout, { from: "/logout/index.tsx", error: error, isRootLevel: false }));
    }
}
