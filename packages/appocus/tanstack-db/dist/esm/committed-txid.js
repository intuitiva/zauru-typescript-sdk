import { sql } from "drizzle-orm";
/**
 * Electric / TanStack DB handshake helper: the txid emitted in the Electric stream
 * must match the value Postgres assigns to the *first write* in a transaction.
 *
 * Run this SQL **after** the INSERT/UPDATE/DELETE in the same transaction so the
 * xid is already assigned. Avoid `::xid` (32-bit truncation); Electric uses the
 * full xid8.
 */
export const sqlCommittedTxIdAfterWrite = sql `
  SELECT pg_current_xact_id()::text AS txid
`;
export function parseCommittedTxIdRow(row) {
    const raw = row?.txid;
    const n = parseInt(String(raw ?? ""), 10);
    if (!Number.isFinite(n)) {
        throw new Error("committed-txid: invalid pg_current_xact_id() result");
    }
    return n;
}
