import type { FetcherWithComponents } from "@remix-run/react";
import { useEffect } from "react";
import { showAlert } from "./index.js";

export const useValidateNotifications = (source: {
  fetcher?: FetcherWithComponents<any>;
  actionData?: any;
  loaderData?: any;
}) => {
  try {
    const { actionData, fetcher, loaderData } = source;

    useEffect(() => {
      if (loaderData?.title) {
        showAlert({
          description: loaderData?.description?.toString() ?? "",
          title: loaderData?.title,
          type: loaderData?.type as any,
        });
      }
    }, [loaderData]);

    useEffect(() => {
      if (fetcher?.data?.title && fetcher.state === "idle") {
        showAlert({
          description: fetcher.data?.description,
          title: fetcher.data?.title,
          type: fetcher.data?.type,
        });
      }
    }, [fetcher?.data, fetcher?.state]);

    useEffect(() => {
      if (actionData?.title) {
        showAlert({
          description: actionData?.description ?? "",
          title: actionData?.title,
          type: actionData?.type as any,
        });
      }
    }, [actionData]);

    return null;
  } catch (error) {
    console.log("Error in useValidateNotifications", error);
  }
};
