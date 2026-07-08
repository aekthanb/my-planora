import "server-only";
import { apiClient } from "@/lib/api/client";

type LoginResponse = {
  token: string;
};

export function login(email: string, password: string) {
  return apiClient.post<LoginResponse>("/auth/login", { email, password }, { auth: false });
}
