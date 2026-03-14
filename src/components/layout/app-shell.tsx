"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/auth/app-header";
import { AppSidebar } from "@/components/auth/app-sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <div className="flex h-screen flex-col lg:flex-row">
        <AppSidebar />
        <main className="h-full min-w-0 flex-1 overflow-y-auto">
          <AppHeader />
          <div className="mx-auto max-w-[1120px] px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
