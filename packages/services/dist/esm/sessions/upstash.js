import { createSessionStorage } from "@remix-run/node";
import crypto from "crypto";
import { config } from "@zauru-sdk/config";
import { httpUpstash } from "../zauru/httpUpstash.js";
export const MAX_AGE_SESSION_COOKIE = 60 * 60 * 16; //16 hours
const headers = {
    Authorization: `Bearer ${config.redisToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
};
export async function fetchWithRetriesAxios(url, config = {}, retries = 3, backoff = 200) {
    try {
        const response = await httpUpstash.request({ url, ...config });
        return response.data;
    }
    catch (error) {
        if (retries > 0) {
            console.warn(`=> Axios request falló (${url}), reintentando en ${backoff}ms... (${retries} intentos restantes)`, `Error: ${error}`);
            await new Promise((resolve) => setTimeout(resolve, backoff));
            return fetchWithRetriesAxios(url, config, retries - 1, backoff * 2);
        }
        else {
            throw error;
        }
    }
}
// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
export function createUpstashSessionStorage({ cookie }) {
    return createSessionStorage({
        cookie,
        async createData(data, expires) {
            try {
                const id = crypto.randomUUID();
                await fetchWithRetriesAxios(`${config.redisBaseURL}/set/${id}?EX=${MAX_AGE_SESSION_COOKIE}`, {
                    method: "post",
                    body: data,
                    headers,
                });
                return id;
            }
            catch (error) {
                console.error("Error al crear la sesión", error);
                return "";
            }
        },
        async readData(id) {
            try {
                const response = await fetchWithRetriesAxios(`${config.redisBaseURL}/get/${id}`, {
                    headers,
                });
                return response;
            }
            catch (error) {
                console.error("Error al leer la sesión", error);
                return null;
            }
        },
        async updateData(id, data, expires) {
            try {
                await fetchWithRetriesAxios(`${config.redisBaseURL}/set/${id}?EX=${MAX_AGE_SESSION_COOKIE}`, {
                    method: "post",
                    body: data,
                    headers,
                });
            }
            catch (error) {
                console.error("Error al actualizar la sesión", error);
            }
        },
        async deleteData(id) {
            try {
                await fetchWithRetriesAxios(`${config.redisBaseURL}/del/${id}`, {
                    method: "post",
                    headers,
                });
            }
            catch (error) {
                console.error("Error al eliminar la sesión", error);
            }
        },
    });
}
