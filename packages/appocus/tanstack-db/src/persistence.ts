/**
 * Browser SQLite persistence singleton factory for TanStack DB catalog collections.
 *
 * OPFS allows only one sync access handle per file per origin: a second
 * `openBrowserWASQLiteOPFSDatabase` call (another tab, or the module being evaluated
 * twice) raises `NoModificationAllowedError`. This factory protects against that by:
 *  - storing the promise on `globalThis` keyed by an app-provided slug (same realm), and
 *  - acquiring a Web Lock with `ifAvailable: true` (cross-tab); other tabs fall back
 *    to in-memory mode.
 */

export type CreatePersistenceSingletonOptions = {
  /** SQLite database file name inside OPFS. e.g. `"my-app.sqlite"`. */
  databaseName: string;
  /** Logical name passed to `BrowserCollectionCoordinator`. e.g. `"my-app"`. */
  dbName: string;
  /** Web Locks resource name used to elect a single SQLite-using tab. */
  leaderLockName: string;
  /** Bail-out when SQLite/OPFS doesn't respond (e.g. iPad Safari). Default: 15s. */
  openTimeoutMs?: number;
  /** Optional override for the `globalThis` storage key. Derived from `dbName` by default. */
  globalKey?: string;
  /** Override the default `console`-based logger. */
  logger?: PersistenceLogger;
};

export type PersistenceLogger = {
  debug?: (message: string, ...rest: unknown[]) => void;
  warn?: (message: string, ...rest: unknown[]) => void;
};

const DEFAULT_OPEN_TIMEOUT_MS = 15_000;

async function openPersistenceOrNull(
  options: CreatePersistenceSingletonOptions,
): Promise<unknown> {
  if (typeof window === "undefined") return null;

  const logger = options.logger ?? console;

  const open = async (): Promise<unknown> => {
    try {
      const {
        openBrowserWASQLiteOPFSDatabase,
        createBrowserWASQLitePersistence,
        BrowserCollectionCoordinator,
      } = await import("@tanstack/browser-db-sqlite-persistence");

      logger.debug?.(
        `[appocus/tanstack-db] Opening SQLite OPFS database (${options.databaseName})…`,
      );
      const database = await openBrowserWASQLiteOPFSDatabase({
        databaseName: options.databaseName,
      });

      const coordinator = new BrowserCollectionCoordinator({
        dbName: options.dbName,
      });

      const persistence = createBrowserWASQLitePersistence({
        database,
        coordinator,
      });
      logger.debug?.(
        "[appocus/tanstack-db] SQLite persistence ready — catalog collections will use local SQLite.",
      );
      return persistence;
    } catch (e) {
      logger.warn?.(
        "[appocus/tanstack-db] SQLite persistence unavailable, falling back to in-memory mode:",
        e,
      );
      return null;
    }
  };

  const timeoutMs = options.openTimeoutMs ?? DEFAULT_OPEN_TIMEOUT_MS;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => {
      logger.warn?.(
        `[appocus/tanstack-db] SQLite/OPFS did not respond in ${timeoutMs}ms (e.g. iPad Safari); using in-memory mode.`,
      );
      resolve(null);
    }, timeoutMs);
  });

  try {
    return await Promise.race([open(), timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

async function initPersistenceOnce(
  options: CreatePersistenceSingletonOptions,
): Promise<unknown> {
  if (typeof window === "undefined") return null;

  const logger = options.logger ?? console;
  const locks = navigator.locks;
  if (typeof locks?.request !== "function") {
    return openPersistenceOrNull(options);
  }

  return new Promise((resolve) => {
    void locks
      .request(
        options.leaderLockName,
        { mode: "exclusive", ifAvailable: true },
        async (lock) => {
          if (!lock) {
            logger.warn?.(
              "[appocus/tanstack-db] SQLite OPFS is already used by another tab. This tab will use in-memory catalogs.",
            );
            resolve(null);
            return;
          }
          try {
            const persistence = await openPersistenceOrNull(options);
            resolve(persistence);
          } catch {
            resolve(null);
          }
          // Hold the lock until the tab closes; releasing it would let another tab race for OPFS.
          await new Promise<void>(() => {});
        },
      )
      .catch((err: unknown) => {
        logger.warn?.(
          "[appocus/tanstack-db] Web Locks failed; opening OPFS without cross-tab lock:",
          err,
        );
        void openPersistenceOrNull(options).then(resolve);
      });
  });
}

/**
 * Create (or reuse) a per-app SQLite persistence singleton.
 *
 * Returns a promise that resolves to the TanStack persistence object on the leader tab,
 * or `null` on non-leader / server / unsupported environments.
 *
 * ```ts
 * export const persistence = await createPersistenceSingleton({
 *   databaseName: "my-app.sqlite",
 *   dbName: "my-app",
 *   leaderLockName: "my-app-sqlite-opfs",
 * });
 * ```
 */
export function createPersistenceSingleton(
  options: CreatePersistenceSingletonOptions,
): Promise<unknown> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const key = options.globalKey ?? `__appocusPersistence__${options.dbName}`;
  const globalRecord = globalThis as typeof globalThis &
    Record<string, Promise<unknown> | undefined>;

  if (!globalRecord[key]) {
    globalRecord[key] = initPersistenceOnce(options);
  }
  return globalRecord[key]!;
}
