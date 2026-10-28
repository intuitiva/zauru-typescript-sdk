import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createLockClient, type RedisLockClient } from "./redisQueue.js";

const createFakeRedis = (): RedisLockClient & {
  store: Map<string, { value: string; expiresAt: number }>;
} => {
  const store = new Map<string, { value: string; expiresAt: number }>();

  const live = (key: string) => {
    const row = store.get(key);
    if (!row) return undefined;
    if (row.expiresAt <= Date.now()) {
      store.delete(key);
      return undefined;
    }
    return row;
  };

  return {
    store,
    async set(key, value, opts) {
      if (opts.nx && live(key)) {
        return null;
      }
      store.set(key, { value, expiresAt: Date.now() + opts.px });
      return "OK";
    },
    async eval(script, keys, args) {
      const key = keys[0];
      const row = live(key);
      if (script.includes("pexpire")) {
        if (row?.value === args[0]) {
          row.expiresAt = Date.now() + Number(args[1]);
          return 1;
        }
        return 0;
      }
      if (script.includes("del")) {
        if (row?.value === args[0]) {
          store.delete(key);
          return 1;
        }
        return 0;
      }
      throw new Error("unknown script");
    },
  };
};

describe("createLockClient", () => {
  it("When the key is free, it should acquire the lock", async () => {
    const locks = createLockClient(createFakeRedis());
    assert.equal(await locks.acquireLock("k", "owner-a", 1_000), true);
  });

  it("When another owner holds the key, it should not steal the lock", async () => {
    const locks = createLockClient(createFakeRedis());
    assert.equal(await locks.acquireLock("k", "owner-a", 5_000), true);
    assert.equal(await locks.acquireLock("k", "owner-b", 5_000), false);
  });

  it("When the owner extends, it should keep the lock alive", async () => {
    const redis = createFakeRedis();
    const locks = createLockClient(redis);
    await locks.acquireLock("k", "owner-a", 50);
    assert.equal(await locks.extendLock("k", "owner-a", 5_000), true);
    await new Promise((resolve) => setTimeout(resolve, 80));
    assert.equal(await locks.acquireLock("k", "owner-b", 5_000), false);
  });

  it("When a stranger tries to extend, it should leave the lock alone", async () => {
    const locks = createLockClient(createFakeRedis());
    await locks.acquireLock("k", "owner-a", 5_000);
    assert.equal(await locks.extendLock("k", "owner-b", 5_000), false);
  });

  it("When the owner releases, it should let the next caller in", async () => {
    const locks = createLockClient(createFakeRedis());
    await locks.acquireLock("k", "owner-a", 5_000);
    await locks.releaseLock("k", "owner-a");
    assert.equal(await locks.acquireLock("k", "owner-b", 5_000), true);
  });

  it("When a stranger releases, it should keep the original owner", async () => {
    const locks = createLockClient(createFakeRedis());
    await locks.acquireLock("k", "owner-a", 5_000);
    await locks.releaseLock("k", "owner-b");
    assert.equal(await locks.acquireLock("k", "owner-b", 5_000), false);
  });

  it("When the work finishes, it should run the callback and release", async () => {
    const locks = createLockClient(createFakeRedis());
    const result = await locks.runWithLock(
      { key: "k", lockValue: "owner-a", ttlMs: 5_000, waitMs: 20, retryMs: 5 },
      async () => "done",
    );
    assert.deepEqual(result, { acquired: true, result: "done" });
    assert.equal(await locks.acquireLock("k", "owner-b", 5_000), true);
  });

  it("When the lock is busy past waitMs, it should time out without running work", async () => {
    const locks = createLockClient(createFakeRedis());
    await locks.acquireLock("k", "owner-a", 5_000);
    let ran = false;
    const result = await locks.runWithLock(
      { key: "k", lockValue: "owner-b", ttlMs: 5_000, waitMs: 20, retryMs: 5 },
      async () => {
        ran = true;
        return "should-not-run";
      },
    );
    assert.deepEqual(result, { acquired: false });
    assert.equal(ran, false);
  });

  it("When the callback throws, it should still release the lock", async () => {
    const locks = createLockClient(createFakeRedis());
    await assert.rejects(
      () =>
        locks.runWithLock(
          { key: "k", lockValue: "owner-a", ttlMs: 5_000, waitMs: 20, retryMs: 5 },
          async () => {
            throw new Error("boom");
          },
        ),
      /boom/,
    );
    assert.equal(await locks.acquireLock("k", "owner-b", 5_000), true);
  });
});
