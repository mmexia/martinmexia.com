import { createClient, type Client } from "@libsql/client";

let cached: Client | null = null;

export function db(): Client {
  if (cached) return cached;
  const url = process.env.BAUTIZO_DATABASE_URL;
  const authToken = process.env.BAUTIZO_DATABASE_AUTH_TOKEN;
  if (!url) throw new Error("BAUTIZO_DATABASE_URL is not set");
  cached = createClient({ url, authToken });
  return cached;
}

export async function ensureSchema() {
  await db().execute(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      attending TEXT NOT NULL CHECK (attending IN ('yes','no')),
      adults INTEGER NOT NULL DEFAULT 0,
      kids INTEGER NOT NULL DEFAULT 0,
      dietary TEXT,
      message TEXT,
      language TEXT,
      ip TEXT,
      user_agent TEXT,
      submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export type RsvpRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  attending: "yes" | "no";
  adults: number;
  kids: number;
  dietary: string | null;
  message: string | null;
  language: string | null;
  ip: string | null;
  user_agent: string | null;
  submitted_at: string;
};
