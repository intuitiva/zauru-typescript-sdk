"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetEmployeeProfile = exports.useGetOauthProfile = exports.useGetUserProfile = exports.useGetAgencyProfile = void 0;
const react_1 = require("@remix-run/react");
const react_2 = require("react");
const index_js_1 = require("./index.js");
const redux_1 = require("@zauru-sdk/redux");
const useGetProfile = (PROFILE_NAME) => {
    try {
        const fetcher = (0, react_1.useFetcher)();
        const dispatch = (0, redux_1.useAppDispatch)();
        const profileData = (0, redux_1.useAppSelector)((state) => state.profiles[PROFILE_NAME]);
        const [data, setData] = (0, react_2.useState)({
            data: Object.keys(profileData?.data)?.length
                ? profileData?.data
                : {},
            loading: profileData?.loading,
        });
        (0, react_2.useEffect)(() => {
            if (fetcher.data?.title) {
                (0, index_js_1.showAlert)({
                    description: fetcher.data?.description?.toString(),
                    title: fetcher.data?.title?.toString(),
                    type: fetcher.data?.type?.toString(),
                });
            }
        }, [fetcher.data]);
        (0, react_2.useEffect)(() => {
            if (fetcher.state === "idle" && fetcher.data != null) {
                const receivedData = fetcher.data;
                if (receivedData) {
                    setData({ data: receivedData[PROFILE_NAME], loading: false });
                    dispatch((0, redux_1.profileFetchSuccess)({
                        name: PROFILE_NAME,
                        data: receivedData[PROFILE_NAME],
                    }));
                }
            }
        }, [fetcher, dispatch, PROFILE_NAME]);
        (0, react_2.useEffect)(() => {
            if (Object.keys(profileData?.data).length <= 0) {
                try {
                    setData({ ...data, loading: true });
                    dispatch((0, redux_1.profileFetchStart)(PROFILE_NAME));
                    fetcher.load(`/api/profiles?profile=${PROFILE_NAME}`);
                }
                catch (ex) {
                    (0, index_js_1.showAlert)({
                        type: "error",
                        title: `Ocurrió un error al cargar el perfil: ${PROFILE_NAME}.`,
                        description: "Error: " + ex,
                    });
                }
            }
        }, []);
        return data;
    }
    catch (ex) {
        (0, index_js_1.showAlert)({
            type: "error",
            title: `Ocurrió un error al cargar el perfil: ${PROFILE_NAME}.`,
            description: "Error: " + ex,
        });
        return { data: {}, loading: false };
    }
};
const useGetAgencyProfile = () => useGetProfile("agencyProfile");
exports.useGetAgencyProfile = useGetAgencyProfile;
const useGetUserProfile = () => useGetProfile("userProfile");
exports.useGetUserProfile = useGetUserProfile;
const useGetOauthProfile = () => useGetProfile("oauthProfile");
exports.useGetOauthProfile = useGetOauthProfile;
const useGetEmployeeProfile = () => useGetProfile("employeeProfile");
exports.useGetEmployeeProfile = useGetEmployeeProfile;
