import { DriversWorkspace } from "@/components/admin/drivers-workspace";
import { PageHeader } from "@/components/ui/page-header";

export default function DriversPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Drivers"
        description="Driver roster aligned with carrier operations."
      />
      <DriversWorkspace />
    </div>
  );
}
