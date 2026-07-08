import "server-only";
import { env } from "@/config/env";
import { getToken } from "@/lib/auth/session";
import { ApiError } from "@/types/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, body, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = await getToken();
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${env.API_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง", 0);
  }

  if (!response.ok) {
    const message = await response
      .json()
      .then((data: { message?: string }) => data.message)
      .catch(() => undefined);
    throw new ApiError(message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
