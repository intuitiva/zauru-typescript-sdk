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
    expirationDurationInSeconds: 60 * 60 * 24,
};
function getConfigValue(key) {
    if (!rawConfig[key]) {
        console.warn(`Valor de configuración vacío para: ${key}`);
    }
    return rawConfig[key];
}
export const config = new Proxy(rawConfig, {
    get: (_, key) => getConfigValue(key),
});
