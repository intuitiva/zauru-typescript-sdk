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
export declare function createPersistenceSingleton(options: CreatePersistenceSingletonOptions): Promise<unknown>;
