import { createSessionStorage } from "@remix-run/node";
import crypto from "crypto";
import { config } from "@zauru-sdk/config";
const redisBaseURL = config.redisBaseURL;
const headers = {
    Authorization: `Bearer ${config.redisToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
};
//Le quité la expiración porque era muy corta para recepciones,
//antes se definía algo así: await fetch(`${redisBaseURL}/set/${id}?EX=${expiresToSeconds(expires)}`
//Estaba en el createData y en el updateData
// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
export function createUpstashSessionStorage({ cookie }) {
    return createSessionStorage({
        cookie,
        async createData(data, expires) {
            const id = crypto.randomUUID();
            await fetch(`${redisBaseURL}/set/${id}`, {
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
                const { result } = (await response.json());
                return JSON.parse(result).data;
            }
            catch (error) {
                return null;
            }
        },
        async updateData(id, data, expires) {
            await fetch(`${redisBaseURL}/set/${id}`, {
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
