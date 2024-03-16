export type AxiosUtilsResponse<T> = {
    error?: boolean;
    msg?: string;
    userMsg?: string;
    data?: T;
};
/**
 * Handle web app table actions and return a response with a consistent format.
 * @param action A function that returns a Promise of type T.
 * @returns A Promise of AxiosUtilsResponse<T>.
 */
export declare function handlePossibleAxiosErrors<T>(action: () => Promise<T>): Promise<AxiosUtilsResponse<T>>;
declare const httpZauru: import("axios").AxiosInstance;
export default httpZauru;
