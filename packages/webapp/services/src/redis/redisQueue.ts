import { Redis } from "@upstash/redis";
import { config } from "@zauru-sdk/config";

export type RedisLockClient = {
  set: (
    key: string,
    value: string,
    opts: { nx: true; px: number },
  ) => Promise<string | null>;
  eval: (
    script: string,
    keys: string[],
    args: (string | number)[],
  ) => Promise<unknown>;
};

export type RunWithLockOptions = {
  key: string;
  lockValue: string;
  ttlMs: number;
  waitMs: number;
  retryMs?: number;
};

export type RunWithLockResult<T> =
  | { acquired: false }
  | { acquired: true; result: T };

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

let defaultRedis: RedisLockClient | undefined;

const getDefaultRedis = (): RedisLockClient => {
  if (!defaultRedis) {
    defaultRedis = new Redis({
      url: config.redisBaseURL,
      token: config.redisToken,
    }) as RedisLockClient;
  }
  return defaultRedis;
};

const isSuccessfulEval = (result: unknown) => result === 1 || result === "1";

export const createLockClient = (redis: RedisLockClient) => {
  const acquireLock = async (
    key: string,
    lockValue: string,
    expiration: number,
  ): Promise<boolean> => {
    const result = await redis.set(key, lockValue, {
      nx: true,
      px: expiration,
    });
    return result === "OK";
  };

  const extendLock = async (
    key: string,
    lockValue: string,
    expiration: number,
  ): Promise<boolean> => {
    const result = await redis.eval(EXTEND_LOCK_SCRIPT, [key], [
      lockValue,
      expiration,
    ]);
    return isSuccessfulEval(result);
  };

  const releaseLock = async (key: string, lockValue: string): Promise<void> => {
    await redis.eval(RELEASE_LOCK_SCRIPT, [key], [lockValue]);
  };

  const startLockHeartbeat = (
    key: string,
    lockValue: string,
    expiration: number,
    intervalMs = Math.max(1_000, Math.floor(expiration / 3)),
  ): (() => void) => {
    const timer = setInterval(() => {
      void extendLock(key, lockValue, expiration).catch((error) => {
        console.error("extendLock failed", error);
      });
    }, intervalMs);
    timer.unref?.();
    return () => clearInterval(timer);
  };

  const runWithLock = async <T>(
    options: RunWithLockOptions,
    fn: () => Promise<T>,
  ): Promise<RunWithLockResult<T>> => {
    const retryMs = options.retryMs ?? 10_000;
    const startedAt = Date.now();
    let acquired = false;

    while (!acquired) {
      if (Date.now() - startedAt >= options.waitMs) {
        return { acquired: false };
      }

      acquired = await acquireLock(
        options.key,
        options.lockValue,
        options.ttlMs,
      );
      if (!acquired) {
        await new Promise((resolve) => setTimeout(resolve, retryMs));
      }
    }

    const stopHeartbeat = startLockHeartbeat(
      options.key,
      options.lockValue,
      options.ttlMs,
    );

    try {
      const result = await fn();
      return { acquired: true, result };
    } finally {
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

let defaultLockClient: ReturnType<typeof createLockClient> | undefined;

const getDefaultLockClient = () => {
  if (!defaultLockClient) {
    defaultLockClient = createLockClient(getDefaultRedis());
  }
  return defaultLockClient;
};

export const acquireLock = (
  key: string,
  lockValue: string,
  expiration: number,
) => getDefaultLockClient().acquireLock(key, lockValue, expiration);

export const extendLock = (
  key: string,
  lockValue: string,
  expiration: number,
) => getDefaultLockClient().extendLock(key, lockValue, expiration);

export const releaseLock = (key: string, lockValue: string) =>
  getDefaultLockClient().releaseLock(key, lockValue);

export const startLockHeartbeat = (
  key: string,
  lockValue: string,
  expiration: number,
  intervalMs?: number,
) =>
  getDefaultLockClient().startLockHeartbeat(
    key,
    lockValue,
    expiration,
    intervalMs,
  );

export const runWithLock = <T>(
  options: RunWithLockOptions,
  fn: () => Promise<T>,
) => getDefaultLockClient().runWithLock(options, fn);
