import { useEffect } from "react";
import { showAlert } from "src";
export const useValidateNotifications = (source) => {
    const { actionData, fetcher, loaderData } = source;
    useEffect(() => {
        if (loaderData?.title) {
            showAlert({
                description: loaderData?.description?.toString() ?? "",
                title: loaderData?.title,
                type: loaderData?.type,
            });
        }
    }, [loaderData]);
    useEffect(() => {
        if (fetcher?.data?.title) {
            showAlert({
                description: fetcher.data?.description,
                title: fetcher.data?.title,
                type: fetcher.data?.type,
            });
        }
    }, [fetcher?.data]);
    useEffect(() => {
        if (actionData?.title) {
            showAlert({
                description: actionData?.description ?? "",
                title: actionData?.title,
                type: actionData?.type,
            });
        }
    }, [actionData]);
    return null;
};
