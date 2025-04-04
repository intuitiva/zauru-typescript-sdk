"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const rawConfig = {
    redisBaseURL: process.env.UPSTASH_REDIS_REST_URL || "",
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    oauthBaseURL: process.env.ZAURU_OAUTH_URL || "",
    zauruBaseURL: process.env.ZAURU_URL || "",
    oauthClientID: process.env.ZAURU_OAUTH_CLIENT_ID || "",
    graphqlAPIBaseURL: process.env.GRAPHQL_API_URL || "",
    zendeskJWTKey: process.env.ZENDESK_JWT_KEY || "",
    zendeskJWTSecret: process.env.ZENDESK_JWT_SECRET || "",
    zendeskChatKey: process.env.ZENDESK_CHAT_KEY || "",
    cmsAPIBaseURL: process.env.CMS_API_URL || "",
    expirationDurationInSeconds: process.env.EXPIRATION_TIME_IN_SECONDS || 60 * 60 * 24,
    cmsAPIToken: process.env.CMS_API_TOKEN || "",
};
function getConfigValue(key) {
    return rawConfig[key];
}
exports.config = new Proxy(rawConfig, {
    get: (_, key) => getConfigValue(key),
});
