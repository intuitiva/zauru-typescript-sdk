import { Redis } from "@upstash/redis";
import { config } from "@zauru-sdk/config";
const EXTEND_LOCK_SCRIPT = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("pexpire", KEYS[1], ARGV[2])
  else
    return 0
  end
`;
const RELEASE_LOCK_SCRIPT = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`;
let defaultRedis;
const getDefaultRedis = () => {
    if (!defaultRedis) {
        defaultRedis = new Redis({
            url: config.redisBaseURL,
            token: config.redisToken,
        });
    }
    return defaultRedis;
};
const isSuccessfulEval = (result) => result === 1 || result === "1";
export const createLockClient = (redis) => {
    const acquireLock = async (key, lockValue, expiration) => {
        const result = await redis.set(key, lockValue, {
            nx: true,
            px: expiration,
        });
        return result === "OK";
    };
    const extendLock = async (key, lockValue, expiration) => {
        const result = await redis.eval(EXTEND_LOCK_SCRIPT, [key], [
            lockValue,
            expiration,
        ]);
        return isSuccessfulEval(result);
    };
    const releaseLock = async (key, lockValue) => {
        await redis.eval(RELEASE_LOCK_SCRIPT, [key], [lockValue]);
    };
    const startLockHeartbeat = (key, lockValue, expiration, intervalMs = Math.max(1_000, Math.floor(expiration / 3))) => {
        const timer = setInterval(() => {
            void extendLock(key, lockValue, expiration).catch((error) => {
                console.error("extendLock failed", error);
            });
        }, intervalMs);
        timer.unref?.();
        return () => clearInterval(timer);
    };
    const runWithLock = async (options, fn) => {
        const retryMs = options.retryMs ?? 10_000;
        const startedAt = Date.now();
        let acquired = false;
        while (!acquired) {
            if (Date.now() - startedAt >= options.waitMs) {
                return { acquired: false };
            }
            acquired = await acquireLock(options.key, options.lockValue, options.ttlMs);
            if (!acquired) {
                await new Promise((resolve) => setTimeout(resolve, retryMs));
            }
        }
        const stopHeartbeat = startLockHeartbeat(options.key, options.lockValue, options.ttlMs);
        try {
            const result = await fn();
            return { acquired: true, result };
        }
        finally {
            stopHeartbeat();
            await releaseLock(options.key, options.lockValue);
        }
    };
    return {
        acquireLock,
        extendLock,
        releaseLock,
        startLockHeartbeat,
        runWithLock,
    };
};
let defaultLockClient;
const getDefaultLockClient = () => {
    if (!defaultLockClient) {
        defaultLockClient = createLockClient(getDefaultRedis());
    }
    return defaultLockClient;
};
export const acquireLock = (key, lockValue, expiration) => getDefaultLockClient().acquireLock(key, lockValue, expiration);
export const extendLock = (key, lockValue, expiration) => getDefaultLockClient().extendLock(key, lockValue, expiration);
export const releaseLock = (key, lockValue) => getDefaultLockClient().releaseLock(key, lockValue);
export const startLockHeartbeat = (key, lockValue, expiration, intervalMs) => getDefaultLockClient().startLockHeartbeat(key, lockValue, expiration, intervalMs);
export const runWithLock = (options, fn) => getDefaultLockClient().runWithLock(options, fn);
