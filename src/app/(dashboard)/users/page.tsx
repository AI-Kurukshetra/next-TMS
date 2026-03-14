import { UsersWorkspace } from "@/components/admin/users-workspace";
import { PageHeader } from "@/components/ui/page-header";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Manage role access for admins, dispatchers, drivers, and customers."
      />
      <UsersWorkspace />
    </div>
  );
}
