import { createSessionStorage } from "@remix-run/node";
import crypto from "crypto";
import { config } from "@zauru-sdk/config";
import axios from "axios";
const redisBaseURL = config.redisBaseURL;
const headers = {
    Authorization: `Bearer ${config.redisToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
};
const expiresToSeconds = (expires) => {
    return Math.floor((expires.getTime() - new Date().getTime()) / 1000);
};
export async function fetchWithRetries(url, config = {}, retries = 3, backoff = 200) {
    try {
        return await axios.request({
            url,
            ...config,
        });
    }
    catch (error) {
        if (retries > 0) {
            console.warn(`=> Axios request falló (${url}), reintentando en ${backoff}ms... (${retries} intentos restantes)`, `Error message: ${error instanceof Error ? error.message : String(error)}`);
            await new Promise((resolve) => setTimeout(resolve, backoff));
            return fetchWithRetries(url, config, retries - 1, backoff * 2);
        }
        else {
            console.error(`=> Axios request falló (${url}), no se pudo recuperar.`, `Error message: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }
}
// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
export function createUpstashSessionStorage({ cookie }) {
    return createSessionStorage({
        cookie,
        async createData(data, expires) {
            const id = `$${crypto.randomUUID()}`;
            await fetchWithRetries(`${redisBaseURL}/set/${id}?EX=${expires ? expiresToSeconds(expires) : 60 * 60 * 8}`, {
                method: "post",
                data: { data },
                headers,
            });
            return id;
        },
        async readData(id) {
            const response = await fetchWithRetries(`${redisBaseURL}/get/${id}`, {
                headers,
            });
            try {
                const { result } = response?.data;
                return JSON.parse(result)?.data;
            }
            catch (error) {
                console.error("Error al leer la sesión: ", error);
                return {};
            }
        },
        async updateData(id, data, expires) {
            await fetchWithRetries(`${redisBaseURL}/set/${id}?EX=${expires ? expiresToSeconds(expires) : 60 * 60 * 8}`, {
                method: "post",
                data: { data },
                headers,
            });
        },
        async deleteData(id) {
            await fetchWithRetries(`${redisBaseURL}/del/${id}`, {
                method: "post",
                headers,
            });
        },
    });
}
