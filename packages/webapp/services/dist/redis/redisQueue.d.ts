export type RedisLockClient = {
    set: (key: string, value: string, opts: {
        nx: true;
        px: number;
    }) => Promise<string | null>;
    eval: (script: string, keys: string[], args: (string | number)[]) => Promise<unknown>;
};
export type RunWithLockOptions = {
    key: string;
    lockValue: string;
    ttlMs: number;
    waitMs: number;
    retryMs?: number;
};
export type RunWithLockResult<T> = {
    acquired: false;
} | {
    acquired: true;
    result: T;
};
export declare const createLockClient: (redis: RedisLockClient) => {
    acquireLock: (key: string, lockValue: string, expiration: number) => Promise<boolean>;
    extendLock: (key: string, lockValue: string, expiration: number) => Promise<boolean>;
    releaseLock: (key: string, lockValue: string) => Promise<void>;
    startLockHeartbeat: (key: string, lockValue: string, expiration: number, intervalMs?: number) => (() => void);
    runWithLock: <T>(options: RunWithLockOptions, fn: () => Promise<T>) => Promise<RunWithLockResult<T>>;
};
export declare const acquireLock: (key: string, lockValue: string, expiration: number) => Promise<boolean>;
export declare const extendLock: (key: string, lockValue: string, expiration: number) => Promise<boolean>;
export declare const releaseLock: (key: string, lockValue: string) => Promise<void>;
export declare const startLockHeartbeat: (key: string, lockValue: string, expiration: number, intervalMs?: number) => () => void;
export declare const runWithLock: <T>(options: RunWithLockOptions, fn: () => Promise<T>) => Promise<RunWithLockResult<T>>;
