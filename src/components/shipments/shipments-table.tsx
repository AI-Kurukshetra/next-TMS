import Link from "next/link";
import { ShipmentSummary } from "@/types/shipment";
import { UserRole } from "@/types/user";
import { ShipmentStatusBadge } from "./shipment-status-badge";

export function ShipmentsTable({
  shipments,
  emptyMessage = "No shipments found.",
  viewerRole,
}: {
  shipments: ShipmentSummary[];
  emptyMessage?: string;
  viewerRole?: UserRole;
}) {
  if (!shipments.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Shipment</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Origin</th>
            <th className="px-4 py-3">Destination</th>
            <th className="px-4 py-3">Carrier</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-sm">
          {shipments.map((shipment) => (
            <tr key={shipment.id}>
              <td className="px-4 py-3 font-medium text-slate-900">
                <Link href={`/shipments/${shipment.id}`}>{shipment.shipment_number}</Link>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {shipment.customer_name ?? shipment.customer_id}
              </td>
              <td className="px-4 py-3 text-slate-600">{shipment.origin_location}</td>
              <td className="px-4 py-3 text-slate-600">
                {shipment.destination_location}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {shipment.carrier_name ?? "-"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {shipment.driver_name ?? "-"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {shipment.vehicle_number ?? "-"}
              </td>
              <td className="px-4 py-3">
                <ShipmentStatusBadge status={shipment.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/shipments/${shipment.id}`}
                  className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  {viewerRole === "admin" || viewerRole === "dispatcher"
                    ? shipment.status === "draft" || shipment.status === "booked"
                      ? "Assign Dispatch"
                      : "Open Shipment"
                    : viewerRole === "driver"
                      ? "Update Load"
                      : "Track Shipment"}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
