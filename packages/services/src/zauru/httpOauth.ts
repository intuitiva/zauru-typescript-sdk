import axios from "axios";
import chalk from "chalk";
import { config } from "@zauru-sdk/config";

const axiosInstance = axios.create({
  baseURL: `${config.oauthBaseURL}`,
});

axiosInstance.interceptors.request.use(
  function (request) {
    // Do something before request is sent
    const baseName = `${request.baseURL}${request.url}`;
    console.log(chalk.green(baseName));
    request.timeout = 200000;
    (request as any).metadata = { startTime: Date.now() };

    if (config.debugHTTP) {
      console.log(
        chalk.cyan(`[DEBUG] REQUEST METHOD: ${request.method?.toUpperCase()}`),
      );
      console.log(
        chalk.cyan("[DEBUG] REQUEST BODY:"),
        JSON.stringify(request.data, null, 2),
      );
    }

    return request;
  },
  function (error) {
    console.log(
      chalk.red("---------------- ERROR CON REQUEST ----------------"),
    );
    console.log(`${error}`);
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (config.debugHTTP) {
      const elapsed =
        Date.now() -
        ((response.config as any).metadata?.startTime ?? Date.now());
      console.log(chalk.cyan(`[DEBUG] RESPONSE TIME: ${elapsed}ms`));
      console.log(
        chalk.cyan("[DEBUG] RESPONSE DATA:"),
        JSON.stringify(response.data, null, 2),
      );
    }
    return response;
  },
  function (error) {
    console.log(
      chalk.red("---------------- ERROR CON REQUEST ----------------"),
    );
    console.log(`${error}`);
    // Do something with response error
    const { response } = error;
    if (config.debugHTTP) {
      const elapsed =
        Date.now() - (error.config?.metadata?.startTime ?? Date.now());
      console.log(chalk.cyan(`[DEBUG] RESPONSE TIME: ${elapsed}ms`));
    }
    const msgError = response
      ? `HTTP ${response.status} ${response.statusText} - URL: ${
          response?.config?.baseURL
        }${response?.config?.url} - ${JSON.stringify(response?.data)}`
      : error;
    console.log(chalk.red(`${msgError}`));
    throw new Error(msgError);
  },
);

export const httpOauth = axiosInstance;
