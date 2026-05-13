/**
 * Electric / TanStack DB handshake helper: the txid emitted in the Electric stream
 * must match the value Postgres assigns to the *first write* in a transaction.
 *
 * Run this SQL **after** the INSERT/UPDATE/DELETE in the same transaction so the
 * xid is already assigned. Avoid `::xid` (32-bit truncation); Electric uses the
 * full xid8.
 */
export declare const sqlCommittedTxIdAfterWrite: import("drizzle-orm").SQL<unknown>;
export declare function parseCommittedTxIdRow(row: unknown): number;
