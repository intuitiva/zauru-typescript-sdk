import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { showAlert } from "src";
import type {
  AgencyGraphQL,
  EmployeeGraphQL,
  OauthProfile,
  ProfileResponse,
} from "@zauru-sdk/types";
import {
  PROFILE_NAMES,
  profileFetchStart,
  profileFetchSuccess,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";

type ProfileType<T> = {
  data: T;
  loading: boolean;
};

const useGetProfile = <T>(PROFILE_NAME: PROFILE_NAMES): ProfileType<T> => {
  const fetcher = useFetcher();
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.profiles[PROFILE_NAME]);
  const [data, setData] = useState<ProfileType<T>>({
    data: Object.keys(profileData?.data)?.length
      ? (profileData?.data as T)
      : ({} as T),
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
      const receivedData = fetcher.data as { [key: string]: T };
      if (receivedData) {
        setData({ data: receivedData[PROFILE_NAME], loading: false });
        dispatch(
          profileFetchSuccess({
            name: PROFILE_NAME,
            data: receivedData[PROFILE_NAME],
          })
        );
      }
    }
  }, [fetcher, dispatch, PROFILE_NAME]);

  useEffect(() => {
    if (Object.keys(profileData?.data).length <= 0) {
      try {
        setData({ ...data, loading: true });
        dispatch(profileFetchStart(PROFILE_NAME));
        fetcher.load(`/api/profiles?profile=${PROFILE_NAME}`);
      } catch (ex) {
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

export const useGetAgencyProfile = (): {
  loading: boolean;
  data: AgencyGraphQL;
} => useGetProfile<AgencyGraphQL>("agencyProfile");

export const useGetUserProfile = (): {
  loading: boolean;
  data: ProfileResponse;
} => useGetProfile<ProfileResponse>("userProfile");

export const useGetOauthProfile = (): {
  loading: boolean;
  data: OauthProfile;
} => useGetProfile<OauthProfile>("oauthProfile");

export const useGetEmployeeProfile = (): {
  loading: boolean;
  data: EmployeeGraphQL;
} => useGetProfile<EmployeeGraphQL>("employeeProfile");
