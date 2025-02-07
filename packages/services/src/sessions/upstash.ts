import { createSessionStorage } from "@remix-run/node";
import crypto from "crypto";
import { config } from "@zauru-sdk/config";

export const MAX_AGE_SESSION_COOKIE = 60 * 60 * 16; //16 hours

const redisBaseURL = config.redisBaseURL;

const headers = {
  Authorization: `Bearer ${config.redisToken}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function fetchWithRetries(
  url: string,
  options = {},
  retries = 3,
  backoff = 200
) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      console.warn(
        `Fetch falló, reintentando en ${backoff}ms... (${retries} intentos restantes)`
      );
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetries(url, options, retries - 1, backoff * 2);
    } else {
      throw err;
    }
  }
}

// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
export function createUpstashSessionStorage({ cookie }: any) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      try {
        const id: string = crypto.randomUUID();
        await fetchWithRetries(
          `${redisBaseURL}/set/${id}?EX=${MAX_AGE_SESSION_COOKIE}`,
          {
            method: "post",
            body: JSON.stringify({ data }),
            headers,
          }
        );
        return id;
      } catch (error) {
        console.error("Error al crear la sesión", error);
        return "";
      }
    },
    async readData(id) {
      try {
        const response = await fetchWithRetries(`${redisBaseURL}/get/${id}`, {
          headers,
        });
        const { result } = (await response.json()) as any;
        return JSON.parse(result).data;
      } catch (error) {
        console.error("Error al leer la sesión", error);
        return null;
      }
    },
    async updateData(id, data, expires) {
      try {
        await fetchWithRetries(
          `${redisBaseURL}/set/${id}?EX=${MAX_AGE_SESSION_COOKIE}`,
          {
            method: "post",
            body: JSON.stringify({ data }),
            headers,
          }
        );
      } catch (error) {
        console.error("Error al actualizar la sesión", error);
      }
    },
    async deleteData(id) {
      try {
        await fetchWithRetries(`${redisBaseURL}/del/${id}`, {
          method: "post",
          headers,
        });
      } catch (error) {
        console.error("Error al eliminar la sesión", error);
      }
    },
  });
}
