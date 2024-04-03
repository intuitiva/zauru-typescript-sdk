"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("@zauru-sdk/config");
const axiosInstance = axios_1.default.create({
    baseURL: `${config_1.config.oauthBaseURL}`,
});
axiosInstance.interceptors.request.use(function (request) {
    // Do something before request is sent
    console.log("---------------- EJECUTANDO REQUEST ----------------");
    //console.time(`${request.baseURL}${request.url}`);
    console.log(chalk_1.default.green(`${request.baseURL}${request.url}`));
    request.timeout = 120000;
    return request;
}, function (error) {
    console.log(chalk_1.default.red("---------------- ERROR CON REQUEST ----------------"));
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
    console.log(chalk_1.default.red("---------------- ERROR CON REQUEST ----------------"));
    console.log(`${error}`);
    // Do something with response error
    const { response } = error;
    const msgError = response
        ? `HTTP ${response.status} ${response.statusText} - URL: ${response?.config?.baseURL}${response?.config?.url} - ${JSON.stringify(response?.data)}`
        : error;
    console.log(chalk_1.default.red(`${msgError}`));
    throw new Error(msgError);
});
const httpOauth = axiosInstance;
exports.default = httpOauth;
