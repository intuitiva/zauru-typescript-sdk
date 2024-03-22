import { useFetcher } from "@remix-run/react";
import {
  AUTOMATIC_NUMBER_NAMES,
  automaticNumberFetchStart,
  automaticNumberFetchSuccess,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
import { showAlert } from "./index";

type ProfileType<T> = {
  data: T;
  loading: boolean;
};

export const useGetAutomaticNumber = <T>(
  AUTOMATIC_NUMBER_NAME: AUTOMATIC_NUMBER_NAMES
): ProfileType<T> => {
  const fetcher = useFetcher<any>();
  const dispatch = useAppDispatch();
  const objectData = useAppSelector(
    (state) => state.automaticNumbers[AUTOMATIC_NUMBER_NAME]
  );
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
        setData({ data: receivedData[AUTOMATIC_NUMBER_NAME], loading: false });
        dispatch(
          automaticNumberFetchSuccess({
            name: AUTOMATIC_NUMBER_NAME,
            data: receivedData[AUTOMATIC_NUMBER_NAME],
          })
        );
      }
    }
  }, [fetcher, dispatch, AUTOMATIC_NUMBER_NAME]);

  useEffect(() => {
    if (Object.keys(objectData?.data).length <= 0) {
      try {
        setData({ ...data, loading: true });
        dispatch(automaticNumberFetchStart(AUTOMATIC_NUMBER_NAME));
        fetcher.load(`/api/automaticNumbers?object=${AUTOMATIC_NUMBER_NAME}`);
      } catch (ex) {
        showAlert({
          type: "error",
          title: `Ocurrió un error al cargar el object de automatic numbers: ${AUTOMATIC_NUMBER_NAME}.`,
          description: "Error: " + ex,
        });
      }
    }
  }, []);

  return data;
};
