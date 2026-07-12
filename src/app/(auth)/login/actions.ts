"use server";

import { redirect } from "next/navigation";
import { loginSchema, type LoginFormState } from "@/lib/auth/definitions";
import { createSession } from "@/lib/auth/session";

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin";
const ADMIN_SESSION_TOKEN = "planora-admin";

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password, remember } = validated.data;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  await createSession(ADMIN_SESSION_TOKEN, remember);
  redirect("/");
}
