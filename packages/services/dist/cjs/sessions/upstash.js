"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpstashSessionStorage = void 0;
const node_1 = require("@remix-run/node");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("@zauru-sdk/config");
const redisBaseURL = config_1.config.redisBaseURL;
const headers = {
    Authorization: `Bearer ${config_1.config.redisToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
};
const expiresToSeconds = (expires) => {
    return 3600 * 8;
};
// For more info check https://remix.run/docs/en/v1/api/remix#createsessionstorage
function createUpstashSessionStorage({ cookie }) {
    return (0, node_1.createSessionStorage)({
        cookie,
        async createData(data, expires) {
            const id = crypto_1.default.randomUUID();
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
                const { result } = (await response.json());
                return JSON.parse(result).data;
            }
            catch (error) {
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
exports.createUpstashSessionStorage = createUpstashSessionStorage;
