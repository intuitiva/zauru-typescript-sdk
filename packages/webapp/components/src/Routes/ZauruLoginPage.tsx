import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
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
      cleanLocalStorage(cleanLocalStorageArgs);
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
