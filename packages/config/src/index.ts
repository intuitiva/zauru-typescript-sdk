const env = process.env.APP_ENV || process.env.NODE_ENV || "development";

const rawConfig = {
  redisBaseURL: process.env.UPSTASH_REDIS_REST_URL || "",
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  oauthBaseURL:
    env === "production"
      ? process.env.ZAURU_OAUTH_URL || process.env.VITE_ZAURU_OAUTH_URL
      : env === "staging"
        ? process.env.ZAURU_OAUTH_URL_STAGING ||
          process.env.VITE_ZAURU_OAUTH_URL_STAGING
        : process.env.ZAURU_OAUTH_URL_DEV ||
          process.env.VITE_ZAURU_OAUTH_URL_DEV,
  zauruBaseURL:
    env === "production"
      ? process.env.ZAURU_URL || process.env.VITE_ZAURU_URL
      : env === "staging"
        ? process.env.ZAURU_URL_STAGING || process.env.VITE_ZAURU_URL_STAGING
        : process.env.ZAURU_URL_DEV || process.env.VITE_ZAURU_URL_DEV,
  oauthClientID:
    env === "production"
      ? process.env.ZAURU_OAUTH_CLIENT_ID ||
        process.env.VITE_ZAURU_OAUTH_CLIENT_ID
      : env === "staging"
        ? process.env.ZAURU_OAUTH_CLIENT_ID_STAGING ||
          process.env.VITE_ZAURU_OAUTH_CLIENT_ID_STAGING
        : process.env.ZAURU_OAUTH_CLIENT_ID_DEV ||
          process.env.VITE_ZAURU_OAUTH_CLIENT_ID_DEV,
  graphqlAPIBaseURL:
    env === "production"
      ? process.env.GRAPHQL_API_URL || process.env.VITE_GRAPHQL_API_URL
      : env === "staging"
        ? process.env.GRAPHQL_API_URL_STAGING ||
          process.env.VITE_GRAPHQL_API_URL_STAGING
        : process.env.GRAPHQL_API_URL_DEV ||
          process.env.VITE_GRAPHQL_API_URL_DEV,
  cmsAPIBaseURL:
    env === "production"
      ? process.env.CMS_API_URL || process.env.VITE_CMS_API_URL
      : env === "staging"
        ? process.env.CMS_API_URL_STAGING ||
          process.env.VITE_CMS_API_URL_STAGING
        : process.env.CMS_API_URL_DEV || process.env.VITE_CMS_API_URL_DEV,
  cmsAPIToken:
    env === "production"
      ? process.env.CMS_API_TOKEN
      : env === "staging"
        ? process.env.CMS_API_TOKEN_STAGING
        : process.env.CMS_API_TOKEN_DEV,
  expirationDurationInSeconds:
    process.env.EXPIRATION_TIME_IN_SECONDS || 60 * 60 * 24,
};

function getConfigValue(key: keyof typeof rawConfig) {
  return rawConfig[key];
}

export const config = new Proxy(rawConfig, {
  get: (_, key) => getConfigValue(key as any),
});
