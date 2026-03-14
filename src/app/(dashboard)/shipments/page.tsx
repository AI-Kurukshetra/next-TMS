import { ShipmentsWorkspace } from "@/components/shipments/shipments-workspace";

export default function ShipmentsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Shipments</h1>
        <p className="text-sm text-slate-600">
          Create requests, dispatch loads, monitor delivery, and review shipment history.
        </p>
      </section>

      <ShipmentsWorkspace />
    </div>
  );
}
