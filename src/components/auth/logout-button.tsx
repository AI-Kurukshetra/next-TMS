"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:text-slate-950 disabled:opacity-50"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
