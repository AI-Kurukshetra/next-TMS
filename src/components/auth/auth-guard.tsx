"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import {
  canAccessPath,
  getDefaultRouteForRole,
} from "@/lib/auth/roles";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { LogoutButton } from "@/components/auth/logout-button";

type AuthGuardProps = {
  children: ReactNode;
  requireAuth: boolean;
};

export function AuthGuard({ children, requireAuth }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, error, session, user } = useCurrentAppUser();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (requireAuth && !session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!requireAuth && user) {
      router.replace(getDefaultRouteForRole(user.role));
      return;
    }

    if (requireAuth && user && !canAccessPath(user.role, pathname)) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [loading, pathname, requireAuth, router, session, user]);

  if (loading || (requireAuth && !session) || (!requireAuth && user)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          Checking session...
        </div>
      </div>
    );
  }

  if (requireAuth && session && !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Role profile required
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {error ??
              "This account is signed in, but no TMS role profile was found. Sign out and create the account again with a role, or update the user record in Supabase."}
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  if (requireAuth && user && !canAccessPath(user.role, pathname)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          Redirecting to your permitted workspace...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
