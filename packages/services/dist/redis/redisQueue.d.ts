export declare function acquireLock(key: string, lockValue: string, expiration: number): Promise<boolean>;
export declare function releaseLock(key: string, lockValue: string): Promise<void>;
