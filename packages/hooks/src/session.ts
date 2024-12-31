import { useFetcher } from "@remix-run/react";
import {
  setSessionValue,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
import { showAlert } from "./index.js";

export type SERVER_CONFIG_TYPES =
  | "sessionAttribute"
  | "environment"
  | "sessionVariable";

/**
 *
 * @param attribute
 * @returns
 */
export const useGetSessionAttribute = (
  name: string,
  type: SERVER_CONFIG_TYPES
): string => {
  const fetcher = useFetcher<any>();
  const dispatch = useAppDispatch();
  const sessionData = useAppSelector((state) => state.session[name]);
  const [data, setData] = useState<string>(sessionData);

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
      try {
        const receivedData = fetcher.data as { data: string };
        if (receivedData) {
          setData(receivedData.data);
          dispatch(
            setSessionValue({
              name: name,
              data: receivedData.data,
            })
          );
        }
      } catch (ex) {
        showAlert({
          type: "error",
          title: `Ocurrió un error al cargar la variable de configuración: ${name}.`,
          description: "Error: " + ex,
        });
      }
    }
  }, [fetcher, dispatch, name]);

  useEffect(() => {
    if (!sessionData) {
      try {
        fetcher.load(`/api/session?name=${name}&type=${type}`);
      } catch (ex) {
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
