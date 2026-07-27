import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Minimal shared-passcode gate: a single signed cookie that says "you're in".
// The passcode and signing secret live in env vars (this repo is public).

const COOKIE = "appraisals_session";
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days

function secret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

const TOKEN_PAYLOAD = "ok";

export async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (payload !== TOKEN_PAYLOAD || !sig) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(TOKEN_PAYLOAD));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function grantSession(): Promise<void> {
  (await cookies()).set(COOKIE, `${TOKEN_PAYLOAD}.${sign(TOKEN_PAYLOAD)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function passcodeMatches(input: string): boolean {
  const expected = process.env.SITE_PASSCODE;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
