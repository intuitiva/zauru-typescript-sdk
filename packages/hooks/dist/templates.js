import { useFetcher } from "@remix-run/react";
import { templateFetchStart, templateFetchSuccess, useAppDispatch, useAppSelector, } from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
import { showAlert } from "src";
const useGetTemplateObject = (TEMPLATE_NAME, config = { online: false }) => {
    const fetcher = useFetcher();
    const dispatch = useAppDispatch();
    const objectData = useAppSelector((state) => state.templates[TEMPLATE_NAME]);
    const [data, setData] = useState({
        data: Object.keys(objectData?.data).length
            ? objectData?.data
            : {},
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
            const receivedData = fetcher.data;
            if (receivedData) {
                setData({ data: receivedData[TEMPLATE_NAME], loading: false });
                dispatch(templateFetchSuccess({
                    name: TEMPLATE_NAME,
                    data: receivedData[TEMPLATE_NAME],
                }));
            }
        }
    }, [fetcher, dispatch, TEMPLATE_NAME]);
    useEffect(() => {
        if (Object.keys(objectData?.data).length <= 0 || config?.online) {
            try {
                setData({ ...data, loading: true });
                dispatch(templateFetchStart(TEMPLATE_NAME));
                fetcher.load(`/api/templates?object=${TEMPLATE_NAME}`);
            }
            catch (ex) {
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
export const useGetReceptionTemplate = (config) => useGetTemplateObject("receptionTemplate", config);
