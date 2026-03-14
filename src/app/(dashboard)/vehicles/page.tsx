import { VehiclesWorkspace } from "@/components/admin/vehicles-workspace";
import { PageHeader } from "@/components/ui/page-header";

export default function VehiclesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Vehicles"
        description="Fleet records used for shipment allocation and dispatch."
      />
      <VehiclesWorkspace />
    </div>
  );
}
