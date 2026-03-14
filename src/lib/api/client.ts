"use client";

import { AppUser } from "@/types/user";

export async function fetchJson<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  const payload = (await response.json().catch(() => null)) as
    | { data?: T; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "Request failed.");
  }

  return payload?.data as T;
}

export function withAuth(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export type AuthenticatedState = {
  accessToken: string;
  user: AppUser;
};
