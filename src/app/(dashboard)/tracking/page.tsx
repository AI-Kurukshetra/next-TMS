import { TrackingWorkspace } from "@/components/tracking/tracking-workspace";
import { PageHeader } from "@/components/ui/page-header";

export default function TrackingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tracking"
        description="Shipment milestones and operational scan events."
      />
      <TrackingWorkspace />
    </div>
  );
}
