import { AuthGuard } from "@/components/auth/auth-guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}
