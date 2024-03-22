import { useFetcher } from "@remix-run/react";
import { setSessionValue, useAppDispatch, useAppSelector, } from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
import { showAlert } from "./index";
/**
 *
 * @param attribute
 * @returns
 */
export const useGetSessionAttribute = (name, type) => {
    const fetcher = useFetcher();
    const dispatch = useAppDispatch();
    const sessionData = useAppSelector((state) => state.session[name]);
    const [data, setData] = useState(sessionData);
    useEffect(() => {
        if (fetcher.data?.title) {
            showAlert({
                description: fetcher.data?.description,
                title: fetcher.data?.title,
                type: fetcher.data?.type,
            });
        }
    }, [fetcher.data]);
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data != null) {
            const receivedData = fetcher.data;
            if (receivedData) {
                setData(receivedData.data);
                dispatch(setSessionValue({
                    name: name,
                    data: receivedData.data,
                }));
            }
        }
    }, [fetcher, dispatch, name]);
    useEffect(() => {
        if (!sessionData) {
            try {
                fetcher.load(`/api/session?name=${name}&type=${type}`);
            }
            catch (ex) {
                showAlert({
                    type: "error",
                    title: `Ocurrió un error al cargar la variable de configuración: ${name}.`,
                    description: "Error: " + ex,
                });
            }
        }
    }, []);
    return data;
};
