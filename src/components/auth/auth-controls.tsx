"use client";

import Link from "next/link";
import { getRoleLabel } from "@/lib/auth/roles";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";

export function AuthControls() {
  const { loading, session, user } = useCurrentAppUser();

  if (loading) {
    return (
      <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
        <div className="font-medium text-slate-900">
          {user?.full_name ?? session.user.email ?? "Authenticated user"}
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-500">
          {user ? getRoleLabel(user.role) : "Pending role profile"}
        </div>
        <div>{user?.email ?? session.user.email}</div>
      </div>
      <LogoutButton />
    </div>
  );
}
