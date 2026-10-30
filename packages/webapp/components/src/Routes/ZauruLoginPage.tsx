import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  hasZauruOauthReauthCookie,
  isOauthUserinfoUnauthorizedError,
} from "@zauru-sdk/common";
import { useValidateNotifications } from "@zauru-sdk/hooks";
import {
  cleanLocalStorage,
  profileFetchSuccess,
  useAppDispatch,
} from "@zauru-sdk/redux";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { HomeLayout } from "../Layouts/homeLayout/index.js";
import { LoadingWindow } from "../Skeletons/LoadingWindow.js";

export type ZauruHomeLayoutColor = "green" | "blue" | "red" | "purple" | "yellow";

export type ZauruLoginPageProps = {
  cleanLocalStorageArgs?: Parameters<typeof cleanLocalStorage>[0];
  color?: ZauruHomeLayoutColor;
};

export function ZauruLoginPage({
  cleanLocalStorageArgs,
  color,
}: ZauruLoginPageProps) {
  try {
    const fetcher = useFetcher<any>();
    const dispatch = useAppDispatch();
    const [isClient, setIsClient] = useState(false);

    useValidateNotifications({ fetcher });

    useEffect(() => {
      if (fetcher.data?.employeeProfile) {
        dispatch(
          profileFetchSuccess({
            name: "agencyProfile",
            data: fetcher.data.agencyProfile,
          }),
        );
        dispatch(
          profileFetchSuccess({
            name: "employeeProfile",
            data: fetcher.data.employeeProfile,
          }),
        );
        dispatch(
          profileFetchSuccess({
            name: "userProfile",
            data: fetcher.data.userProfile,
          }),
        );
        dispatch(
          profileFetchSuccess({
            name: "oauthProfile",
            data: fetcher.data.oauthProfile,
          }),
        );

        fetcher.submit(
          {
            action: "redirect",
            cookie: fetcher.data?.cookie,
          },
          { method: "post" },
        );
      }
    }, [fetcher.data]);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      const alreadyReauthed = hasZauruOauthReauthCookie(document.cookie);
      if (
        fetcher.data?.error &&
        !alreadyReauthed &&
        isOauthUserinfoUnauthorizedError(
          String(fetcher.data?.description ?? ""),
        )
      ) {
        window.location.replace("/logout?reauth=1");
      }
    }, [fetcher.data]);

    useEffect(() => {
      // A reauthentication refreshes the same user's expired server session.
      // Keep every local draft/queue intact; normal logins still clean storage
      // and honor the app-specific whitelist.
      if (!hasZauruOauthReauthCookie(document.cookie)) {
        cleanLocalStorage(cleanLocalStorageArgs);
      }
      fetcher.submit({ action: "login" }, { method: "post" });
    }, []);

    if (!isClient) {
      return <LoadingWindow />;
    }

    return (
      <HomeLayout
        loading
        color={color}
        title={
          fetcher.data?.title ? "Error al inciar sesión!" : "Iniciando sesión...."
        }
        description={
          fetcher.data?.description ??
          "Cargando (Perfil zauru, perfil oauth, agencia, membresías, webapptables)..."
        }
      />
    );
  } catch (error: any) {
    console.log(error);
    return (
      <ErrorLayout from="/login/index.tsx" error={error} isRootLevel={false} />
    );
  }
}
