"use client";

import Link from "next/link";
import { AuthControls } from "@/components/auth/auth-controls";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <div>
          <Link href="/" className="text-lg font-semibold">
            NextGen TMS
          </Link>
          <p className="mt-1 text-sm text-slate-500">
            Transportation operations workspace
          </p>
        </div>
        <AuthControls />
      </div>
    </header>
  );
}
