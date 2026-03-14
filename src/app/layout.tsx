import { AppHeader } from "@/components/auth/app-header";
import { AppSidebar } from "@/components/auth/app-sidebar";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TMS Dashboard",
  description: "Transportation Management System MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-950">
        <div className="min-h-screen">
          <div className="flex min-h-screen flex-col lg:flex-row">
            <AppSidebar />
            <main className="min-w-0 flex-1">
              <AppHeader />
              <div className="mx-auto max-w-[1120px] px-4 py-6 lg:px-8 lg:py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
