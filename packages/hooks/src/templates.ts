import { useFetcher } from "@remix-run/react";
import {
  TEMPLATE_NAMES,
  templateFetchStart,
  templateFetchSuccess,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
import { showAlert } from "./index.js";

type ProfileType<T> = {
  data: T;
  loading: boolean;
};

type ConfigProps = {
  online?: boolean;
};

const useGetTemplateObject = <T>(
  TEMPLATE_NAME: TEMPLATE_NAMES,
  config: ConfigProps = { online: false }
): ProfileType<T> => {
  const fetcher = useFetcher<any>();
  const dispatch = useAppDispatch();
  const objectData = useAppSelector((state) => state.templates[TEMPLATE_NAME]);
  const [data, setData] = useState<ProfileType<T>>({
    data: Object.keys(objectData?.data).length
      ? (objectData?.data as T)
      : ({} as T),
    loading: objectData.loading,
  });

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
      const receivedData = fetcher.data as { [key: string]: T };
      if (receivedData) {
        setData({ data: receivedData[TEMPLATE_NAME], loading: false });
        dispatch(
          templateFetchSuccess({
            name: TEMPLATE_NAME,
            data: receivedData[TEMPLATE_NAME],
          })
        );
      }
    }
  }, [fetcher, dispatch, TEMPLATE_NAME]);

  useEffect(() => {
    if (Object.keys(objectData?.data).length <= 0 || config?.online) {
      try {
        setData({ ...data, loading: true });
        dispatch(templateFetchStart(TEMPLATE_NAME));
        fetcher.load(`/api/templates?object=${TEMPLATE_NAME}`);
      } catch (ex) {
        showAlert({
          type: "error",
          title: `Ocurrió un error al cargar el object de templates: ${TEMPLATE_NAME}.`,
          description: "Error: " + ex,
        });
      }
    }
  }, []);

  return data;
};

export const useGetReceptionTemplate = (
  config?: ConfigProps
): {
  loading: boolean;
  data: string;
} => useGetTemplateObject<string>("receptionTemplate", config);
