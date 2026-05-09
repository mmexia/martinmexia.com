import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, setAdminCookie } from "@/lib/bautizo-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  if (!checkAdminPassword(password)) {
    const url = new URL("/bautizo/admin", req.url);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }
  await setAdminCookie();
  return NextResponse.redirect(new URL("/bautizo/admin", req.url), 303);
}
