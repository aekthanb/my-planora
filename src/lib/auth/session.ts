import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "planora_session";
const DEFAULT_MAX_AGE = 60 * 60 * 24; // 1 day
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function createSession(token: string, remember: boolean) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? REMEMBER_MAX_AGE : DEFAULT_MAX_AGE,
  });
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
