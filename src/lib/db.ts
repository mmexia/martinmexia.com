import { createClient, type Client } from '@libsql/client';

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (url) {
      client = createClient({ url, authToken });
    } else {
      // Local dev fallback: in-memory SQLite
      client = createClient({ url: 'file:local-botvault.db' });
    }
  }
  return client;
}

export async function initializeDatabase(): Promise<void> {
  const db = getDb();

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS passkeys (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id),
      credential_id   TEXT UNIQUE NOT NULL,
      public_key      BLOB NOT NULL,
      sign_count      INTEGER DEFAULT 0,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS credentials (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id),
      type            TEXT NOT NULL,
      label           TEXT NOT NULL,
      encrypted_data  BLOB NOT NULL,
      encrypted_dek   BLOB NOT NULL,
      iv              BLOB NOT NULL,
      auth_tag        BLOB NOT NULL,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS bots (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id),
      name            TEXT NOT NULL,
      description     TEXT,
      secret_hash     TEXT NOT NULL,
      is_active       BOOLEAN DEFAULT 1,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS permissions (
      id              TEXT PRIMARY KEY,
      bot_id          TEXT NOT NULL REFERENCES bots(id),
      credential_id   TEXT NOT NULL REFERENCES credentials(id),
      level           TEXT NOT NULL DEFAULT 'full',
      granted_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(bot_id, credential_id)
    )`,
    `CREATE TABLE IF NOT EXISTS bot_tokens (
      id              TEXT PRIMARY KEY,
      bot_id          TEXT NOT NULL REFERENCES bots(id),
      credential_id   TEXT NOT NULL REFERENCES credentials(id),
      token_hash      TEXT UNIQUE NOT NULL,
      permission      TEXT NOT NULL,
      redeemed        BOOLEAN DEFAULT 0,
      expires_at      DATETIME NOT NULL,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS audit_log (
      id              TEXT PRIMARY KEY,
      user_id         TEXT,
      bot_id          TEXT,
      action          TEXT NOT NULL,
      target_type     TEXT,
      target_id       TEXT,
      metadata        TEXT,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS magic_links (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id),
      token_hash      TEXT UNIQUE NOT NULL,
      expires_at      DATETIME NOT NULL,
      used            BOOLEAN DEFAULT 0,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS recovery_tokens (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id),
      token_hash      TEXT UNIQUE NOT NULL,
      expires_at      DATETIME NOT NULL,
      used            BOOLEAN DEFAULT 0,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of tables) {
    await db.execute(sql);
  }
}
