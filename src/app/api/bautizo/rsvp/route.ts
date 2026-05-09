import { NextRequest, NextResponse } from "next/server";
import { db, ensureSchema, type RsvpRow } from "@/lib/bautizo-db";
import { isAdminAuthed } from "@/lib/bautizo-auth";

export const runtime = "nodejs";

type SubmittedRsvp = {
  name?: string;
  email?: string;
  phone?: string;
  attending?: string;
  adults?: number | string;
  kids?: number | string;
  dietary?: string;
  message?: string;
  language?: string;
};

function clampInt(v: unknown, min: number, max: number): number {
  const n = typeof v === "number" ? v : parseInt(String(v ?? "0"), 10);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: SubmittedRsvp;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const attending = body.attending === "no" ? "no" : "yes";
  const adults = attending === "yes" ? clampInt(body.adults, 0, 20) : 0;
  const kids = attending === "yes" ? clampInt(body.kids, 0, 20) : 0;
  const dietary = clean(body.dietary, 500);
  const message = clean(body.message, 2000);
  const language = clean(body.language, 5) || "es";

  if (!name || !email) {
    return NextResponse.json({ error: "name_and_email_required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;

  try {
    await ensureSchema();
    await db().execute({
      sql: `INSERT INTO rsvps (name, email, phone, attending, adults, kids, dietary, message, language, ip, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [name, email, phone || null, attending, adults, kids, dietary || null, message || null, language, ip, userAgent],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("rsvp insert failed", err);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    await ensureSchema();
    const result = await db().execute(
      "SELECT id, name, email, phone, attending, adults, kids, dietary, message, language, submitted_at FROM rsvps ORDER BY submitted_at DESC"
    );
    const rows = result.rows as unknown as RsvpRow[];
    return NextResponse.json({ rsvps: rows });
  } catch (err) {
    console.error("rsvp list failed", err);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
