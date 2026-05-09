import { cookies } from "next/headers";
import crypto from "crypto";

const SITE_COOKIE = "bautizo_site";
const ADMIN_COOKIE = "bautizo_admin";

function sign(secret: string) {
  return crypto.createHmac("sha256", secret).update("ok").digest("hex");
}

function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function checkSitePassword(input: string): boolean {
  const expected = process.env.BAUTIZO_SITE_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(input.trim().toLowerCase(), expected.trim().toLowerCase());
}

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.BAUTIZO_ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}

export async function setSiteCookie() {
  const secret = process.env.BAUTIZO_SITE_PASSWORD;
  if (!secret) return;
  const c = await cookies();
  c.set(SITE_COOKIE, sign(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function setAdminCookie() {
  const secret = process.env.BAUTIZO_ADMIN_PASSWORD;
  if (!secret) return;
  const c = await cookies();
  c.set(ADMIN_COOKIE, sign(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function isAdminAuthed(): Promise<boolean> {
  const secret = process.env.BAUTIZO_ADMIN_PASSWORD;
  if (!secret) return false;
  const c = await cookies();
  const v = c.get(ADMIN_COOKIE)?.value;
  if (!v) return false;
  return timingSafeEqual(v, sign(secret));
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}
