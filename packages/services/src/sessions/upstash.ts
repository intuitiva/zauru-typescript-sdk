import { createSessionStorage } from "@remix-run/node";
import crypto from "crypto";
import { config } from "@zauru-sdk/config";

const redisBaseURL = config.redisBaseURL;

const headers = {
  Authorization: `Bearer ${config.redisToken}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

const expiresToSeconds = (expires: Date) => {
  return Math.floor((expires.getTime() - new Date().getTime()) / 1000);
};

export async function fetchWithRetries(
  url: string,
  config = {},
  retries = 3,
  backoff = 200
) {
  try {
    return await fetch(url, config);
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `=> Node Fetch request falló (${url}), reintentando en ${backoff}ms... (${retries} intentos restantes)`,
        `Error message: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetries(url, config, retries - 1, backoff * 2);
    } else {
      console.error(
        `=> Node Fetch request falló (${url}), no se pudo recuperar.`,
        `Error message: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  }
}

// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
export function createUpstashSessionStorage({ cookie }: any) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const id: string = crypto.randomUUID();
      await fetchWithRetries(
        `${redisBaseURL}/set/${id}?EX=${
          expires ? expiresToSeconds(expires) : 60 * 60 * 8
        }`,
        {
          method: "post",
          body: JSON.stringify({ data }),
          headers,
        }
      );
      return id;
    },
    async readData(id) {
      const response = await fetch(`${redisBaseURL}/get/${id}`, {
        headers,
      });
      try {
        const { result } = (await response.json()) as any;
        return JSON.parse(result)?.data;
      } catch (error) {
        console.error("Error al leer la sesión: ", error);
        return {};
      }
    },
    async updateData(id, data, expires) {
      await fetchWithRetries(
        `${redisBaseURL}/set/${id}?EX=${
          expires ? expiresToSeconds(expires) : 60 * 60 * 8
        }`,
        {
          method: "post",
          body: JSON.stringify({ data }),
          headers,
        }
      );
    },
    async deleteData(id) {
      await fetchWithRetries(`${redisBaseURL}/del/${id}`, {
        method: "post",
        headers,
      });
    },
  });
}
