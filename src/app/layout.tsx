import { AppShell } from "@/components/layout/app-shell";
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
