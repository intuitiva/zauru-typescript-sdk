import { AUTOMATIC_NUMBER_NAMES } from "@zauru-sdk/redux";
type ProfileType<T> = {
    data: T;
    loading: boolean;
};
export declare const useGetAutomaticNumber: <T>(AUTOMATIC_NUMBER_NAME: AUTOMATIC_NUMBER_NAMES) => ProfileType<T>;
export {};
