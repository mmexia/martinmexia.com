import { db, ensureSchema, type RsvpRow } from "@/lib/bautizo-db";
import { isAdminAuthed } from "@/lib/bautizo-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return new Response("unauthorized", { status: 401 });
  }
  await ensureSchema();
  const result = await db().execute(
    "SELECT id, name, email, phone, attending, adults, kids, dietary, message, language, submitted_at FROM rsvps ORDER BY submitted_at DESC"
  );
  const rows = result.rows as unknown as RsvpRow[];
  const header = [
    "id",
    "name",
    "email",
    "phone",
    "attending",
    "adults",
    "kids",
    "dietary",
    "message",
    "language",
    "submitted_at",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(header.map((h) => csvEscape((r as unknown as Record<string, unknown>)[h])).join(","));
  }
  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="bautizo-rsvps-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
