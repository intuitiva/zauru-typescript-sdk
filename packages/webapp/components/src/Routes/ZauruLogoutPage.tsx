import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { showAlert, useIsOnline } from "@zauru-sdk/hooks";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { HomeLayout } from "../Layouts/homeLayout/index.js";
import type { ZauruHomeLayoutColor } from "./ZauruLoginPage.js";

export type ZauruLogoutPageProps = {
  requireOnline?: boolean;
  beforeLogout?: () => boolean | void;
  color?: ZauruHomeLayoutColor;
};

export function ZauruLogoutPage({
  requireOnline = true,
  beforeLogout,
  color,
}: ZauruLogoutPageProps) {
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

    return (
      <HomeLayout
        color={color}
        title="Cerrando sesión"
        description="Espere mientras se cierra su sesión..."
      />
    );
  } catch (error: any) {
    return (
      <ErrorLayout from="/logout/index.tsx" error={error} isRootLevel={false} />
    );
  }
}
