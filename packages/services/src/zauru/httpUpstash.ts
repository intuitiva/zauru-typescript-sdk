import { config } from "@zauru-sdk/config";
import axios from "axios";
import http from "node:http";
import https from "node:https";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

export const httpUpstash = axios.create({
  baseURL: `${config.redisBaseURL}`,
  httpAgent,
  httpsAgent,
  timeout: 5000,
});
