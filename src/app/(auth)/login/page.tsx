import { AuthForm } from "@/components/auth/auth-form";
import { PageHeader } from "@/components/ui/page-header";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Login"
        description="Sign in with your Supabase account to access the TMS dashboard."
      />

      <AuthForm mode="login" />
    </div>
  );
}
