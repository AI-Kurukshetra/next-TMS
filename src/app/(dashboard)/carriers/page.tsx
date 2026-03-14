import { CarriersWorkspace } from "@/components/admin/carriers-workspace";
import { PageHeader } from "@/components/ui/page-header";

export default function CarriersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Carriers"
        description="Transportation partners available for shipment assignment."
      />
      <CarriersWorkspace />
    </div>
  );
}
