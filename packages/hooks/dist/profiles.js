import { useFetcher } from "@remix-run/react";
import { useAppDispatch, useAppSelector } from "./store";
import { useEffect, useState } from "react";
import { showAlert } from "~/components/Alerts/Alert";
import { profileFetchStart, profileFetchSuccess, } from "~/redux/slices/profile.slice";
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
