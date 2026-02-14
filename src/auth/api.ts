import type { LoginRequest, LoginResponse } from "./types";

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const data: unknown = await res.json().catch(() => null);
    const msg =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Ошибка авторизации";
    throw new Error(msg);
  }

  const data: LoginResponse = await res.json();
  return data;
}
