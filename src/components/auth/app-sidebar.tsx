"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV_ITEMS, getRoleLabel } from "@/lib/auth/roles";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { cn } from "@/lib/utils/cn";

const HIDDEN_ROUTES = ["/", "/login", "/signup"];

export function AppSidebar() {
  const pathname = usePathname();
  const { loading, user } = useCurrentAppUser();

  if (HIDDEN_ROUTES.includes(pathname) || loading || !user) {
    return null;
  }

  const navigation = APP_NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:h-full lg:w-72 lg:border-b-0 lg:border-r lg:border-slate-200">
      <div className="lg:sticky lg:top-[81px] lg:flex lg:h-full lg:flex-col">
        <section className="border-b border-slate-200 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Navigation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Signed in as {getRoleLabel(user.role)}.
          </p>
        </section>

        <nav className="p-3 lg:flex-1 lg:overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
