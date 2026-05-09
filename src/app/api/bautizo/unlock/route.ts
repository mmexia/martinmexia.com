import { NextRequest, NextResponse } from "next/server";
import { checkSitePassword, setSiteCookie } from "@/lib/bautizo-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const pwd = (body.password || "").trim();
  if (!pwd) {
    return NextResponse.json({ error: "missing_password" }, { status: 400 });
  }
  if (!checkSitePassword(pwd)) {
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  }
  await setSiteCookie();
  return NextResponse.json({ ok: true });
}
