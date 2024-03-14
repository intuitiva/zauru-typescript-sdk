import { createSessionStorage } from "@remix-run/node";
import crypto from "crypto";
import { config } from "@zauru-sdk/config";

const redisBaseURL = config.redisBaseURL;

const headers = {
  Authorization: `Bearer ${config.redisToken}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

const expiresToSeconds = (expires: Date | undefined) => {
  return 3600 * 8;
};

// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
export function createUpstashSessionStorage({ cookie }: any) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const id: string = crypto.randomUUID();
      await fetch(`${redisBaseURL}/set/${id}?EX=${expiresToSeconds(expires)}`, {
        method: "post",
        body: JSON.stringify({ data }),
        headers,
      });
      return id;
    },
    async readData(id) {
      const response = await fetch(`${redisBaseURL}/get/${id}`, {
        headers,
      });
      try {
        const { result } = await response.json();
        return JSON.parse(result).data;
      } catch (error) {
        return null;
      }
    },
    async updateData(id, data, expires) {
      await fetch(`${redisBaseURL}/set/${id}?EX=${expiresToSeconds(expires)}`, {
        method: "post",
        body: JSON.stringify({ data }),
        headers,
      });
    },
    async deleteData(id) {
      await fetch(`${redisBaseURL}/del/${id}`, {
        method: "post",
        headers,
      });
    },
  });
}
