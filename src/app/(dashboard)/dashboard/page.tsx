import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import { PageHeader } from "@/components/ui/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Role-aware analytics and operational visibility for the TMS workspace."
      />
      <DashboardWorkspace />
    </div>
  );
}
