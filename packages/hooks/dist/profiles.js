import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { showAlert } from "./index";
import { profileFetchStart, profileFetchSuccess, useAppDispatch, useAppSelector, } from "@zauru-sdk/redux";
const useGetProfile = (PROFILE_NAME) => {
    const fetcher = useFetcher();
    const dispatch = useAppDispatch();
    const profileData = useAppSelector((state) => state.profiles[PROFILE_NAME]);
    const [data, setData] = useState({
        data: Object.keys(profileData?.data)?.length
            ? profileData?.data
            : {},
        loading: profileData?.loading,
    });
    useEffect(() => {
        if (fetcher.data?.title) {
            showAlert({
                description: fetcher.data?.description?.toString(),
                title: fetcher.data?.title?.toString(),
                type: fetcher.data?.type?.toString(),
            });
        }
    }, [fetcher.data]);
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data != null) {
            const receivedData = fetcher.data;
            if (receivedData) {
                setData({ data: receivedData[PROFILE_NAME], loading: false });
                dispatch(profileFetchSuccess({
                    name: PROFILE_NAME,
                    data: receivedData[PROFILE_NAME],
                }));
            }
        }
    }, [fetcher, dispatch, PROFILE_NAME]);
    useEffect(() => {
        if (Object.keys(profileData?.data).length <= 0) {
            try {
                setData({ ...data, loading: true });
                dispatch(profileFetchStart(PROFILE_NAME));
                fetcher.load(`/api/profiles?profile=${PROFILE_NAME}`);
            }
            catch (ex) {
                showAlert({
                    type: "error",
                    title: `Ocurrió un error al cargar el perfil: ${PROFILE_NAME}.`,
                    description: "Error: " + ex,
                });
            }
        }
    }, []);
    return data;
};
export const useGetAgencyProfile = () => useGetProfile("agencyProfile");
export const useGetUserProfile = () => useGetProfile("userProfile");
export const useGetOauthProfile = () => useGetProfile("oauthProfile");
export const useGetEmployeeProfile = () => useGetProfile("employeeProfile");
