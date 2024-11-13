import type { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useState } from "react";
import { showAlert } from "./index.js";

export const useValidateNotifications = (source: {
  fetcher?: FetcherWithComponents<any>;
  actionData?: any;
  loaderData?: any;
}) => {
  const { actionData, fetcher, loaderData } = source;
  const [alertShown, setAlertShown] = useState({});

  useEffect(() => {
    if (loaderData?.title && !alertShown[loaderData.title]) {
      showAlert({
        description: loaderData?.description?.toString() ?? "",
        title: loaderData?.title,
        type: loaderData?.type as any,
      });
      setAlertShown({ ...alertShown, [loaderData.title]: true });
    }
  }, [loaderData, alertShown]);

  useEffect(() => {
    if (
      fetcher?.data?.title &&
      fetcher.state === "idle" &&
      !alertShown[fetcher.data.title]
    ) {
      showAlert({
        description: fetcher.data?.description,
        title: fetcher.data?.title,
        type: fetcher.data?.type,
      });
      setAlertShown({ ...alertShown, [fetcher.data.title]: true });
    }
  }, [fetcher?.data, fetcher?.state, alertShown]);

  useEffect(() => {
    if (actionData?.title && !alertShown[actionData.title]) {
      showAlert({
        description: actionData?.description ?? "",
        title: actionData?.title,
        type: actionData?.type as any,
      });
      setAlertShown({ ...alertShown, [actionData.title]: true });
    }
  }, [actionData, alertShown]);

  return null;
};
