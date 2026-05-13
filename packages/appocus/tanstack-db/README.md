# @appocus/tanstack-db

Generic helpers for Appocus apps that use TanStack DB + Electric SQL + Drizzle.

## What's inside

- `createPersistenceSingleton({ databaseName, dbName, leaderLockName })` — promise-based factory that opens a browser SQLite (WA-SQLite + OPFS) persistence layer with Web-Locks-based leader election and an open timeout, falling back gracefully to in-memory mode.
- `sqlCommittedTxIdAfterWrite` / `parseCommittedTxIdRow` — Drizzle SQL fragment and parser to retrieve `pg_current_xact_id()` after a write, so Electric streams can be matched to the committing transaction.
- `toDateOrNull`, `toNumberOrNull`, `toStringOrNull` — small sanitizers for shaping API payloads (e.g. Zauru responses with `{ url: null }` image objects).

## Install

```bash
pnpm add @appocus/tanstack-db
```

Peer deps (resolved by the host app): `@tanstack/browser-db-sqlite-persistence`, `drizzle-orm`.

## Usage

```ts
import { createPersistenceSingleton } from "@appocus/tanstack-db";

export const persistence = await createPersistenceSingleton({
  databaseName: "my-app.sqlite",
  dbName: "my-app",
  leaderLockName: "my-app-sqlite-opfs",
});
```

```ts
import {
  sqlCommittedTxIdAfterWrite,
  parseCommittedTxIdRow,
} from "@appocus/tanstack-db";

await db.transaction(async (tx) => {
  await tx.insert(things).values(payload);
  const [row] = await tx.execute(sqlCommittedTxIdAfterWrite);
  const txid = parseCommittedTxIdRow(row);
  return { txid };
});
```
