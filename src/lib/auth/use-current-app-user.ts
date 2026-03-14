"use client";

import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { AppUser } from "@/types/user";

type CurrentAppUserState = {
  session: Session | null;
  user: AppUser | null;
  loading: boolean;
  error: string | null;
};

async function fetchCurrentAppUser(
  session: Session | null,
): Promise<AppUser | null> {
  if (!session) {
    return null;
  }

  const response = await fetch("/api/me", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | { data?: AppUser | null; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "Failed to load current user.");
  }

  return payload?.data ?? null;
}

export function useCurrentAppUser(): CurrentAppUserState {
  const [state, setState] = useState<CurrentAppUserState>({
    session: null,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let isActive = true;

    async function loadState(nextSession?: Session | null) {
      let session: Session | null = nextSession ?? null;

      try {
        if (!session) {
          session = (await supabase.auth.getSession()).data.session ?? null;
        }

        if (!isActive) {
          return;
        }

        if (!session) {
          setState({
            session: null,
            user: null,
            loading: false,
            error: null,
          });
          return;
        }

        const user = await fetchCurrentAppUser(session);

        if (!isActive) {
          return;
        }

        setState({
          session,
          user,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState({
          session,
          user: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load current user.",
        });
      }
    }

    void loadState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setState((currentState) => ({
        ...currentState,
        session: nextSession,
        loading: true,
        error: null,
      }));
      void loadState(nextSession);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
