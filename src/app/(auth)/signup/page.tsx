import { AuthForm } from "@/components/auth/auth-form";
import { PageHeader } from "@/components/ui/page-header";

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Sign Up"
        description="Create a TMS account with the correct customer, dispatcher, driver, or admin role."
      />

      <AuthForm mode="signup" />
    </div>
  );
}
