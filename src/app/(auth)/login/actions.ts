"use server";

import { redirect } from "next/navigation";
import { loginSchema, type LoginFormState } from "@/lib/auth/definitions";
import { login } from "@/lib/auth/api";
import { createSession } from "@/lib/auth/session";
import { ApiError } from "@/types/api";

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

  try {
    const { token } = await login(email, password);
    await createSession(token, remember);
  } catch (error) {
    if (error instanceof ApiError) {
      return { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    }
    throw error;
  }

  redirect("/dashboard");
}
