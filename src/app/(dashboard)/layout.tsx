import { AuthGuard } from "@/components/auth/auth-guard";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard requireAuth>{children}</AuthGuard>;
}
