import axios from "axios";
import chalk from "chalk";
import { config } from "@zauru-sdk/config";
const axiosInstance = axios.create({
    baseURL: `${config.zauruBaseURL}`,
});
axiosInstance.interceptors.request.use(function (request) {
    // Do something before request is sent
    const baseName = `${request.baseURL}${request.url}`;
    console.log(chalk.green(baseName));
    request.timeout = 200000;
    request.metadata = { startTime: Date.now() };
    if (config.debugHTTP) {
        console.log(chalk.cyan(`[DEBUG] REQUEST METHOD: ${request.method?.toUpperCase()}`));
        let _bodyType;
        let _bodyLog;
        if (typeof FormData !== "undefined" && request.data instanceof FormData) {
            _bodyType = "multipart/form-data";
            const _entries = {};
            request.data.forEach((value, key) => {
                _entries[key] =
                    value instanceof Blob
                        ? `[Blob/File: ${value.name ?? "unnamed"}]`
                        : value;
            });
            _bodyLog = JSON.stringify(_entries, null, 2);
        }
        else if (typeof URLSearchParams !== "undefined" &&
            request.data instanceof URLSearchParams) {
            _bodyType = "application/x-www-form-urlencoded";
            _bodyLog = request.data.toString();
        }
        else {
            _bodyType = "application/json";
            _bodyLog = JSON.stringify(request.data, null, 2);
        }
        console.log(chalk.cyan(`[DEBUG] REQUEST CONTENT TYPE: ${_bodyType}`));
        console.log(chalk.cyan("[DEBUG] REQUEST BODY:"), _bodyLog);
    }
    return request;
}, function (error) {
    console.log(chalk.red("---------------- ERROR CON REQUEST (REQUEST INTERCEPTOR) ----------------"));
    console.log(`${error}`);
    // Do something with request error
    return Promise.reject(error);
});
// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Do something with response data
    if (config.debugHTTP) {
        const elapsed = Date.now() -
            (response.config.metadata?.startTime ?? Date.now());
        console.log(chalk.cyan(`[DEBUG] RESPONSE TIME: ${elapsed}ms`));
        console.log(chalk.cyan("[DEBUG] RESPONSE DATA:"), JSON.stringify(response.data, null, 2));
    }
    return response;
}, function (error) {
    console.log(chalk.red("---------------- ERROR CON REQUEST (RESPONSE INTERCEPTOR) ----------------"));
    // Do something with response error
    const { response } = error;
    if (config.debugHTTP) {
        const elapsed = Date.now() - (error.config?.metadata?.startTime ?? Date.now());
        console.log(chalk.cyan(`[DEBUG] RESPONSE TIME: ${elapsed}ms`));
    }
    const msgError = response
        ? `HTTP ${response.status} ${response.statusText} - URL: ${response?.config?.baseURL}${response?.config?.url} - ${JSON.stringify(response?.data)}`
        : error;
    console.error(chalk.red(`${msgError}`));
    throw new Error(msgError);
});
export const httpZauru = axiosInstance;
