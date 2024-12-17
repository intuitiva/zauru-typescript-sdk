import axios from "axios";
import chalk from "chalk";
import { config } from "@zauru-sdk/config";
const axiosInstance = axios.create({
    baseURL: `${config.cmsAPIBaseURL}`,
});
axiosInstance.interceptors.request.use(function (request) {
    // Do something before request is sent
    console.log("---------------- EJECUTANDO REQUEST CMS ----------------");
    //console.time(`${request.baseURL}${request.url}`);
    console.log(chalk.green(`${request.baseURL}${request.url}`));
    request.timeout = 200000;
    return request;
}, function (error) {
    console.log(chalk.red("---------------- ERROR CON REQUEST CMS ----------------"));
    console.log(`${error}`);
    // Do something with request error
    return Promise.reject(error);
});
// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Do something with response data
    //console.timeEnd(`${response.config.baseURL}${response.config.url}`);
    return response;
}, function (error) {
    console.log(chalk.red("---------------- ERROR CON REQUEST CMS ----------------"));
    console.log(`${error}`);
    // Do something with response error
    const { response } = error;
    const msgError = response
        ? `HTTP ${response.status} ${response.statusText} - URL: ${response?.config?.baseURL}${response?.config?.url} - ${JSON.stringify(response?.data)}`
        : error;
    console.log(chalk.red(`${msgError}`));
    throw new Error(msgError);
});
export const httpCMSAPI = axiosInstance;
